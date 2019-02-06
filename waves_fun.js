function random_height(){ // normal distribution
    var u = 0, v = 0;
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
	var t_ = clock.getElapsedTime();
	const Amp = 1/4;
	const lambda = 7;
	const k = 2*Math.PI/lambda;
	
	const Amp2 = Amp/2;
	const Amp3 = Amp2*3/4;
	const Amp4 = Amp3*3/4;

	const k2 = 2*k;
	const k3 = 3*k;
	const k4 = 4*k;

	const g = 9.81;
	const w = Math.sqrt(k*g);

	const w2 = Math.sqrt(k2*g);
	const w3 = Math.sqrt(k3*g);
	const w4 = Math.sqrt(k4*g);

	const x0 = 1;
	var K = 3;
	for (var xx=0; xx<vertices.length; xx+=31){
		for (var x=xx; x<xx+31; x+=3){
			// vertices[x] = x0 - (K/k)*Amp*Math.sin(K*x - w*t_);
			vertices[x+2] = Math.sqrt(Math.pow(Amp*Math.cos(x0*K - w*t_),2) + Math.pow(x0-(K/k)*Amp*Math.sin(K*x-w*t_),2)) 
			+ Math.sqrt(Math.pow(Amp2*Math.cos(x0*K - w2*t_),2) + Math.pow(x0-(K/k2)*Amp*Math.sin(K*x-w2*t_),2))
			+ Math.sqrt(Math.pow(Amp3*Math.cos(x0*K - w3*t_),2) + Math.pow(x0-(K/k3)*Amp*Math.sin(K*x-w3*t_),2))
			+ Math.sqrt(Math.pow(Amp4*Math.cos(x0*K - w4*t_),2) + Math.pow(x0-(K/k4)*Amp*Math.sin(K*x-w4*t_),2));

		}
	}

	// for (var x=0; x<vertices.length; x+=3){
	// 		vertices[x+2] = Amp * Math.sin(x/10 + t_)+ Amp/2 * Math.sin(x/5 + t_/2) + 3*Amp/8 * Math.sin(x + t_/4);
	// }
	plane.geometry.attributes.position.needsUpdate = true;
	plane.geometry.computeVertexNormals();
}
function create_wave() {
	// delta = clock.getDelta();
	var t_ = clock.getElapsedTime();
	wave_function(t_);
	// positions__ <= position matrix x, y, z
	// console.log(delta);
	// console.log(elapsedTime);
}
//
/*function animate_nothing(){
	requestAnimationFrame(render_scene);
	renderer.render(scene,camera);
}*/
function render_scene(){
	renderer.render(scene, camera);
}
function animate() {
	// randomize_vertice_height();
	// create_wave();
	wave_function();
	// say_framerate();
	requestAnimationFrame(animate);
	render_scene();
	// renderer.render(scene, camera);
}
//