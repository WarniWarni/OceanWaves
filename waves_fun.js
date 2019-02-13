// random
	function random_(){ // normal distribution
	    var u = 0;
	    var v = 0;
	    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	    while(v === 0) v = Math.random();
	    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
	}
// Stałe i zbiory stałych
	
	var Amps = [];
	var Len = [];
	var omegs = [];
	var Spee = [];
	var Fee = [];
	var Dd = []

// setting params
	function set_param_Amps(wave_num){
		Amps.length = 0;
		for (var i=1; i<wave_num; i++){
			Amps.push(A/(2*i*i));
		}
	}
	function set_param_Length(wave_num){
		Len.length = 0;
		omegs.length = 0;
		for (var i=1; i<wave_num; i++){
			var Le = L/i;
			Len.push(Le);
			omegs.push(Math.sqrt(9.8*2*Math.PI/Le));
		}

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
			D_x =(D_x+(random_()*2/3)/i);
			D_y =(D_y+(random_()*2/6)/i);
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

// init
	function wave_function(){
		var t = clock.getElapsedTime();
		getKPowerSurface(t);
		smoothen();

		plane.geometry.computeVertexNormals();
		plane.geometry.computeFaceNormals();
		plane.geometry.attributes.position.needsUpdate = true;
	}

	function smoothen(){
		for (var x =3; x<vertices.length; x+=3){
			vertices[x+2] = Math.pow(vertices[x+3+2] * vertices[x-3+2],1/2);
		}
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
		return Math.sqrt(k)*2*A*Math.pow((Math.sin(dotProd*omega+t*fi)+1)/2,k)
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

		aGUI.onChange(function(value) {A=parameters.Amp; set_param_Amps(wave_num);});
		lGUI.onChange(function(value) {L=parameters.Length; set_param_Length(wave_num);});
		sGUI.onChange(function(value) {S=parameters.Speed; set_param_Speed(wave_num)});
		kGUI.onChange(function(value) {k=parameters.kWsp; wave_function();});
		dxGUI.onChange(function(value) {D_x=parameters.d_x; set_param_D(wave_num);});
		dyGUI.onChange(function(value) {D_y=parameters.d_y; set_param_D(wave_num);});
		waveGUI.onChange(function(value) {wave_num = parameters.wave_num; set_wav_num(wave_num);})
		plane.geometry.computeVertexNormals();
		plane.geometry.computeFaceNormals();
		plane.material.map.offset.x+=0.01*parameters.d_x;
		plane.material.map.offset.y+=0.01*parameters.d_y;

		requestAnimationFrame(animate);
		render_scene();
	}