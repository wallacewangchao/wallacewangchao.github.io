const { createMachine, actions, interpret } = XState; // global variable: window.XState

let camera, scene, renderer, controls, effect;
let dirLight, spotLight;
let shadowGroup, renderTarget, renderTargetBlur, shadowCamera, cameraHelper, depthMaterial, horizontalBlurMaterial, verticalBlurMaterial;

let meObj, carObj, robotObj, pedestrianObj, droneObj;
let egoTrajectory, carWarningBox, pedestrianWarningBox;
let musicIcon, starIcon, heartIcon;
let autoPageObjects = [];

let socialCarMarkers = [];
let preAdMarkers = [];
let pedestrianMarkers = [];

let homePageMarkers = [];

let projectIframe;

const HOME_CAMERA_POS = {
  position: {
    x: -7.9,
    y: 6,
    z: 5.6
  },
  lookAt: {
    x: 0,
    y: 0,
    z: 0 
  }
}

const AUTO_CAMERA_POS = {
  position: {
    x: 15,
    y: 6,
    z: 0
  },
  lookAt: {
    x: 0,
    y: 2,
    z: 0 
  }
}

const ROBOT_CAMERA_POS = {
  position: {
    x: -0.31,
    y: 3.89,
    z: 4.80
  },
  lookAt: {
    x: -2.19,
    y: 0.39,
    z: 0.039
  }
}

const PUBLICATION_CAMERA_POS = {
  position: {
    x: -2.9980716789002773,
    y: 1.7716514658571492,
    z: -1.2982897690497368
  },
  lookAt: {
    x: -2.293247692752894,
    y: 1.4084096946581774,
    z: 1.3000324904491558 
  }
}

const ME_CAMERA_POS = {
  position: {
    x: -2.99,
    y: 1.70,
    z: -1.3
  },
  lookAt: {
    x: -2.293247692752894,
    y: 1.34,
    z: 1.30 
  }
}

const THREEJS_CONTAINER = document.getElementById('threejs-container');
const OVERLAY_CONTAINER = document.getElementById('highlight-overlay');
const LOGO = document.getElementById('logo');
const AUTOMOTIVE_GRID = document.getElementById('automotive-grid');
const ROBOT_GRID = document.getElementById('robot-grid');
const SELF_INTRODUCTION_CONTAINER = document.getElementById('selfintro-container');
const RADIO_BTNS_CONTAINER = document.querySelector('.nav-bar form');
const IFRAME_CONTAINER = document.getElementById('iframe-container');
const NAV_BAR = document.querySelector('.nav-bar');
const ABOUT_ME = document.getElementById('about-me-container');

