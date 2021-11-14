//set up three js

const THREEJS_CONTAINER = document.getElementById('threejs-container');
const scene = new THREE.Scene();

scene.background = new THREE.Color( "rgb(255, 255, 255)" );

const camera = new THREE.PerspectiveCamera( 40, THREEJS_CONTAINER.clientWidth / THREEJS_CONTAINER.clientWidth, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( THREEJS_CONTAINER.clientWidth, THREEJS_CONTAINER.clientWidth );
THREEJS_CONTAINER.appendChild( renderer.domElement );

// orbit control
const controls = new THREE.OrbitControls( camera, renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// lighting
const light = new THREE.AmbientLight( "rgb(255, 255, 255)" ); // soft white light
scene.add( light );
const directionalLight = new THREE.DirectionalLight( "rgb(255, 255, 255)", 0.8 );
scene.add( directionalLight );

// model loader 
const loader = new THREE.GLTFLoader();
loader.load( './models/Tesla_CyberTruck.gltf', function ( gltf ) {
  gltf.scene.scale.set(0.01,0.01,0.01) // scale here
	scene.add( gltf.scene );
}, undefined, function ( error ) {
	console.error( error );
} );


const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// set camera positions
camera.position.set(0,-15,5); // Set position like this
camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like this

controls.update();
controls.addEventListener( 'change', render );
controls.minPolarAngle = 0;
controls.maxPolarAngle =  Math.PI * 0.5;

function render() {
  renderer.render( scene, camera );
}
// renderer.render( scene, camera );

// const animate = function () {
//   requestAnimationFrame( animate );

//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;

//   renderer.render( scene, camera );
// };

// animate();

// hamburger buttons and overlay
document.querySelector('#hamburger_btn').addEventListener('click', function(event) {
  if (this.classList.contains('active')) {
      this.classList.remove('active');
      document.getElementById("my_overlay").style.opacity = "0";
      document.getElementById("my_sidebar").style.width = "0";

  } else {
      this.classList.add('active');
      document.getElementById("my_overlay").style.opacity = "1";
      document.getElementById("my_sidebar").style.width = "40vw";
  }
});
