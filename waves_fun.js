// random
	function noise(min, max){
		return Math.random()*(max-min+1)+min;
	}
	function random_height(){ // normal distribution
	    var u = 0;
	    var v = 0;
	    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	    while(v === 0) v = Math.random();
	    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
	}

	function randomize_vertice_height(){

		for (var i=0; i<vertices.length; i+=3) {
			vertices[i+2] = random_height();
		}
		plane.geometry.attributes.position.needsUpdate = true;
		plane.geometry.computeVertexNormals();
	}

// Stałe i zbiory stałych
	
	var Amps = [];
	var Len = [];
	var omegs = [];
	var Spee = [];
	var Fee = [];
	var Dd = []
//	clearing params
	function clear_params(){
		Amps.length = 0;
		Len.length = 0;
		omegs.length = 0;
		Spee.length = 0;
		Fee.length = 0;
		Dd.length = 0;
	}
// setting random params
	function set_param_Amps(wave_num){
		Amps.length = 0;
		for (var i=1; i<wave_num; i++){
			//
			// Amps.push(noise(A/2, 2*A));
			// Amps.push(A/(i));

			Amps.push(A/(2*i*i));
		}
	}
	function set_param_Length(wave_num){
		Len.length = 0;
		omegs.length = 0;
		for (var i=1; i<wave_num; i++){
			// var Le = 3*Amps[i];
			// var Le = noise(L/2, 2*L);
			var Le = L/i;
			Len.push(Le);
			omegs.push(Math.sqrt(9.8*2*Math.PI/Le));
		}
		console.log(Len.toString());
		console.log("---------");
	}
	function set_param_Speed(wave_num){

		Spee.length = 0;
		Fee.length = 0;
		for (var i=1; i<wave_num; i++){
			var Ss = S*(i);
			Spee.push(Ss);
			Fee.push(Ss*2*Len[i-1]);
		}
	}
	function set_param_D(wave_num){
		Dd.length = 0;
		for (var i=1; i<wave_num; i++){
			D_x =(D_x+(random_height()*2/3)/i);
			D_y =(D_y+(random_height()*2/6)/i);
			Dd.push(new THREE.Vector2(D_x,D_y));
		}
	}
	function set_wav_num(wave_num){
		set_params(wave_num);
	}

	function set_params(wave_num){
		set_param_Amps(wave_num);
		set_param_Length(wave_num);
		set_param_Speed(wave_num);
		set_param_D(wave_num);

	}

// colorize
	function colorizeVertices(){
		var sum_pos = calcAvg();
		var lightness = [];
		var newColor = new THREE.Color();
		for (var x = 0; x<vertices.length; x+=3){
			// lightness.push(calculateVertexColor(vertices[x+2], sum_pos));
			var col = calculateVertexColor(vertices[x+2], sum_pos);
			newColor.setHSL(157/240,235/240,col);
			// plane.geometry.faces[x].vertexColors[x] = newColor;
			console.log(newColor);
		}
		plane.geometry.verticesNeedUpdate = true;
	}


// init
	function wave_function(){
		var t = clock.getElapsedTime(); // time
		getKPowerSurface(t);
		smoothen();

		plane.geometry.computeVertexNormals();
		plane.geometry.computeFaceNormals();
		// vertexHelper.update();
		plane.geometry.attributes.position.needsUpdate = true;
	}
// AVG
	function calcAvg(){
		var count = 0;
		var sum = 0;
		var count_pos = 0;
		var sum_pos = 0;
		for (var x=0;x<vertices.length;x+=3){
			count++;
			sum+=vertices[x+2];

			if (vertices[x+2]>0){
				count_pos++;
				sum_pos+=vertices[x+2];
			}
		}
		sum_pos = sum_pos/count_pos;
		sum = (sum+1)/count;
		// console.log("średnia wysokość: "+sum);
		// console.log("średnia dodatnia wysokość: "+sum_pos);
		return sum_pos;
//
}
	function colorize(){
		for (var i=0; i<positions.count;i++){
			color.setHSL = (157/240, 235/240, calculateVertexColor(positions.getZ(i),calcAvg()));
			colors.setXYZ(i, color.r, color.g, color.b);
		}
	}
//
	function calculateVertexColor(z, sum_pos){
		// 40- 170 // 2.8
		var vertexLightness = 0;
		if (z>2*sum_pos) {
			vertexLightness = 170/240;
		}
		if (z<sum_pos/2){
			vertexLightness = 40/240;
		}
		if (z>sum_pos/2 && z<2*sum_pos){
			var Aa = (138*6+1)/(6*sum_pos*sum_pos);
			var Bb = (31*3+1)/3;
			vertexLightness = (Aa*z*z+Bb)/240;
		}
		console.log(vertexLightness);
		return vertexLightness;
//
	}
	function smoothen(){
		for (var x =3; x<vertices.length; x+=3){
			vertices[x+2] = Math.pow(vertices[x+3+2] * vertices[x-3+2],1/2);
		}
	}
	function kroczaca(prev){
		for (var x=0; x<vertices.length; x+=3){
			vertices[x+2] = (prev[x+2]+vertices[x+2])/2;
		}
	}
