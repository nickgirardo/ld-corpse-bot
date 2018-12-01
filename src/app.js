import * as Util from "./engine/util.js";
import * as Keyboard from "./engine/keyboard.js";

import Camera from "./entities/camera.js";
import Map from "./entities/map.js";

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2', { antialias: false });

const aspectRatio = 16/9;

import * as tilesheet from "../assets/img/tilesheet.png";

const scene = [];

let camera = new Camera(40, aspectRatio);

function draw() {
  gl.clearColor(0.6, 0.6, 0.6, 1.0); // Clear background with light grey color
  gl.clearDepth(1.0); // Clear the depth buffer
  gl.enable(gl.DEPTH_TEST); // Enable depth testing, insures correct ordering
  gl.depthFunc(gl.LEQUAL); // Near obscures far

  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw each individual element
  scene.forEach(t=>t.draw(canvas, gl, camera));
}

function update() {
  scene.forEach(e=>e.update())
  draw();

  window.requestAnimationFrame(update);
}

function init() {
  const isWebGL2 = !!gl;
  if(!isWebGL2) {
    document.querySelector('body').style.backgroundColor = 'red';
    console.error("Unable to create webgl2 context");
    return;
  }

  Keyboard.init();

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  Util.resize(gl, canvas, aspectRatio);
  window.addEventListener("resize", e=>Util.resize(gl, canvas, aspectRatio));

  scene.push(camera);
  Util.loadImage(tilesheet).then((img) => scene.push(new Map(gl, img, 40)));

  update();
}

init();