/*************** set state machine *****************/
const promiseMachine = createMachine(
  {
    id: 'myWeb',
    initial: 'loading',
    context: 
    { 
      HOME_CAM_TRANSFORM: { position: HOME_CAMERA_POS.position, lookAt: HOME_CAMERA_POS.lookAt },
      AUTO_CAM_TRANSFORM: undefined, 
      AUTO_CAM_TRANSFORM: undefined 
    },
    states: {
      loading: {
        entry: [ 'initialize' ],
        on: {
          TO_HOME_PAGE: { target: 'homePage' }
        }
      },
      homePage: {
        entry: [ 'transCamHome', 'showGreeting', 'hideAutoGrid', 'hideRobotGrid', 
                 'showHomePageObjects', 'showHighLightOverLay', 'hideAboutMePage' ],
        exit: [ 'hideGreeting', 'hideHighLightOverLay' ],
        on: {
          TO_AUTO_PAGE: { target: 'autoPage' },
          TO_ROBOT_PAGE: { target: 'robotPage' },
          TO_ABOUT_ME_PAGE: { target: 'aboutMePage' }
        }
      },
      autoPage: {
        entry: [ 'transCamAuto', 'showAutoGrid', 'showAutoPageObjects' ],
        exit: [ 'hideAutoGrid' , 'hideAutoPageObjects'],
        on: {
          TO_HOME_PAGE: { target: 'homePage' },
          TO_AUTO_PAGE: { target: 'autoPage' },
          TO_ROBOT_PAGE: { target: 'robotPage' },
          TO_ABOUT_ME_PAGE: { target: 'aboutMePage' },

          TO_PROJECT_PREAD: { target: 'projectPreAD' },
          TO_PROJECT_PEDESTRIAN: { target: 'projectPedestrian' },
          TO_PROJECT_SOCIALCAR: { target: 'projectSocialCar' },
          TO_PROJECT_HUDAR: { target: 'projectHudAr' },
          TO_PROJECT_ATEAM: { target: 'projectAteam' },
          TO_PROJECT_LIKES_DISLIKES: { target: 'projectLikesAndDislikes' }

        }
      },
      robotPage: {
        entry: [ 'transCamRobot', 'showRobotGrid', 'showRobotPageObjects' ],
        exit: [ 'hideRobotGrid' ],
        on: {
          TO_HOME_PAGE: { target: 'homePage' },
          TO_AUTO_PAGE: { target: 'autoPage' },
          TO_ROBOT_PAGE: { target: 'robotPage' },
          TO_ABOUT_ME_PAGE: { target: 'aboutMePage' },

          TO_PROJECT_ICPS: { target: 'projectIcps' },
          TO_PROJECT_XAI: { target: 'projectXAI' },
          TO_PROJECT_AR_ROBOT: { target: 'projectArRobot' },
          TO_PROJECT_KORE: { target: 'projectKore' },
          TO_PROJECT_HOLOCAR: { target: 'projectHoloCar' },
          TO_PROJECT_ICRA24: { target: 'projectIcra24' },
          TO_PROJECT_LAMI: { target: 'projectLami' }

        }
      },
      aboutMePage: {
        entry: [ 'transCamMe', 'showAboutMePage', 'showAboutMePageObjects' ],
        exit: [ 'hideAboutMePage',  ],
        on: {
          TO_HOME_PAGE: { target: 'homePage' },
          TO_AUTO_PAGE: { target: 'autoPage' },
          TO_ROBOT_PAGE: { target: 'robotPage' },
          TO_ABOUT_ME_PAGE: { target: 'aboutMePage' }
        }
      },

      /* sub project pages */
      projectPreAD: {
        entry: [ 'showProjectPreAD', 'hideNavBar' ],
        exit: [ 'showNavBar', 'closeProjectPage' ],
        on: {
          TO_AUTO_PAGE: { target: 'autoPage' }
        }
      },
      projectPedestrian: {
        entry: [ 'showProjectPedestrian', 'hideNavBar' ],
        exit: [ 'showNavBar', 'closeProjectPage' ],
        on: {
          TO_AUTO_PAGE: { target: 'autoPage' }
        }
      },
      projectSocialCar: {
        entry: [ 'showProjectSocialCar', 'hideNavBar' ],
        exit: [ 'showNavBar', 'closeProjectPage' ],
        on: {
          TO_AUTO_PAGE: { target: 'autoPage' }
        }
      },
      projectHudAr: {
        entry: [ 'showHudAr', 'hideNavBar' ],
        exit: [ 'showNavBar', 'closeProjectPage' ],
        on: {
          TO_AUTO_PAGE: { target: 'autoPage' }
        }
      },      
      projectAteam: {
        entry: [ 'showAteam', 'hideNavBar' ],
        exit: [ 'showNavBar', 'closeProjectPage' ],
        on: {
          TO_AUTO_PAGE: { target: 'autoPage' }
        }
      },
      projectLikesAndDislikes: {
        entry: [ 'showLikesAndDislikes', 'hideNavBar' ],
        exit: [ 'showNavBar', 'closeProjectPage' ],
        on: {
          TO_AUTO_PAGE: { target: 'autoPage' }
        }
      },
      projectIcps: {
        entry: [ 'showIcps', 'hideNavBar' ],
        exit: [ 'showNavBar', 'closeProjectPage' ],
        on: {
          TO_ROBOT_PAGE: { target: 'robotPage' }
        }
      },
      projectXAI: {
        entry: [ 'showXAI', 'hideNavBar' ],
        exit: [ 'showNavBar', 'closeProjectPage' ],
        on: {
          TO_ROBOT_PAGE: { target: 'robotPage' }
        }
      },
      projectArRobot: {
        entry: [ 'showArRobot', 'hideNavBar' ],
        exit: [ 'showNavBar', 'closeProjectPage' ],
        on: {
          TO_ROBOT_PAGE: { target: 'robotPage' }
        }
      },
      projectKore: {
        entry: [ 'showKore', 'hideNavBar' ],
        exit: [ 'showNavBar', 'closeProjectPage' ],
        on: {
          TO_ROBOT_PAGE: { target: 'robotPage' }
        }
      },
      projectHoloCar: {
        entry: [ 'showHoloCar', 'hideNavBar' ],
        exit: [ 'showNavBar', 'closeProjectPage' ],
        on: {
          TO_ROBOT_PAGE: { target: 'robotPage' }
        }
      },
      projectIcra24: {
        entry: [ 'showIcra24', 'hideNavBar' ],
        exit: [ 'showNavBar', 'closeProjectPage' ],
        on: {
          TO_ROBOT_PAGE: { target: 'robotPage' }
        }
      },
      projectLami: {
        entry: [ 'showLami', 'hideNavBar' ],
        exit: [ 'showNavBar', 'closeProjectPage' ],
        on: {
          TO_ROBOT_PAGE: { target: 'robotPage' }
        }
      },
    }
  },
  {
    actions:{
      initialize: () => {
        init();
        animate();
      },

      transCamHome: () => {
        moveCamera( HOME_CAMERA_POS.position, HOME_CAMERA_POS.lookAt );
      },
      hideGreeting: () => {
        hideContainer( SELF_INTRODUCTION_CONTAINER );
      },
      showGreeting: () => {
        showContainer( SELF_INTRODUCTION_CONTAINER );
      },

      transCamAuto: () => {
        moveCamera( AUTO_CAMERA_POS.position, AUTO_CAMERA_POS.lookAt );
      },
      hideAutoGrid: () => {
        hideContainer( AUTOMOTIVE_GRID );     
      },
      showAutoGrid: () => {
        showContainer( AUTOMOTIVE_GRID );
      },

      transCamRobot: () => {
        moveCamera( ROBOT_CAMERA_POS.position, ROBOT_CAMERA_POS.lookAt );
      },
      hideRobotGrid: () => {
        hideContainer( ROBOT_GRID );     
      },
      showRobotGrid: () => {
        showContainer( ROBOT_GRID );
      },

      transCamMe: () => {
        moveCamera( ME_CAMERA_POS.position, ME_CAMERA_POS.lookAt );
      },
      hideAboutMePage: () => {
        hideContainer( ABOUT_ME );     
      },
      showAboutMePage: () => {
        showContainer( ABOUT_ME );
      },

      clearRadioBtnRed: () => {
        let checked = RADIO_BTNS_CONTAINER.querySelector('input:checked');
        if (checked !== null) {
          checked.checked = false;
        }
      },

      showProjectPreAD: () => {
        createProjectPage( './subpages/project-preAD.html' ); 
        document.querySelector('.close').addEventListener( 'click', () => {
          promiseService.send({type: "TO_AUTO_PAGE"});
        });
      },
      showProjectPedestrian: () => {
        createProjectPage( './subpages/project-pedestrian.html' ); 
        document.querySelector('.close').addEventListener( 'click', () => {
          promiseService.send({type: "TO_AUTO_PAGE"});
        });
      },
      showProjectSocialCar: () => {
        createProjectPage( './subpages/project-social-car.html' ); 
        document.querySelector('.close').addEventListener( 'click', () => {
          promiseService.send({type: "TO_AUTO_PAGE"});
        });
      },
      showHudAr: () => {
        createProjectPage( './subpages/project-hudar.html' ); 
        document.querySelector('.close').addEventListener( 'click', () => {
          promiseService.send({type: "TO_AUTO_PAGE"});
        });
      },
      showAteam: () => {
        createProjectPage( './subpages/project-a-team.html' ); 
        document.querySelector('.close').addEventListener( 'click', () => {
          promiseService.send({type: "TO_AUTO_PAGE"});
        });
      },
      showLikesAndDislikes: () => {
        createProjectPage( './subpages/project-likes-dislikes.html' ); 
        document.querySelector('.close').addEventListener( 'click', () => {
          promiseService.send({type: "TO_AUTO_PAGE"});
        });
      },
      showIcps: () => {
        createProjectPage( './subpages/project-icps.html' ); 
        document.querySelector('.close').addEventListener( 'click', () => {
          promiseService.send({type: "TO_ROBOT_PAGE"});
        });
      },
      showXAI: () => {
        createProjectPage( './subpages/project-xai.html' );
        document.querySelector('.close').addEventListener( 'click', () => {
          promiseService.send({type: "TO_ROBOT_PAGE"});
        });
      },
      showArRobot: () => {
        createProjectPage( './subpages/project-ar-robot.html' );
        document.querySelector('.close').addEventListener( 'click', () => {
          promiseService.send({type: "TO_ROBOT_PAGE"});
        });
      },
      showKore: () => {
        createProjectPage( './subpages/project-kore.html' );
        document.querySelector('.close').addEventListener( 'click', () => {
          promiseService.send({type: "TO_ROBOT_PAGE"});
        });
      },

      showHoloCar: () => {
        createProjectPage( './subpages/project-holo-car.html' );
        document.querySelector('.close').addEventListener( 'click', () => {
          promiseService.send({type: "TO_ROBOT_PAGE"});
        });
      },

      showIcra24: () => {
        createProjectPage( 'https://hri-eu.github.io/Loom/index.html' );
        document.querySelector('.close').addEventListener( 'click', () => {
          promiseService.send({type: "TO_ROBOT_PAGE"});
        });
      },

      showLami: () => {
        createProjectPage( 'https://hri-eu.github.io/Lami/index.html' );
        document.querySelector('.close').addEventListener( 'click', () => {
          promiseService.send({type: "TO_ROBOT_PAGE"});
        });
      },

      hide3DContainer: () => {
        hide3DContainer();
      },

      closeProjectPage: () => {
        destroyProjectPage();
        setThreeObjectsVisibility( [egoTrajectory, carWarningBox, pedestrianWarningBox, musicIcon, starIcon, heartIcon], false);
      },

      hideNavBar: () => {
        NAV_BAR.style.visibility = "hidden";
      },
      showNavBar: () => {
        NAV_BAR.style.visibility = "visible";
      },

      hideHighLightOverLay: () => {
        OVERLAY_CONTAINER.style.display = "none";
      },
      showHighLightOverLay: () => {
        OVERLAY_CONTAINER.style.display = "block";
      },

      showHomePageObjects: () => {
        if (meObj !== undefined) meObj.visible = true;
        if (robotObj !== undefined) robotObj.visible = true;
        if (carObj !== undefined) carObj.visible = true;
        if (droneObj !== undefined) droneObj.visible = true;
        setThreeObjectsVisibility(autoPageObjects, false);
      },
      showAutoPageObjects: () => {
        robotObj.visible = false;
        meObj.visible = false;
        carObj.visible = true;
        droneObj.visible = false;
        setThreeObjectsVisibility(autoPageObjects, true);
      },
      showRobotPageObjects: () => {
        robotObj.visible = true;
        meObj.visible = true;
        carObj.visible = false;
        droneObj.visible = false;
        setThreeObjectsVisibility(autoPageObjects, false);
      },
      showAboutMePageObjects: () => {
        robotObj.visible = false;
        meObj.visible = true;
        carObj.visible = false;
        droneObj.visible = true;
        setThreeObjectsVisibility(autoPageObjects, false);
      }

    }
  }
);

