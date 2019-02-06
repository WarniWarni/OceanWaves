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

function wave_function(){
	// vertices[3k] = x1,x2..., vertices[3k+1] = y1,y2..., vertices[3k+2] = z1,z2...
	// var vertices = plane.geometry.attributes.position.array; // powinno być nazewnątrz, żeby nie wyliczać chyba każdego wierzchołka. Bierzemy x i y a potem ustawiamy mu z. To wystarczy dla każdego x, dla każdego y ustaw z(x,y,t)
	// for (var i=0; i<vertices.length; i+=3){	
	// }
	var t = clock.getElapsedTime(); // time

	const A = 0.25; // amplitude of wave
	const L = 15; // wavelength
	const omega = 2*Math.PI/L;
	const g = 9.81; // gravitational force
	const S = 0.2; // speed of wave
	const fi = S*2*L; // phase dependant of speed
	const D = new THREE.Vector2( 1, 0 ); // wind direction vector
	//
	var x = 1;
	var y = 1;
	//
	for (x=0; x<vertices.length; x+=3){
		var state = getStateOfWave(x,x+1,t,A,D,omega,fi);
		vertices[x+2] = state;
	}
	plane.geometry.attributes.position.needsUpdate = true;
	plane.geometry.computeVertexNormals();
}
function getStateOfWave(x,y,t,A,D,omega,fi){
	var xy_vec = new THREE.Vector2( x, y );
	var dotProd = D.dot(xy_vec);
	var crossProd = dotProd*omega;
	return A*Math.sin(crossProd + t*fi);
}

function render_scene(){
	renderer.render(scene, camera);
}
function animate() {
	wave_function();
	requestAnimationFrame(animate);
	render_scene();
}
