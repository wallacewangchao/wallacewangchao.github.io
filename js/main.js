//set up three js
let camera, scene, renderer, controls;
let dirLight, spotLight;
let shadowGroup, renderTarget, renderTargetBlur, shadowCamera, cameraHelper, depthMaterial, horizontalBlurMaterial, verticalBlurMaterial;
const PLANE_WIDTH = 2.5;
const PLANE_HEIGHT = 2.5;
const CAMERA_HEIGHT = 0.3;
const state = {
  shadow: {
    blur: 3.5,
    darkness: 1,
    opacity: 1,
  },
  plane: {
    color: '#ffffff',
    opacity: 1,
  },
  showWireframe: false,
};


const THREEJS_CONTAINER = document.getElementById('threejs-container');

init();
animate();

function init() {

  initScene();

  // Init gui
  // const gui = new dat.GUI();

  // const config = {
  //   spotlightRadius: 4,
  //   spotlightSamples: 8,
  //   dirlightRadius: 4,
  //   dirlightSamples: 8
  // };

  // const dirlightFolder = gui.addFolder( 'Directional Light' );
  // dirlightFolder.add( config, 'dirlightRadius' ).name( 'radius' ).min( 0 ).max( 800 ).onChange( function ( value ) {

  //   dirLight.shadow.radius = value;
  //   console.log(value);
  // } );

  // dirlightFolder.add( config, 'dirlightSamples', 1, 4000, 1 ).name( 'samples' ).onChange( function ( value ) {

  //   dirLight.shadow.blurSamples = value;

  // } );
  // dirlightFolder.open();

  window.addEventListener( 'resize', onWindowResize );

}



function initScene(){

  scene = new THREE.Scene();
  scene.background = new THREE.Color( "rgb(255, 255, 255)" );
  // scene.fog = new THREE.Fog( "rgb(255, 255, 255)", 10, 50 );

  camera = new THREE.PerspectiveCamera( 25, THREEJS_CONTAINER.clientWidth / THREEJS_CONTAINER.clientHeight, 0.001, 1000 );
  // camera = new THREE.OrthographicCamera( THREEJS_CONTAINER.clientWidth / - 2, THREEJS_CONTAINER.clientWidth / 2, THREEJS_CONTAINER.clientHeight / 2, THREEJS_CONTAINER.clientHeight / - 2, 1, 1000 );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( THREEJS_CONTAINER.clientWidth, THREEJS_CONTAINER.clientHeight );
  
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  THREEJS_CONTAINER.appendChild( renderer.domElement );
  
  /**
   * LIGHTS
  **/
  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.3 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  hemiLight.position.set( 300, 500, 200 );
  scene.add( hemiLight );

  // const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
  // scene.add( hemiLightHelper );

  // const light = new THREE.AmbientLight( "rgb(255, 255, 255)", 0.1 ); // soft white light
  // scene.add( light );

  // direction light
  dirLight = new THREE.DirectionalLight( "rgb(255, 255, 255)", 0.8 );
  // dirLight.color.setHSL( 0.1, 1, 0.95 );
  dirLight.position.set( - 1, 1.75, 1 );
  dirLight.position.multiplyScalar( 10 );

  const d = 8;

  dirLight.shadow.camera.left = - d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = - d;

  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  dirLight.shadow.camera.far = 45;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.fov = 45;

  dirLight.shadow.bias = - 0.0001;
  dirLight.castShadow = true;
  scene.add( dirLight );

  // const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 6 );
  // scene.add( dirLightHelper );
  
  const dirLight2 = new THREE.DirectionalLight( "rgb(255, 255, 255)", 0.6 );
  dirLight2.position.set( 1, 1.75, 0 );
  // dirLight2.position.multiplyScalar( 5 );
  dirLight2.castShadow = false;
  scene.add( dirLight2 );

  // model loader 
  const loader = new THREE.GLTFLoader();
  loader.load( './models/robot_car_me/robot_car_me.gltf', function ( gltf ) {
    const root = gltf.scene;
    root.castShadow = true;
    gltf.scene.receiveShadow = true;

    root.traverse( function( node ) {
      if ( node.isMesh ) {
          if ( node.type === "SkinnedMesh" ) {
            console.log("set cube");   
            node.frustumCulled = false;
          }
          node.receiveShadow = true;
          node.castShadow = true;
        }
    });
    scene.add( root );
    console.log(gltf);

  }, function(xhr){
    // console.log(xhr.loaded/xhr.total * 100) + "% loaded";
  }, function ( error ) {
    console.error( error );
  } );
  

  const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: "rgb(255, 240, 210)", depthWrite: false } ) );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );
  console.log( mesh );

  // Axes Helper
  // const axesHelper = new THREE.AxesHelper( 5 );
  // scene.add( axesHelper );
  
  // set camera positions
  camera.position.set( 10, 10, 10 ); // Set position like this
  // camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like this

  // orbit control
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.update();
  controls.addEventListener( 'change', render );
  controls.minPolarAngle = Math.PI * 0.25;
  // controls.maxPolarAngle = Math.PI * 0.25;
  controls.target.set( 0, 0.5, 0 );
  controls.enableDamping = true;

  window.addEventListener( 'resize', onWindowResize );

}


function render() {
  renderer.render( scene, camera );
}

function onWindowResize() {
  camera.aspect = THREEJS_CONTAINER.clientWidth / THREEJS_CONTAINER.clientWidth;
  camera.updateProjectionMatrix();
  renderer.setSize( THREEJS_CONTAINER.clientWidth / THREEJS_CONTAINER.clientWidth );
}

function animate() {

  requestAnimationFrame( animate );
  controls.update(); // required if damping enabled
  render();

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

/**
 * Set up hamburger overlay
 */
// document.querySelector('#hamburger_btn').addEventListener('click', function(event) {
//   if (this.classList.contains('active')) {
//       this.classList.remove('active');
//       document.getElementById("my_overlay").style.opacity = "0";
//       document.getElementById("my_sidebar").style.width = "0";

//   } else {
//       this.classList.add('active');
//       document.getElementById("my_overlay").style.opacity = "1";
//       document.getElementById("my_sidebar").style.width = "40vw";
//   }
// });