const promiseService = interpret(promiseMachine).onTransition((state) => {
  console.log(state.value);
  currentState = state.value;
});
promiseService.start();

/*************** init *****************/
function init() {
  initScene();
  window.addEventListener( 'resize', onWindowResize );

  LOGO.addEventListener( 'click', () => {
    document.getElementById('radio-btn-Home').checked = true;
    promiseService.send({type: "TO_HOME_PAGE"});
  } );

  /* navbar buttons event listener */
  RADIO_BTNS_CONTAINER.addEventListener( 'change', () => {
    let id = RADIO_BTNS_CONTAINER.querySelector('input:checked').id;
    if ( id === "radio-btn-Automotive" ) {
      promiseService.send({type: "TO_AUTO_PAGE"});
    } else if ( id === "radio-btn-Robotics&AI" ) {
      promiseService.send({type: "TO_ROBOT_PAGE"});
    } else if ( id === "radio-btn-AboutMe" ){
      promiseService.send({type: "TO_ABOUT_ME_PAGE"});
    } else if ( id === "radio-btn-Home" ){
      promiseService.send({type: "TO_HOME_PAGE"});
    }
  });

  /* sub project card event listener */
  const pageIds = ["cooperative-driving", "pedestrian-communication", "social-car", "hud-ar", "a-team", "like-dislike", "ICPs", "mobileCAM", "arRobot", "kore" ];

  let cooperativeDrivingPage = document.getElementById( 'cooperative-driving' );
  setProjectCard(cooperativeDrivingPage, "TO_PROJECT_PREAD", preAdMarkers);

  let pedestrianCommunicationPage = document.getElementById( 'pedestrian-communication' );
  setProjectCard(pedestrianCommunicationPage, "TO_PROJECT_PEDESTRIAN", pedestrianMarkers);

  let socialCarPage = document.getElementById( 'social-car' );
  setProjectCard(socialCarPage, "TO_PROJECT_SOCIALCAR", socialCarMarkers);

  let hudArPage = document.getElementById( 'hud-ar' );
  setProjectCard(hudArPage, "TO_PROJECT_HUDAR", socialCarMarkers);

  let ateamPage = document.getElementById( 'a-team' );
  setProjectCard(ateamPage, "TO_PROJECT_ATEAM", null);

  let likesDislikesPage = document.getElementById( 'like-dislike' );
  setProjectCard(likesDislikesPage, "TO_PROJECT_LIKES_DISLIKES", socialCarMarkers);

  let icpsPage = document.getElementById( 'ICPs' );
  setProjectCard(icpsPage, "TO_PROJECT_ICPS", null);

  let icpsXAI = document.getElementById( 'mobileCAM' );
  setProjectCard(icpsXAI, "TO_PROJECT_XAI", null);

  let arRobot = document.getElementById( 'arRobot' );
  setProjectCard(arRobot, "TO_PROJECT_AR_ROBOT", null);

  let kore = document.getElementById( 'kore' );
  setProjectCard(kore, "TO_PROJECT_KORE", null);
  
  setProjectCard(document.getElementById( 'holoCar' ), "TO_PROJECT_HOLOCAR", null);
  setProjectCard(document.getElementById( 'icra24' ), "TO_PROJECT_ICRA24", null);
  setProjectCard(document.getElementById( 'lami' ), "TO_PROJECT_LAMI", null);


  /* go to home page after init */
  promiseService.send({type: "TO_HOME_PAGE"});
}