//
// Drugie podjeście
	function getKPower2(t){
		for (var x=0; x<=vertices.length; x+=3){
			for (var y=x*(vertices.length/41)+1; y<=(1+x)*vertices.length/41; y+=3){
				var totalSurface = 0;
				for (var i=0; i<Amps.length; i++){
					totalSurface = totalSurface + getKPowerState(x,y,t,Amps[i],Dd[i],omegs[i],Fee[i],k);
				}
				vertices[y+1] = totalSurface ;
			}
		}
	}
//
	function savePrevious(){
		var previousSurface = vertices;
		return previousSurface;
	}

// Kth power surface
	function getKPowerSurface(t){
		// var calculatedSurface = [];
		for (var x=0; x<vertices.length; x+=3){
			var totalSurface = 0;
			for (var j=0; j<Dd.length; j++){
			}
			for (var i=0; i<Amps.length; i++){
				totalSurface = totalSurface + getKPowerState(x,x+1,t,Amps[i],Dd[i],omegs[i],Fee[i],k);
			}
			// calculatedSurface.push(x,x+1,totalSurface);
			vertices[x+2] = totalSurface;
		}
		// return calculatedSurface;
	}
	function getKPowerState(x,y,t,A,D,omega,fi,k){
		var xy_vec = new THREE.Vector2(x, y);
		var dotProd = D.dot(xy_vec);
		return 2*A*Math.pow((Math.sin(dotProd*omega+t*fi)+1)/2,k)
	}	
// niepotrzebne
//	Derivatives K X
	function calculateKthDerivativeX(t){
		var kDerivative_field = [];
		for (var x=0; x<vertices.length; i+=3){
			var kd_x = 0;
			for (var i=0; i<Amps.length; i++){
				kd_x = kd_x + getKthDerivX(x,x+1,t,Amps[i],Dd[i],omegs[i],Fee[i],k);
			}
			kDerivative_field.push(x,x+1,kd_x);
		}
		return derivative_field;
	}
	function getKthDerivX(x,y,t,A,D,omega,fi,k){
		var xy_vec = new THREE.Vector2( x, y );
		var dotProd = D.dot(xy_vec);
		var D_x = D.x;
		return k*D_x*omega*A* Math.pow( (Math.sin(dotProd*omega + t*fi )+1)/2 , k-1) * Math.cos(dotProd*omega + t*fi);
	}
// derivative X
	function calculateDerivativeX(t){
		var derivative_field = [];
		var d_x = 0;
		for (var x=0; x<vertices.length; x+=3){
			for (var i=0; i<Amps.length;i++){
				d_x += getDerivX(x,x+1,t,Amps[i],Dd[i],omegs[i],Fee[i]);
			}
			derivative_field.push(x,x+1,d_x);
		}
		return derivative_field;
	}
	function getDerivX(x,y,t,A,D,omega,fi){
		var xy_vec = new THREE.Vector2(x,y);
		var D_x = D.x;
		var dotProd = D.dot(xy_vec);
		return omega*D_x*A*Math.cos(dotProd*omega+t*fi);
	}
//
//	Calculate Z // k = 1
	function getTotalSurface(t){
		for (var x=0;x<vertices.length;x+=3){
			var totalSurface = 0;
			for (var i=0; i<Amps.length; i++){
				totalSurface = totalSurface + getStateOfWave(x,x+1,t,Amps[i],Dd[i],omegs[i],Fee[i]);
			}
			vertices[x+2] = totalSurface;
		}
	}
	function getStateOfWave(x,y,t,A,D,omega,fi){ // generate state of wave with xi, yi, ti, Ai, Di, omegai, fii
		var xy_vec = new THREE.Vector2( x, y );
		var dotProd = D.dot(xy_vec);
		var crossProd = dotProd*omega;
		return A*Math.sin(crossProd + t*fi);
	}

// render, animate
	function render_scene(){
		plane.geometry.computeVertexNormals();

		renderer.render(scene, camera);
	}
	function animate() {
		wave_function();
		var delta = clock.getDelta();
		// controls.update(delta);


		aGUI.onChange(function(value) {A=parameters.Amp; set_param_Amps(wave_num);});
		lGUI.onChange(function(value) {L=parameters.Length; set_param_Length(wave_num);});
		sGUI.onChange(function(value) {S=parameters.Speed; set_param_Speed(wave_num)});
		kGUI.onChange(function(value) {k=parameters.kWsp; wave_function();});
		dxGUI.onChange(function(value) {D_x=parameters.d_x; set_param_D(wave_num);});
		dyGUI.onChange(function(value) {D_y=parameters.d_y; set_param_D(wave_num);});
		waveGUI.onChange(function(value) {wave_num = parameters.wave_num; set_wav_num(wave_num);})
		plane.geometry.computeVertexNormals();
		plane.geometry.computeFaceNormals();

		// vertexHelper.needsUpdate = true;

		// plane.material.needsUpdate = true;

		requestAnimationFrame(animate);
		render_scene();
	}