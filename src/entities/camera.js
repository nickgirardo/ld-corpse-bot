import {mat4} from "../engine/gl-matrix.js";

export default class Camera {

  constructor(unitsAcross, aspectRatio) {
    this.matrix = mat4.create();

    mat4.ortho(
      this.matrix,
      0, // Left
      unitsAcross, // Right
      0, // Bottom
      unitsAcross / aspectRatio, // Top
      -0.1, // Near
      2 // Far
    );
  }

  draw() {}

  update() {}

}
