// Code Base

import * as dat from "https://unpkg.com/three@0.120.0/examples/jsm/libs/dat.gui.module.js";
import * as THREE from 'https://unpkg.com/three@0.120.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.120.0/examples/jsm/controls/OrbitControls.js';

let container;
let scene;
let camera;
let renderer;
let cubes = [];
let cameraControls;

let correctSpokeVals = [];

let spokeVals = [];

let offset = 0;

let capOne;

// create GUI and associated values
let hiddenString;
let gui = new dat.GUI();

let ub;
var textBox = {
  textField: "",
};
let tb = gui.add(textBox, "textField").onFinishChange(function (value) {
    hiddenString = value;
});

var lockButton = { lock:function(){ lock() } };
let lb = gui.add(lockButton, 'lock');

function createScene()
{
    // Create Geometry 


    const centerGeometry = new THREE.BoxGeometry( 2, 2, 2);
  
    // Cubes[] -- line of spokes
    cubes =
        [
          createSpoke(centerGeometry,  -10),
          createSpoke(centerGeometry,   -8),
          createSpoke(centerGeometry,   -6),
          createSpoke(centerGeometry,   -4),
          createSpoke(centerGeometry,   -2),
          createSpoke(centerGeometry,    0),
          createSpoke(centerGeometry,    2),
          createSpoke(centerGeometry,    4),
          createSpoke(centerGeometry,    6),
          createSpoke(centerGeometry,    8),
        ];

        createDecor();

}

// Creates one "wheel" on the Cryptex
function createSpoke(centerGeometry, zpo) {
  const material = new THREE.MeshPhongMaterial( {color: 0xffffff} );

  var centerCube = new THREE.Mesh( centerGeometry, material);

  scene.add(centerCube);

  centerCube.position.x = 0;
  centerCube.position.y = 0;
  centerCube.position.z = zpo;

  centerCube.castShadow = false;
  centerCube.recieveShadow = false;

  const boxWidth      = 2;
  const boxHeight     = 8;
  const boxDepth      = 2;
  const geometry   = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

  //create 8 boxes around center of spokes

  createCube(geometry, 0x000000, -3 - 8 / Math.sqrt(2), 0, 0, centerCube );

  createCube(geometry, 0x0f0f0f, -(4 + 3/Math.sqrt(2)), (4 + 3/Math.sqrt(2)), 0, centerCube );

  createCube(geometry, 0x00ff00, 0, 3 + 8 / Math.sqrt(2), 0, centerCube );

  createCube(geometry, 0xff0000, (4 + 3/Math.sqrt(2)), (4 + 3/Math.sqrt(2)), 0, centerCube );

  createCube(geometry, 0x00ffff, 3 + 8 / Math.sqrt(2), 0, 0, centerCube );

  createCube(geometry, 0xff00ff, (4 + 3/Math.sqrt(2)), -(4 + 3/Math.sqrt(2)), 0, centerCube );

  createCube(geometry, 0xffff00, 0, -3 - 8 / Math.sqrt(2), 0, centerCube);

  createCube(geometry, 0xffffff, -(4 + 3/Math.sqrt(2)), -(4 + 3/Math.sqrt(2)), 0, centerCube);

  return centerCube;
}

// Creating a single Cubeoid at a position with a color
function createCube( geometry, color, xpos, ypos, zpos, centerCube )
{
    const material = new THREE.MeshPhongMaterial( {color} );

    // create a Mesh containing the geometry and material
    var cube = new THREE.Mesh( geometry, material );

    // add the cube to the scene
    scene.add(cube);
    cube.position.x = xpos;
    cube.position.y = ypos;
    cube.position.z = zpos / 2;

    cube.rotation.z = offset * Math.PI * -1/4;

    offset = offset + 1;
    cube.castShadow = false;
    cube.receiveShadow = false;

    centerCube.add(cube);

    spokeVals.push(0);
    return cube;
}

