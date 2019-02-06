function set_camera(w_width, w_height){
	// camera
	var c_fow = 45; // fow == frustum vertical field of view. // stożek ścięty
	var c_aspect = w_width/w_height; // aspect ratio of camera
	var c_near = 0.01; // bliższa płaszczyzna stożka ściętego
	var c_far = 1000; // dalsza płaszczyzna stożka ściętego
	camera = new THREE.PerspectiveCamera( c_fow, c_aspect, c_near, c_far );
	camera.position.set( 0, -50, 30 );
	camera.lookAt(scene.position);
	// console.log(camera.position);
}
// 
function create_plane(scene){
	// plane
	var p_width = 60;
	var p_height = 40;
	var p_segmentsDepth = 30;
	var p_segmentsWidth = 45;

	// var tex = new THREE.TextureLoader().load( '11.png' );

	geometry = new THREE.PlaneBufferGeometry(p_width, p_height, p_segmentsWidth, p_segmentsDepth );
	geometry.dynamic = true;
	geometry.verticesNeedUpdate = true;
	geometry.computeVertexNormals();
	// material = new THREE.MeshPhongMaterial({side:THREE.DoubleSide, displacementMap:tex, displacementScale: 10, displacementBias:0 });
	material = new THREE.MeshPhongMaterial({side:THREE.DoubleSide});
	material.flatShading = true;

	plane = new THREE.Mesh(geometry, material);

	plane.receiveShadow = true;
	plane.castShadow = true;
	scene.add(plane);
}
// ======================================================

function set_light(scene, sphere_mesh){
	// light
	var ambient_light = new THREE.AmbientLight( 0xb0ffc1, 0.45 );
	var point_light = new THREE.PointLight( 0xffef47, 1, 100 );
	point_light.castShadow = true;
	point_light.position.set( 20, 30, 63 );
	point_light.castShadow = true;

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-80, 0, 10);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 2;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 130;
    spotLight.target = plane;
    spotLight.distance = 0;
	scene.add(spotLight);

	var point_light_helper = new THREE.PointLightHelper(point_light, 0.3);
	var helper = new THREE.CameraHelper(point_light.shadow.camera);
	
	scene.add(ambient_light);
	scene.add(point_light);
	scene.add(helper);
	scene.add(point_light_helper);}
// 
function set_renderer(w_width, w_height){
	// renderer
	renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true} );
	renderer.setClearColor(0x0104ff, 0.8); // ustawienie koloru tła i przezroczystości
	renderer.shadowMap.enabled = true;
	renderer.setSize(w_width, w_height);
	document.body.appendChild(renderer.domElement);}
// ======================================================
// ======================================================