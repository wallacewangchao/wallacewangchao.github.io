//set up three js
let tesla;
let camera, scene, renderer, controls;
const THREEJS_CONTAINER = document.getElementById('threejs-container');

init();
animate();

function init(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color( "rgb(255, 255, 255)" );
  
  camera = new THREE.PerspectiveCamera( 40, THREEJS_CONTAINER.clientWidth / THREEJS_CONTAINER.clientWidth, 0.1, 1000 );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( THREEJS_CONTAINER.clientWidth, THREEJS_CONTAINER.clientWidth );
  
  renderer.outputEncoding = THREE.sRGBEncoding;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  THREEJS_CONTAINER.appendChild( renderer.domElement );
  
  
  // lighting
  // const ambientLight = new THREE.AmbientLight( "rgb(255, 255, 255)", 1 ); // soft white light
  // ambientLight.castShadow = true; // default false
  // scene.add( ambientLight );
  
  // const directionalLight = new THREE.DirectionalLight( "rgb(255, 255, 255)", 0.8 );
  // scene.add( directionalLight );
  
  // LIGHTS
  // const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.4 );
  // hemiLight.color.setHSL( 0.6, 1, 0.6 );
  // hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
  // hemiLight.position.set( 0, 50, 0 );
  // scene.add( hemiLight );

  // const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
  // scene.add( hemiLightHelper );

  // // direction light
  // const dirLight = new THREE.DirectionalLight( "rgb(255, 255, 255)", 1 );
  // dirLight.color.setHSL( 0.1, 1, 0.95 );
  // dirLight.position.set( - 1, 1.75, 1 );
  // dirLight.position.multiplyScalar( 10 );
  // scene.add( dirLight );

  // dirLight.castShadow = true;
  // const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
  // scene.add( dirLightHelper );

  const light1 = new THREE.DirectionalLight( 0xefefff, 1.5 );
  light1.position.set( 1, 1, 1 ).normalize();
  scene.add( light1 );
  light1.castShadow = true;

  const light1Helper = new THREE.DirectionalLightHelper( light1, 10 );
  scene.add( light1Helper );

  const light2 = new THREE.DirectionalLight( 0xffefef, 1 );
  light2.position.set( - 1, - 1, - 1 ).normalize();
  scene.add( light2 );

  const light2Helper = new THREE.DirectionalLightHelper( light2, 10 );
  scene.add( light2Helper );


  // GROUND
  // const groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
  // const groundMat = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
  // groundMat.color.setHSL( 0.095, 1, 0.75 );

  // const ground = new THREE.Mesh( groundGeo, groundMat );
  // ground.position.y = - 0;
  // ground.rotation.x = - Math.PI / 2;
  // ground.receiveShadow = true;
  // scene.add( ground );

  // const helper = new THREE.CameraHelper( dirLight.shadow.camera );
  // scene.add( helper );

  //debug object
  const sphereGeometry = new THREE.SphereGeometry( 1, 32, 32 );
  const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
  const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  sphere.castShadow = true; //default is false
  sphere.receiveShadow = false; //default
  // scene.add( sphere );

  // model loader 
  const loader = new THREE.GLTFLoader();
  // loader.load( './models/home.gltf', function ( gltf ) {
  //   console.log(gltf);
  //   const mesh = gltf.scene.children[ 0 ];
    
  //   const S = 1;
  //   mesh.scale.set( S, S, S ); // scale here
  //   // mesh.rotateX( -Math.PI * 0.5 );
  //   mesh.castShadow = true;
  //   mesh.receiveShadow = true;

  //   scene.add( mesh );
  // }, undefined, function ( error ) {
  //   console.error( error );
  // } );

  loader.load( './models/home.gltf', function ( gltf ) {
    console.log(gltf);
    const root = gltf.scene;

    root.traverse( function( node ) {
      if ( node.isMesh ) {
          if ( node.name !== "Cube" ) {
            node.receiveShadow = true;
            node.castShadow = true;
          } else{
            console.log("set cube");
            node.receiveShadow = true;
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


  // const objLoader = new THREE.OBJLoader();
  // objLoader.load( './models/johnny.obj', function ( object ) {
  //     // const mesh = object.scene;
  //     // console.log(object.scene);
  //     const S = 0.003;
  //     object.scale.set( S, S, S ); // scale here
  //     object.position.set( 3, 1.5, 3 );
  //     object.castShadow = true;
  //     object.receiveShadow = true;
  //     scene.add( object );
  //   }, 	// called when loading is in progresses
  //   function ( xhr ) {
  //     console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  //   },
  //   // called when loading has errors
  //   function ( error ) {
  //     console.log( 'An error happened' );
  //   }
  // );
  
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