// Creates decorations of Cryptex
function createDecor() {
  var decorMat = new THREE.MeshPhongMaterial( { color: 0xC9AC8F} );

  var baseGeometry = new THREE.BoxGeometry(10, 10 + 10 * Math.sqrt(2), 0.5);

  // base is at bottom of device
  var baseOne = new THREE.Mesh(baseGeometry, decorMat);
  var baseTwo = new THREE.Mesh(baseGeometry, decorMat);
  baseTwo.rotateZ(Math.PI/4);
  var baseThree = new THREE.Mesh(baseGeometry, decorMat);
  baseThree.rotateZ(Math.PI/2);
  var baseFour = new THREE.Mesh(baseGeometry, decorMat);
  baseFour.rotateZ(-Math.PI/4);

  scene.add(baseOne);
  baseOne.add(baseTwo);
  baseOne.add(baseThree);
  baseOne.add(baseFour);
  baseOne.position.x = 0;
  baseOne.position.y = 0;
  baseOne.position.z = -11;

  //cap is past spokes
  capOne = new THREE.Mesh(baseGeometry, decorMat);
  var capTwo = new THREE.Mesh(baseGeometry, decorMat);
  capTwo.rotateZ(Math.PI/4);
  var capThree = new THREE.Mesh(baseGeometry, decorMat);
  capThree.rotateZ(Math.PI/2);
  var capFour = new THREE.Mesh(baseGeometry, decorMat);
  capFour.rotateZ(-Math.PI/4);

  scene.add(capOne);
  capOne.add(capTwo);
  capOne.add(capThree);
  capOne.add(capFour);
  capOne.position.x = 0;
  capOne.position.y = 0;
  capOne.position.z = 16;

  // plug is centered at cap
  var plugGeometry = new THREE.BoxGeometry(7, 7 + 7 * Math.sqrt(2), 8);
  var plugOne = new THREE.Mesh(plugGeometry, decorMat);
  var plugTwo = new THREE.Mesh(plugGeometry, decorMat);
  plugTwo.rotateZ(Math.PI/4);
  var plugThree = new THREE.Mesh(plugGeometry, decorMat);
  plugThree.rotateZ(Math.PI/2);
  var plugFour = new THREE.Mesh(plugGeometry, decorMat);
  plugFour.rotateZ(-Math.PI/4);

  capOne.add(plugOne);
  capOne.add(plugTwo);
  capOne.add(plugThree);
  capOne.add(plugFour);

  // tip is at top of plugGeometry
  var tipOne = new THREE.Mesh(baseGeometry, decorMat);
  var tipTwo = new THREE.Mesh(baseGeometry, decorMat);
  tipTwo.rotateZ(Math.PI/4);
  var tipThree = new THREE.Mesh(baseGeometry, decorMat);
  tipThree.rotateZ(Math.PI/2);
  var tipFour = new THREE.Mesh(baseGeometry, decorMat);
  tipFour.rotateZ(-Math.PI/4);

  capOne.add(tipOne);
  tipOne.add(tipTwo);
  tipOne.add(tipThree);
  tipOne.add(tipFour);
  tipOne.position.z = 4;

}


function createCameraControls()
{
    cameraControls = new OrbitControls( camera, container );
}

// Creates points of light for scene
function createLights()
{
    // create 4 identical lights to light scene equally
    const light1 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light1.position.set( 15, 15, 2 );
    light1.castShadow = 'false';
    scene.add( light1 );

    const light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light2.position.set( -15, -15, 2 );
    light2.castShadow = 'false';
    scene.add( light2 );

    const light3 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light3.position.set( 15, -15, 2 );
    light3.castShadow = 'false';
    scene.add( light3 );

    const light4 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light4.position.set( -15, 15, 2 );
    light4.castShadow = 'false';
    scene.add( light4 );

    const light5 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light4.position.set( 0, 0, -15 );
    light5.castShadow = 'false';
    scene.add( light5 );


}

// Creates viewpoint for scene
function createCamera()
{
    // Create a Camera 
    const aspect = container.clientWidth / container.clientHeight;
    const fov = 50;           // fov = Field Of View
    const near = 0.1;          // the near clipping plane
    const far = 100;          // the far clipping plane
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    //camera.position.set( 0, 0, 10 );
    // every object is initially created at ( 0, 0, 0 ) and needs to be moved
    camera.position.x = -2;   // x+ is to the right.
    camera.position.y = 6;    // y+ is up.
    camera.position.z = 4;   // z+ moves camera closer (to us). z- further away.
    camera.position.set( -30, 30, 25 );
    camera.lookAt(0, 0, 10);
}


function createRenderer()
{
    //renderer = new THREE.WebGLRenderer();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    renderer.setPixelRatio( window.devicePixelRatio ); // only needed for mobile platforms.

    renderer.setClearColor('rgb(255, 255, 255)', 1.0);

    // we set this according to the div container.
    renderer.setSize( container.clientWidth, container.clientHeight );
    // add the automatically created <canvas> element to the page

    // set the gamma correction so that output colors look
    // correct on our screens
    // - makes it a bit brighter from before.
    // difference will be more significant with colors other than b/w.
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;

    container.appendChild( renderer.domElement );
    // render, or 'create a still image', of the scene
}