/*************** init Threejs *****************/
function initScene(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color( "#FEF9E7" );

  camera = new THREE.PerspectiveCamera( 25, THREEJS_CONTAINER.clientWidth / THREEJS_CONTAINER.clientHeight, 0.001, 1000 );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( THREEJS_CONTAINER.clientWidth, THREEJS_CONTAINER.clientHeight );
  
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap

  THREEJS_CONTAINER.appendChild( renderer.domElement );
  
  /**
   * LIGHTS
  **/
  const hemiLight = new THREE.HemisphereLight( "#E8F8F5", "#E8F8F5", 0.1 );
  // hemiLight.color.setHSL( 1, 1, 1);
  hemiLight.position.set( 300, 500, 200 );
  scene.add( hemiLight );

  // const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
  // scene.add( hemiLightHelper );
  
  // direction light
  dirLight = new THREE.DirectionalLight( "rgb(255, 255, 255)", 0.9 );
  dirLight.position.set( 2, 1.3, -2 );

  // dirLight.position.multiplyScalar( 5 );

  // const d = 30;

  // dirLight.shadow.camera.left = - d;
  // dirLight.shadow.camera.right = d;
  // dirLight.shadow.camera.top = d;
  // dirLight.shadow.camera.bottom = - d;

  // dirLight.shadow.mapSize.width = 2048;
  // dirLight.shadow.mapSize.height = 2048;

  // dirLight.shadow.camera.far = 45;
  // dirLight.shadow.camera.near = 0.1;
  // dirLight.shadow.camera.fov = 45;

  // dirLight.shadow.bias = - 0.0001;
  dirLight.castShadow = true;
  scene.add( dirLight );

  // const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 6 );
  // scene.add( dirLightHelper );
  
  // const dirLight2 = new THREE.DirectionalLight( "rgb(255, 255, 255)", 0.6 );
  // dirLight2.position.set( 1, 1.75, 0 );
  // dirLight2.position.multiplyScalar( 5 );
  // dirLight2.castShadow = false;
  // scene.add( dirLight2 );


  /* loading Manager */
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    // console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
  };
  
  loadingManager.onLoad = function ( ) {
    // console.log( 'Loading complete!');
    document.querySelector('.page-loader').remove();
  };
  
  
  loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    // console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    document.querySelector('.page-loader p').innerText = "Loading 3D models: " + Math.floor( itemsLoaded / itemsTotal * 100 ) + "%";

  };
  
  loadingManager.onError = function ( url ) {
    // console.log( 'There was an error loading ' + url );
    document.querySelector('.page-loader p').innerText = "There was an error while loading models, please refresh the page";

  };

  // model loader 
  const loader = new THREE.GLTFLoader( loadingManager );
  const dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath( './js/' );
  loader.setDRACOLoader( dracoLoader );
  loader.setMeshoptDecoder( MeshoptDecoder );
  
  loader.load( './models/whole_scene_toon.glb', function ( gltf ) {
    const root = gltf.scene;
    root.castShadow = true;
    gltf.scene.receiveShadow = true;

    root.traverse( function( node ) {

      if ( node.name === "me" ){
        let marker = makeMarker(node);
        homePageMarkers.push(marker);
        meObj = node;
      } else if ( node.name === "honda_e" ){
        let marker = makeMarker(node);
        homePageMarkers.push(marker);
        carObj = node;
      } else if ( node.name === "robot" ){
        let marker = makeMarker(node);
        homePageMarkers.push(marker);
        robotObj = node;
      } else if ( node.name === "ego_trajectory" ){
        egoTrajectory = node;
      } else if ( node.name === "pedestrian" ){
        pedestrianObj = node;
        autoPageObjects.push(pedestrianObj);
      } else if ( node.name === "heart" ){
        heartIcon = node;
      } else if ( node.name === "star" ){
        starIcon = node;
      } else if ( node.name === "music" ){
        musicIcon = node;
      } else if ( node.name === "drone" ){
        droneObj = node;
      } 
      
      if ( node.isMesh ) {
        if ( node.type === "SkinnedMesh" ) {
          node.frustumCulled = false;
        }
        node.receiveShadow = false;
        node.castShadow = true;
      }

    });
    scene.add( root );

    homePageMarkers.forEach( marker => {
      OVERLAY_CONTAINER.appendChild(marker);
    });
    
    setMarkersPositions(homePageMarkers);
    console.log(gltf);

    droneObj.position.set(-2.4, 1.5, 0.2);
    droneObj.rotation.set(-Math.PI/2, 0, 0);

    /* set auto page objects */
    const whiteMaterial = new THREE.MeshToonMaterial( {color: "rgb(99, 125, 138)"} );
    const warningBoxMaterial = new THREE.MeshToonMaterial( {color: "rgb(254, 47, 47)"} );

    meObj.traverse((o) => {
      if (o.name === "OutfitBottom") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(118,181,197)",
          gradientMap: createToonGradient(),
        });
      } else if (o.name === "OutfitTop") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(235,235,235)",
          gradientMap: createToonGradient([
            { "pos": 0.1, "color": 'rgb(50, 50, 50)' }, 
            { "pos": 0.5, "color": 'rgb(120, 120, 120)' }, 
            { "pos": 1, "color": 'rgb(256, 256, 256)' }
          ]),
        });
      } else if (o.name === "Head") {
        let textureLoader = new THREE.TextureLoader();
        const faceTexture = textureLoader.load("./models/face_s2.jpg");
        faceTexture.flipY = false;
        faceTexture.encoding = THREE.sRGBEncoding;
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(255, 255, 255)",
          map: faceTexture,
          gradientMap: createToonGradient([
            {"pos":0.35,"color":"rgb(125, 107, 101)"},
            {"pos":0.8,"color":"rgb(255, 187, 166)"}
          ]),
        });
      } else if (o.name === "Hands") {
          o.material = new THREE.MeshToonMaterial({
            color: "rgb(255, 255, 255)",
            gradientMap: createToonGradient([
              {"pos":0.35,"color":"rgb(125, 107, 101)"},
              {"pos":0.8,"color":"rgb(255, 187, 166)"}
            ]),
          });
      } else if (o.name === "Hair") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(10, 10, 10)",
          gradientMap: createToonGradient(),
        });
      } else if (o.name === "Shoes") {
        o.material = new THREE.MeshToonMaterial({
          color: "#3E2723",
        });
      }
    });

    carObj.traverse((o) => {
      if (o.name === "CarBodyModel") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(255,255,255)",
          gradientMap: createToonGradient([
            { "pos": 0.2, "color": 'rgb(160, 160, 160)' }, 
            { "pos": 0.7, "color": 'rgb(255, 255, 255)' }]),
        });
      } else if (o.name === "GlassesModel") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(15,15,15)",
          gradientMap: createToonGradient(),
        });
      } else if (o.name === "BodyFrontBackPlasticModel" || o.name === "RoofPlasticModel" || o.name === "BaseModel" 
      || o.name === "FrontBajosPalitos_Plastic25_0001" || o.name === "BrakeLightFrameModel"
      || o.name === "HeadBeamModel" || o.name === "BeamFrameModel" || o.name === "WheelScrewerModel" ) {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(10,10,10)",
          gradientMap: createToonGradient(),
        });
      } else if (o.name === "WheelRubberModel") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(5,5,5)",
          gradientMap: createToonGradient(),
        });
      } else if (o.name === "WheelFrameModel") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(155,155,155)",
          gradientMap: createToonGradient(),
        });
      } else if (o.name === "BrakeLightModel") {
        o.material = new THREE.MeshToonMaterial({
          color: "#E74C3C",
          gradientMap: createToonGradient(),
        });
      } else if (o.name === "BackLampFrameModel" || o.name === "FrontLampFrameModel") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(30, 30, 30)",
          gradientMap: createToonGradient(),
        });
      } else if (o.name === "HeadLampCircleModel" ) {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(204, 255, 255)",
          gradientMap: createToonGradient(),
        });
      }
    });

    robotObj.traverse((o) => {
      if (o.name === "body" || o.name === "base" || o.name === "neck_base") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(245,245,245)",
          gradientMap: createToonGradient([
            { "pos": 0, "color": 'rgb(0, 0, 0)' }, 
            { "pos": 0.1, "color": 'rgb(120, 120, 120)' }, 
            { "pos": 0.9, "color": 'rgb(256, 256, 256)' }]),
        });
      } else if (o.name === "arms_model") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(204, 239, 255)",
          gradientMap: createToonGradient(),
        });
      } else if (o.name === "ears" || o.name === "eye") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(10, 10, 10)",
          gradientMap: createToonGradient(),
        });
      } else if (o.name === "head" || o.name === "neck") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(235,235,235)",
          gradientMap: createToonGradient(),
        });
      }
    })

    /* set other cars */
    let otherCar1 = carObj.clone();
    scene.add( otherCar1 );
    otherCar1.position.set( -12, 0, -2 );
    otherCar1.traverse( (o) => {
      if (o.isMesh) {
        o.receiveShadow = true;
        o.material = whiteMaterial;
      }
    });

    let otherCar2 = otherCar1.clone();
    scene.add( otherCar2 );
    otherCar2.position.set( -30, 0, 0 );

    autoPageObjects.push(otherCar1);
    autoPageObjects.push(otherCar2);
    setThreeObjectsVisibility(autoPageObjects, false);


    droneObj.traverse((o) => {
      if (o.name === "propellers" ) {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(10,10,10)",
          gradientMap: createToonGradient(),
        });
      } else if (o.name === "Arms" || o.name === "BodyBase") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(10, 10, 10)",
        });
      } else if (o.name === "Moters" || o.name === "eye") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(200, 200, 200)",
          gradientMap: createToonGradient(),
        });
      } else if (o.name === "BodyTop") {
        o.material = new THREE.MeshToonMaterial({
          color: "rgb(235,235,235)",
          gradientMap: createToonGradient(),
        });
      }
    })

    /* set preAD markers */
    let trajectoryMaterial = new THREE.MeshToonMaterial({color: "rgb(0, 134, 179)"});
    egoTrajectory.traverse( (o) => {
      if (o.isMesh) {
        o.receiveShadow = false;
        o.castShadow = true;
        o.material = trajectoryMaterial;
      }
    });

    carWarningBox = new THREE.Mesh( new THREE.BoxGeometry( 4.2, 1.6, 2 ), warningBoxMaterial );
    carWarningBox.position.set( -10.6, 0.8, -2 );
    carWarningBox.material.transparent =true;
    carWarningBox.material.opacity = 0.5;
    scene.add( carWarningBox );

    preAdMarkers.push(egoTrajectory, carWarningBox);
    setThreeObjectsVisibility(preAdMarkers, false);

    /* set pedestrian markers */
    pedestrianWarningBox = new THREE.Mesh( new THREE.BoxGeometry( 0.6, 2, 0.6 ), warningBoxMaterial );
    pedestrianWarningBox.position.set( -4.9, 1, 3.3 );
    pedestrianWarningBox.material.transparent =true;
    pedestrianWarningBox.material.opacity = 0.5;
    scene.add( pedestrianWarningBox );

    pedestrianMarkers.push(pedestrianWarningBox);
    setThreeObjectsVisibility( pedestrianMarkers, false);

    pedestrianObj.traverse( (o) => {
      if (o.isMesh) {
        o.material = whiteMaterial;
      }
    });

    /* set social car markers */
    const heartMaterial = new THREE.MeshToonMaterial( {color: "rgb(254, 47, 47)"} );
    const starMaterial = new THREE.MeshToonMaterial( {color: "rgb(230, 184, 0)"} );
    const musicMaterial = new THREE.MeshToonMaterial( {color: "rgb(0, 134, 179)"} );
    heartIcon.traverse( (o) => {
      if (o.isMesh) {
        o.receiveShadow = false;
        o.castShadow = false;
        o.material = heartMaterial;
      }
    });

    starIcon.traverse( (o) => {
      if (o.isMesh) {
        o.receiveShadow = false;
        o.castShadow = false;
        o.material = starMaterial;
      }
    });
    musicIcon.traverse( (o) => {
      if (o.isMesh) {
        o.receiveShadow = false;
        o.castShadow = false;
        o.material = musicMaterial;
      }
    });

    heartIcon.position.set(1,2,0);
    starIcon.position.set(-30, 2, 0);
    musicIcon.position.set(-12, 1.5, -2);
    socialCarMarkers.push(starIcon);
    socialCarMarkers.push(heartIcon);
    socialCarMarkers.push(musicIcon);
    setThreeObjectsVisibility( socialCarMarkers, false);

    
  }, function(xhr){
    // document.querySelector('.page-loader p').innerText = "loading 3D models: " + Math.floor( xhr.loaded / xhr.total * 100 ) + "%";
		// console.log( Math.floor( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  }, function ( error ) { 
    console.error( error );
  } );
  
  function createToonGradient(colorStops = [{ "pos": 0, "color": 'rgb(0, 0, 0)' }, 
                                            { "pos": 0.2, "color": 'rgb(120, 120, 120)' }, 
                                            { "pos": 0.9, "color": 'rgb(256, 256, 256)' }]) {
    const canvas = document.createElement('canvas');
    canvas.width = 4;
    canvas.height = 1;

    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 4, 0);

    colorStops.forEach((e) => {
      gradient.addColorStop(e["pos"], e["color"]);
    });

    context.fillStyle = gradient;
    context.fillRect(0, 0, 4, 1);

    const gradientMap = new THREE.CanvasTexture(canvas);
    gradientMap.magFilter = THREE.NearestFilter;
    gradientMap.minFilter = THREE.NearestFilter;
    gradientMap.needsUpdate = true;

    return gradientMap;
  }

  // const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshBasicMaterial( { color: "#D1F2EB", depthWrite: false } ) );
  // mesh.rotation.x = - Math.PI / 2;
  // mesh.receiveShadow = true;
  // scene.add( mesh );

  // Axes Helper
  // const axesHelper = new THREE.AxesHelper( 5 );
  // scene.add( axesHelper );
  
  // set initial camera positions
  camera.position.set( HOME_CAMERA_POS.position.x, HOME_CAMERA_POS.position.y, HOME_CAMERA_POS.position.z ); // Set position like this

  effect = new THREE.OutlineEffect( renderer );

  // orbit control
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI / 2;
  controls.target.set( HOME_CAMERA_POS.lookAt.x, HOME_CAMERA_POS.lookAt.y, HOME_CAMERA_POS.lookAt.z );
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 0.2;
  controls.maxDistance = 30;
  
}

