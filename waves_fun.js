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
	const A = 0.25; // amplitude of wave
	const L = 10; // wavelength
	const omega = 2*Math.PI/L;
	const g = 9.81; // gravitational force
	const S = 0.2; // speed of wave
	const fi = S*2*L; // phase dependant of speed
	const D = new THREE.Vector2( 1, 0 ); // wind direction vector
	const k = 5;
	//
	var Amps = [];
	var Len = [];
	var omegs = [];
	var Spee = [];
	var Fee = [];
	var Dd = []
	//	
	for (var i=0; i<5; i++){
		Amps.push(A*Math.abs(random_height()));
			var Le = L*Math.abs(random_height());
		Len.push(Le);
		omegs.push(2*Math.PI/Le);
			var Ss = S*Math.abs(random_height());
		Spee.push(Ss);
		Fee.push(Ss*2*Le);
		Dd.push(new THREE.Vector2( Math.abs(random_height()), Math.abs(random_height())/2));
	}
	// console.log("\nAmplitudy: "+Amps+"\ndługości fali: "+Len+"\nomegi: "+omegs+"\nspeeds: "+Spee+"\nprzesunięcia fazowe: "+Fee+"\nwiatr: "+Dd);
	
// init
	function wave_function(){
		var t = clock.getElapsedTime(); // time
		// getTotalSurface(t);
		getKPowerSurface(t);

		plane.geometry.attributes.position.needsUpdate = true;
		plane.geometry.computeVertexNormals();
	}

// kth power
	function getKPowerSurface(t){
		for (var x=0; x<vertices.length; x+=3){
			var totalSurface = 0;
			for (var i=0; i<Amps.length; i++){
				totalSurface = totalSurface + getKPowerState(x,x+1,t,Amps[i],Dd[i],omegs[i],Fee[i],k);
			}
			vertices[x+2] = totalSurface;
		}
	}
	function getKPowerState(x,y,t,A,D,omega,fi,k){
		var xy_vec = new THREE.Vector2(x, y);
		return 2*A*Math.pow((Math.sin(D.dot(xy_vec)*omega+t*fi)+1)/2,k)
	}

//	Derivatives
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
		requestAnimationFrame(animate);
		render_scene();
	}