function createHelperGrids()
{
    // Create a Helper Grid ---------------------------------------------
    let size = 20;
    let divisions = 20;

    // Ground
    let gridHelper = new THREE.GridHelper( size, divisions, 0xff5555, 0x444488 );
    scene.add( gridHelper );

    //  Vertical
    let gridGround = new THREE.GridHelper( size, divisions, 0x55ff55, 0x667744 );
    gridGround.rotation.x = Math.PI / 2;
    scene.add( gridGround );
}

function init()
{
    // Get a reference to the container element that will hold our scene
    container = document.querySelector('#scene-container');

    // Create a Bare Scene-----------------------------------------------
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x555555 )

    // Create a Camera  -------------------------------------------------
    createCamera();

    // Let there be Light  ---------------------------------------------
    createLights();

    // Create a Grids Horizonal & Vertical -----------------------------
    //createHelperGrids();

    // Enable the Camera to move around
    createCameraControls();

    // Create the subject of
    createScene();

    // Create & Install Renderer ---------------------------------------
    createRenderer();


    play();

    renderer.render(scene, camera);  // renders once.
    // -----------------------------------------------------------------------




}

// Wraps update and render functions to be repeated
function play()
{
    renderer.setAnimationLoop( ( timestamp ) =>
        {
            update( timestamp );
            render();
        } );
}

function stop()
{
    renderer.setAnimationLoop( null );
}

function update( timestamp )
{
   timestamp *= 0.001;

   let slowdown = .4
   //const speed = 1 + 1 * slowdown;  // same speeds

   const speed = 0; // set to 0.

   cubes.forEach((cube, ndx) =>
        {
        const rot = timestamp * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
       });

}


function render( )
{
    // render scene
    renderer.render( scene, camera );
}


function onWindowResize()
{
    // Adjust viewport size when window changes size
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.clientWidth, container.clientHeight );
}

// rotate a spoke up
function rotateUp(cube) {
  cubes[cube].rotateZ(-Math.PI/4);

  if (spokeVals[cube] == 7) {
    spokeVals[cube] = 0;
  } else {
    spokeVals[cube] += 1;
  }

  //console.log(spokeVals[cube]);
}

// rotate a spoke down
function rotateDown(cube) {
  cubes[cube].rotateZ(Math.PI/4);

  if (spokeVals[cube] == 0) {
    spokeVals[cube] = 7;
  } else {
    spokeVals[cube] -= 1;
  }
}

// "Locks" cryptex and current string inside
function lock() {

  for (var i = 0; i < spokeVals.length; i++) {
    correctSpokeVals.push(spokeVals[i]);
    while (spokeVals[i] > 0) {
      rotateDown(i);
    }
  }


  gui.remove(lb);
  gui.remove(tb);

  var unlockButton = { unlock:function(){ unlock() } };
  ub = gui.add(unlockButton, 'unlock');
  capOne.position.z = 9;
}

// Unlocks cryptex and releases string, IF it is in correct position
function unlock() {

  var correctCombo = true;
  for(var i = 0; i < spokeVals.length; i++)  {
    if (spokeVals[i] != correctSpokeVals[i]) {
      correctCombo = false;
    }
  }
  if (correctCombo) {
    var textObj = {hidden: hiddenString};
    gui.remove(ub);
    gui.add(textObj, "hidden");
    capOne.position.z = 16;
  }
}

// Listener for resizing to adjust for window resizing
window.addEventListener( 'resize', onWindowResize );

//listener for keypress to rotate spokes
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 81) {
        rotateUp(0);
    } else if (keyCode == 65) {
        rotateDown(0);
    } else if (keyCode == 87) {
        rotateUp(1);
    } else if (keyCode == 83) {
        rotateDown(1);
    } else if (keyCode == 69) {
        rotateUp(2);
    } else if (keyCode == 68) {
        rotateDown(2);
    } else if (keyCode == 82) {
        rotateUp(3);
    } else if (keyCode == 70) {
        rotateDown(3);
    } else if (keyCode == 84) {
        rotateUp(4);
    } else if (keyCode == 71) {
        rotateDown(4);
    } else if (keyCode == 89) {
        rotateUp(5);
    } else if (keyCode == 78) {
        rotateDown(5);
    } else if (keyCode == 85) {
        rotateUp(6);
    } else if (keyCode == 74) {
        rotateDown(6);
    } else if (keyCode == 73) {
        rotateUp(7);
    } else if (keyCode == 75) {
        rotateDown(7);
    } else if (keyCode == 79) {
        rotateUp(8);
    } else if (keyCode == 76) {
        rotateDown(8);
    } else if (keyCode == 80) {
      rotateUp(9);
    } else if (keyCode == 59) {
      rotateDown(9);
    }
};

// Start
init();