function render() {
  effect.render( scene, camera );
  setMarkersPositions(homePageMarkers);

  // console.log("camera position", camera.position);
  // console.log("camera target", controls.target);
}

function animate() {
  requestAnimationFrame( animate );
  controls.update(); // required if damping enabled
  renderer.render( scene, camera );

  TWEEN.update();

}

function onWindowResize() {
  camera.aspect = THREEJS_CONTAINER.clientWidth / THREEJS_CONTAINER.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( THREEJS_CONTAINER.clientWidth, THREEJS_CONTAINER.clientHeight );
  setMarkersPositions(homePageMarkers);

}

function toScreenPosition(obj, camera)
{
    var vector = new THREE.Vector3();

    var widthHalf = 0.5*renderer.getContext().canvas.width;
    var heightHalf = 0.5*renderer.getContext().canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
        x: vector.x,
        y: vector.y
    };
};

function setDivPosition(div, pos){
  div.style.left = pos.x + 'px';
  div.style.top = pos.y + 'px';
}

function moveCamera(cameraTargetPosition, cameraTargetLookAt){

  TWEEN.removeAll();
  new TWEEN.Tween( camera.position )
						.to( cameraTargetPosition, 1000 )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();

  new TWEEN.Tween( controls.target )
						.to( cameraTargetLookAt, 1000 )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();

}

