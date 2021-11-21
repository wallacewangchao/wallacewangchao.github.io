//set up three js
let tesla;
let camera, scene, renderer, controls;
const THREEJS_CONTAINER = document.getElementById('threejs-container');

init();
animate();

function init(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color( "rgb(255, 255, 255)" );
  
  camera = new THREE.PerspectiveCamera( 25, THREEJS_CONTAINER.clientWidth / THREEJS_CONTAINER.clientHeight, 0.1, 1000 );
  // camera = new THREE.OrthographicCamera( THREEJS_CONTAINER.clientWidth / - 2, THREEJS_CONTAINER.clientWidth / 2, THREEJS_CONTAINER.clientHeight / 2, THREEJS_CONTAINER.clientHeight / - 2, 1, 1000 );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( THREEJS_CONTAINER.clientWidth, THREEJS_CONTAINER.clientHeight );
  
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  // renderer.shadowCameraNear = 1;
  // renderer.shadowCameraFar = 500;
  // renderer.shadowCameraFov = 60;

  // renderer.shadowMapBias = -0.0005;
  // renderer.shadowMapDarkness = 1;
  // renderer.shadowMapWidth = 2048;
  // renderer.shadowMapHeight = 2048;

  THREEJS_CONTAINER.appendChild( renderer.domElement );
  
  
  // lighting
  // const ambientLight = new THREE.AmbientLight( "rgb(255, 255, 255)", 1 ); // soft white light
  // ambientLight.castShadow = true; // default false
  // scene.add( ambientLight );
  
  // const directionalLight = new THREE.DirectionalLight( "rgb(255, 255, 255)", 0.8 );
  // scene.add( directionalLight );
  
  /**
   * LIGHTS
  **/
  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
  hemiLight.color.setHSL( 0.6, 1, 0.6 );
  hemiLight.position.set( 300, 500, 200 );
  // hemiLight.castShadow = true;

  scene.add( hemiLight );

  const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
  scene.add( hemiLightHelper );

  // direction light
  const dirLight = new THREE.DirectionalLight( "rgb(255, 255, 255)", 1 );
  dirLight.color.setHSL( 0.1, 1, 0.95 );
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

  const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
  scene.add( dirLightHelper );

  // const pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
  // pointLight.position.set( 10, 10, 10 );
  // scene.add( pointLight );
  
  // custumised direction light 1
  // const light1 = new THREE.DirectionalLight( 0xefefff, 0.5 );
  // light1.position.set( 1, 1, 1 ).normalize();
  // scene.add( light1 );

  // light1.castShadow = true;
  // light1.shadowMapBias = -0.001;
  // light1.shadowMapHeight = 128;
  // light1.shadowMapWidth = 128;
  // light1.shadowCameraFar = 500;
  // light1.shadowCameraNear = 0.1;
  // light1.shadow.camera.left = 500;
  // light1.shadow.camera.right = -500;
  // light1.shadow.camera.top = 500;
  // light1.shadow.camera.bottom = -50;

  // const light1Helper = new THREE.DirectionalLightHelper( light1, 30 );
  // scene.add( light1Helper );

  /**
   * debug object
  **/  
  // const sphereGeometry = new THREE.SphereGeometry( 1, 32, 32 );
  // const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
  // const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  // sphere.castShadow = true; //default is false
  // sphere.receiveShadow = false; //default
  // scene.add( sphere );

  // model loader 
  const loader = new THREE.GLTFLoader();
  loader.load( './models/home.gltf', function ( gltf ) {
    console.log(gltf);
    const root = gltf.scene;

    root.traverse( function( node ) {
      if ( node.isMesh ) {
          if ( node.name === "Cube" || node.name === "whole_body") {
            console.log("set cube");   
            // node.material =  new THREE.MeshNormalMaterial();
            node.receiveShadow = true;
            node.castShadow = false;
          } else{            
            node.receiveShadow = true;
            node.castShadow = true;
          }
        }
    });
    scene.add( root );
    console.log(gltf);

  }, function(xhr){
    console.log(xhr.loaded/xhr.total * 100) + "% loaded";
  }, function ( error ) {
    console.error( error );
  } );
  
  // Axes Helper
  const axesHelper = new THREE.AxesHelper( 5 );
  scene.add( axesHelper );
  
  // set camera positions
  camera.position.set( 10, 10, 10 ); // Set position like this
  // camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like this
  

  // orbit control
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.update();
  controls.addEventListener( 'change', render );
  controls.minPolarAngle = Math.PI * 0.25;
  controls.maxPolarAngle = Math.PI * 0.25;
  controls.target.set( 0, 0.5, 0 );
  controls.enableDamping = true;
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

/**
 * Set up hamburger overlay
 */
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
