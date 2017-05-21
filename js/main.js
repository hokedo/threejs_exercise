// var scene = createScene();
// var camera = createCamera();
// var renderer = createRenderer()
// var axis = createAxis();
// var cube = createCube();
// var grid = createGrid();
// var plane = createPlane();
// var spotLight = createSpotlight();
// var controls = createControls();
// var dragControls = createDragControls();
// var datGUI;


function createScene(){
	var scene = new THREE.Scene();
	return scene;
}

function createCube(){
	var cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
	var cubeMaterial = new THREE.MeshLambertMaterial(
		{
			color:0xff3300,
			wireframe: false
		}
	);
	var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cube.position.x = 2.5;
	cube.position.y = 2.5;
	cube.position.z = 2.5;

	cube.castShadow = true;

	return cube;
}

function createCamera(){
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 500);
	camera.position.x = 40;
	camera.position.y = 40;
	camera.position.z = 40;
	return camera;
}

function createRenderer(){
	var renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x000000);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	return renderer;
}

function createAxis(){
	var axis = new THREE.AxisHelper(10);
	return axis;
}

function createGrid(){
	var grid =  new THREE.GridHelper(50, 5, 0x0000ff, 0x808080);
	var color =  new THREE.Color("rgb(255,0,0)");
	//grid.setColors();
	return grid;
}

function createPlane(){
	var planeGeometry = new THREE.PlaneGeometry(30, 30, 30);
	var planeMaterial = new THREE.MeshLambertMaterial(
		{
			color: 0xffffff,
		}
	);
	var plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = -.5*Math.PI;
	plane.receiveShadow = true;

	return plane;
}

function createSpotlight(){
	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.castShadow = true;
	spotLight.position.set(15, 30, 50);
	return spotLight;
}

function render(){
	cube.rotation.x += guiControls.rotationX;
	cube.rotation.y += guiControls.rotationY;
	cube.rotation.z += guiControls.rotationZ;
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

function createGUI(){
	var datGUI = new dat.GUI();
	return datGUI;
}

function createControls(){
	var controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.target.set( 0, 0, 0 );
	return controls;
}

function createDragControls(){
	var dragControls = new THREE.DragControls( [cube], camera, renderer.domElement );
	dragControls.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } );
	dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );
	return dragControls;
}

var guiControls = new function(){
	this.rotationX = 0.01;
	this.rotationY = 0.01;
	this.rotationZ = 0.01;
}

function onDocumentMouseMove( event ) {

    event.preventDefault();

    if ( isMouseDown ) {

        theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 )
                + onMouseDownTheta;
        phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 )
              + onMouseDownPhi;

        phi = Math.min( 180, Math.max( 0, phi ) );

        camera.position.x = radious * Math.sin( theta * Math.PI / 360 )
                            * Math.cos( phi * Math.PI / 360 );
        camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
        camera.position.z = radious * Math.cos( theta * Math.PI / 360 )
                            * Math.cos( phi * Math.PI / 360 );
        camera.updateMatrix();

    }

    mouse3D = projector.unprojectVector(
        new THREE.Vector3(
            ( event.clientX / renderer.domElement.width ) * 2 - 1,
            - ( event.clientY / renderer.domElement.height ) * 2 + 1,
            0.5
        ),
        camera
    );
    ray.direction = mouse3D.subSelf( camera.position ).normalize();

    interact();
    render();

}


$(document).ready(function(){
	 if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

		var container;
		var camera, scene, renderer;
		var plane, cube;
		var mouse, raycaster, isShiftDown = false;

		var rollOverMesh, rollOverMaterial;
		var cubeGeo, cubeMaterial;

		var objects = [];

		init();
		render();

		function init() {

			container = document.createElement( 'div' );
			document.body.appendChild( container );

			camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
			camera.position.set( 500, 800, 1300 );
			camera.lookAt( new THREE.Vector3() );

			scene = new THREE.Scene();

			// roll-over helpers

			rollOverGeo = new THREE.BoxGeometry( 50, 50, 50 );
			rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
			rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
			scene.add( rollOverMesh );

			// cubes

			cubeGeo = new THREE.BoxGeometry( 50, 50, 50 );
			cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c, map: new THREE.TextureLoader().load( "textures/square-outline-textured.png" ) } );

			// grid

			var size = 500, step = 50;

			var geometry = new THREE.Geometry();

			for ( var i = - size; i <= size; i += step ) {

				geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
				geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

				geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
				geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

			}

			var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );

			var line = new THREE.LineSegments( geometry, material );
			scene.add( line );

			//

			raycaster = new THREE.Raycaster();
			mouse = new THREE.Vector2();

			var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
			geometry.rotateX( - Math.PI / 2 );

			plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
			scene.add( plane );

			objects.push( plane );

			// Lights

			var ambientLight = new THREE.AmbientLight( 0x606060 );
			scene.add( ambientLight );

			var directionalLight = new THREE.DirectionalLight( 0xffffff );
			directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
			scene.add( directionalLight );

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setClearColor( 0xf0f0f0 );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			container.appendChild( renderer.domElement );

			document.addEventListener( 'mousemove', onDocumentMouseMove, false );
			document.addEventListener( 'mousedown', onDocumentMouseDown, false );
			document.addEventListener( 'keydown', onDocumentKeyDown, false );
			document.addEventListener( 'keyup', onDocumentKeyUp, false );

			//

			window.addEventListener( 'resize', onWindowResize, false );

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		function onDocumentMouseMove( event ) {

			event.preventDefault();

			mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

			raycaster.setFromCamera( mouse, camera );

			var intersects = raycaster.intersectObjects( objects );

			if ( intersects.length > 0 ) {

				var intersect = intersects[ 0 ];

				rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
				rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

			}

			render();

		}

		function onDocumentMouseDown( event ) {

			event.preventDefault();

			mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

			raycaster.setFromCamera( mouse, camera );

			var intersects = raycaster.intersectObjects( objects );

			if ( intersects.length > 0 ) {

				var intersect = intersects[ 0 ];

				// delete cube

				if ( isShiftDown ) {

					if ( intersect.object != plane ) {

						scene.remove( intersect.object );

						objects.splice( objects.indexOf( intersect.object ), 1 );

					}

				// create cube

				} else {

					var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
					voxel.position.copy( intersect.point ).add( intersect.face.normal );
					voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
					scene.add( voxel );

					objects.push( voxel );

				}

				render();

			}

		}

		function onDocumentKeyDown( event ) {

			switch( event.keyCode ) {

				case 16: isShiftDown = true; break;

			}

		}

		function onDocumentKeyUp( event ) {

			switch ( event.keyCode ) {

				case 16: isShiftDown = false; break;

			}

		}

		function render() {

			renderer.render( scene, camera );

		}
});