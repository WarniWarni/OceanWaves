function set_camera(w_width, w_height){
	// camera
	var c_fow = 45; // fow == frustum vertical field of view. // stożek ścięty
	var c_aspect = w_width/w_height; // aspect ratio of camera
	var c_near = 0.01; // bliższa płaszczyzna stożka ściętego
	var c_far = 1000; // dalsza płaszczyzna stożka ściętego
	camera = new THREE.PerspectiveCamera( c_fow, c_aspect, c_near, c_far );
	camera.position.set( 0, -30, 30 );
	camera.lookAt(scene.position);
	// console.log(camera.position);
}
// 
function create_plane(scene){
	// plane
	var p_width = 60;
	var p_height = 40;
	var p_segmentsDepth = 30;
	var p_segmentsWidth = Math.round((3/2)*p_segmentsDepth);

	// var tex = new THREE.TextureLoader().load( '11.png' );

	geometry = new THREE.PlaneBufferGeometry(p_width, p_height, p_segmentsWidth, p_segmentsDepth );
	geometry.dynamic = true;
	geometry.verticesNeedUpdate = true;
	geometry.computeBoundingSphere();
	geometry.computeVertexNormals();
	geometry.computeFaceNormals();
	// geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
	// material = new THREE.MeshPhongMaterial({side:THREE.DoubleSide, displacementMap:tex, displacementScale: 10, displacementBias:0 });
	var colorr = new THREE.Color();
	colorr.setHSL(157/240,235/240,155/240);
	var col = 0x003fff;

	// geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.count*3)),3);
	// geometry.attributes.color.count = geometry.attributes.position.count;
	var texture = new THREE.TextureLoader().load('texture_2.jpg');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(4,4);

	material = new THREE.MeshLambertMaterial({color: colorr, map:texture, refractionRatio: 0.985, opacity: 0.9, side:THREE.DoubleSide,reflectivity:0.7, combine:THREE.AddOperation, emissive:0x003fff, emissiveIntensity: 0.2, precision: "highp", dithering: true});//, vertexColors: geometry.attributes.color});

//  LambertMaterial
	material.flatShading = false;


	plane = new THREE.Mesh(geometry, material);

	plane.receiveShadow = true;
	plane.castShadow = true;
	scene.add(plane);


}
// ======================================================

function set_controls(){
	controls = new THREE.TrackballControls( camera );

	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;

	controls.noZoom = false;
	controls.noPan = false;

	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	controls.keys = [ 65, 83, 68 ];

	controls.addEventListener( 'change', render_scene );
}

function set_light(scene, sphere_mesh){
	// light
	var ambient_light = new THREE.AmbientLight( 0xb0ffc1, 0.45 );
	var point_light = new THREE.PointLight( 0xffef47, 1, 100 );
	point_light.castShadow = true;
	point_light.position.set( 20, 30, 63 );
	point_light.castShadow = true;

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-80, 0, 60);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 2;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 130;
    spotLight.target = plane;
    spotLight.distance = 0;
	// scene.add(spotLight);

	var spotLight2 = new THREE.SpotLight(0xffffff);
	spotLight2.position.set(80,0,100);
	spotLight2.castShadow = true;
	spotLight2.shadow.camera.near = 2;
	spotLight2.shadow.camera.far = 200;
	spotLight2.shadow.camera.fov = 130;
	spotLight2.target = plane;
	spotLight2.distance = 0;
	// scene.add(spotLight2);

	var spotLight3 = new THREE.SpotLight(0xffffff);
	spotLight3.position.set(0,0,50);
	spotLight3.castShadow = true;
	spotLight3.shadow.camera.near = 2;
	spotLight3.shadow.camera.far = 200;
	spotLight3.shadow.camera.fov = 130;
	spotLight3.target = plane;
	spotLight3.distance = 0;

	// scene.add(spotLight3);

	
	// var helper = new THREE.CameraHelper(point_light.shadow.camera);
	
	scene.add(ambient_light);
	scene.add(point_light);
	// scene.add(helper);


	var point_light2 = new THREE.PointLight( 0xffef47, 100, 0, 2 );
	// point_light2.castShadow = true;
	point_light2.position.set( -30, 20, 15 );
	// scene.add(point_light2);
	// var point_light_helper = new THREE.PointLightHelper(point_light2, 0.3);
	// scene.add(point_light_helper);

	var point_light3 = new THREE.PointLight(0xffffff, 10,0,2);
	// point_light3.castShadow = true;	
	point_light3.position.set(0,-20,5);
	scene.add(point_light3);


}
// 
function set_renderer(w_width, w_height){
	// renderer
	renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true} );
	renderer.setClearColor(0x71a4ff, 0.8); // ustawienie koloru tła i przezroczystości
	renderer.shadowMap.enabled = true;
	renderer.setSize(w_width, w_height);
	document.body.appendChild(renderer.domElement);}
// ======================================================
// ======================================================
