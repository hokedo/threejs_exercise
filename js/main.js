var scene = createScene();
var camera = createCamera();
var renderer = createRenderer()
var axis = createAxis();
var cube = createCube();
var grid = createGrid();
var plane = createPlane();
var spotLight = createSpotlight();
var datGUI;

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

var guiControls = new function(){
	this.rotationX = 0.01;
	this.rotationY = 0.01;
	this.rotationZ = 0.01;
}


$(document).ready(function(){
	scene.add(axis);
	scene.add(cube);
	scene.add(grid);
	scene.add(spotLight);
	scene.add(plane);

	datGUI = createGUI();
	datGUI.add(guiControls, 'rotationX' , 0, 1);
	datGUI.add(guiControls, 'rotationY' , 0, 1);
	datGUI.add(guiControls, 'rotationZ' , 0, 1);

	camera.lookAt(scene.position);
	$("#webGL-container").append(renderer.domElement);
	render(renderer, cube, scene, camera);
});