function onHightClicked(){
  promiseService.send({type: "TO_AUTO_PAGE"});
}

function makeMarker( node ) {
  let markerDiv = document.createElement('div');
  markerDiv.classList.add('highlight-rect');
  markerDiv.id = node.name;
  markerDiv.addEventListener( 'click', onMarkerClicked );

  return markerDiv;
}

function setMarkersPositions( markers ) {
  markers.forEach( marker => {
    let object = scene.getObjectByName( marker.id );
    let position = toScreenPosition( object, camera );
    marker.style.left = position.x + 'px';
    marker.style.top = position.y + 'px';
  });
}

function onMarkerClicked(){
  console.log("marker id: ", this.id);
  if (this.id === "honda_e") {
    promiseService.send({type: "TO_AUTO_PAGE"});
  }

  if (this.id === "me") {
    promiseService.send({type: "TO_ABOUT_ME_PAGE"});
  }

  if (this.id === "robot") {
    promiseService.send({type: "TO_ROBOT_PAGE"});
  }
}

function hideContainer(div){
  div.style.visibility = 'hidden';
  div.style.opacity = 0;
}

function showContainer(div){
  div.style.visibility = 'visible';
  div.style.opacity = 1;
}

function createProjectPage( projectURL ) {
  projectIframe = document.createElement('iframe');
  projectIframe.src = projectURL;
  projectIframe.classList.add('project-iframe-container');

  let closeBtn = document.createElement('div');
  closeBtn.classList.add('close');

  document.querySelector('main').appendChild(projectIframe);
  document.querySelector('main').appendChild(closeBtn);
}

function destroyProjectPage(){
  projectIframe.remove();
  document.querySelector('.close').remove();
}


function hide3DContainer(){
  renderer.setAnimationLoop(null);
  THREEJS_CONTAINER.style.visibility = 'hidden';
  OVERLAY_CONTAINER.style.visibility = 'hidden';
}

function setThreeObjectsVisibility(objects, isVisible){
  objects.forEach( obj => {
    if (obj.visible !== isVisible) obj.visible = isVisible;
  });
}

function setProjectCard(cardDiv, toState, relatedMarkers){
  cardDiv.addEventListener( 'click', () => {
    promiseService.send({type: toState});
  });
  if (relatedMarkers !== null) {
    cardDiv.addEventListener( 'mouseenter', () => {
      setThreeObjectsVisibility( relatedMarkers, true);
    });
    cardDiv.addEventListener( 'mouseleave', () => {
      if ( promiseService.state.value === 'autoPage' || promiseService.state.value === 'robotPage' ) 
        setThreeObjectsVisibility( relatedMarkers, false);
    });
  }
}