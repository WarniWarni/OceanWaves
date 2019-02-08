// random
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
	function set_params(){
		clear_params();
		for (var i=1; i<2; i++){
			Amps.push(A/(2*i));
				var Le = L-(L/(2*i));
			Len.push(Le);
			omegs.push(2*Math.PI/Le);
				var Ss = S - (S/(2*i));
			Spee.push(Ss);
			Fee.push(Ss*2*Le);
			Dd.push(new THREE.Vector2(D_x,D_y));;
		}
	}


// init
	function wave_function(){
		var t = clock.getElapsedTime(); // time
		// var prev = savePrevious();
		getKPowerSurface(t);
		smoothen();
		// kroczaca(prev);

		// getKPower2(t);
		plane.geometry.computeVertexNormals();
		plane.geometry.attributes.position.needsUpdate = true;
		// plane.geometry.computeVertexNormals();
	}
// wygładzanie
	function smoothen(){
		for (var x =3; x<vertices.length; x+=3){
			vertices[x+2] = (vertices[x+3+2] + vertices[x-3+2])/2;
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
		renderer.render(scene, camera);
	}
	function animate() {
		wave_function();
		var delta = clock.getDelta();
		// controls.update(delta);


		aGUI.onChange(function(value) {A=parameters.Amp; set_params();});
		lGUI.onChange(function(value) {L=parameters.Length; set_params();});
		sGUI.onChange(function(value) {S=parameters.Speed; set_params();});
		kGUI.onChange(function(value) {k=parameters.kWsp; set_params();});
		dxGUI.onChange(function(value) {D_x=parameters.d_x; set_params();});
		dyGUI.onChange(function(value) {D_y=parameters.d_y; set_params();});

		plane.geometry.computeVertexNormals();


		requestAnimationFrame(animate);
		render_scene();
	}