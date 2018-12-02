import { vec2, mat4 } from "../engine/gl-matrix.js";
import * as Keyboard from "../engine/keyboard.js";
import * as Util from "../engine/util.js";

import * as fragSrc from "../../assets/shaders/basicTexture.frag";
import * as vertSrc from "../../assets/shaders/basic.vert";

export default class Corpsebot {

  constructor(gl, tilesheet) {
    this.pos = vec2.fromValues(10, 10);
    // Create program and link shaders
    this.programInfo = Util.createProgram(gl, {vertex: vertSrc, fragment: fragSrc}, {
      uniform: {
        camera: 'camera',
        diffuse: 'diffuse',
        transform: 'transform',
      },
      attribute: {
        position: 'vertex_pos',
        uv: 'vertex_uv',
      },
    });

    this.vertexBuffer = gl.createBuffer();
    this.buildVerts();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);

    // -- Init Texture
    this.diffuse = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.diffuse);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tilesheet);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  }

  buildVerts() {
    const verts = [];

    function correctedUV(pos) {
      return (pos + 0.5) / tilesheetPxWidth;
    }

    // Width and height of tilesheet in px
    const tilesheetPxWidth = 128;

    // Width and height of tilesheet in different images
    const tilesheetWidth = 4;
    const imageWidth = Math.floor(tilesheetPxWidth/tilesheetWidth);

    const texLocX = 0;
    const texLocY = 0;

    verts.push(
      // First tri
      0, -2,
      correctedUV(texLocX*imageWidth), correctedUV((texLocY+2)*imageWidth -1),
      -1, -2,
      correctedUV((texLocX+1)*imageWidth -1), correctedUV((texLocY+2)*imageWidth -1),
      0, 0,
      correctedUV(texLocX*imageWidth), correctedUV(texLocY*imageWidth),
      // Second tri
      -1, 0,
      correctedUV((texLocX+1)*imageWidth -1), correctedUV(texLocY*imageWidth),
      0, 0,
      correctedUV(texLocX*imageWidth), correctedUV(texLocY*imageWidth),
      -1, -2,
      correctedUV((texLocX+1)*imageWidth -1), correctedUV((texLocY+2)*imageWidth -1),
    );

    this.vertexData = new Float32Array(verts);
  }

  update() {
  }

  draw(canvas, gl, camera) {
    gl.useProgram(this.programInfo.program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.diffuse);
    gl.uniform1i(this.programInfo.locations.uniform.diffuse, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    gl.enableVertexAttribArray(this.programInfo.locations.attribute.position);
    gl.vertexAttribPointer(this.programInfo.locations.attribute.position, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(this.programInfo.locations.attribute.uv);
    gl.vertexAttribPointer(this.programInfo.locations.attribute.uv, 2, gl.FLOAT, false, 16, 8);

    gl.uniformMatrix4fv(
      this.programInfo.locations.uniform.camera,
      false,
      camera.matrix
    );

    // TODO
    const temp = mat4.create();
    Util.mat4fromTrans2d(temp, this.pos);
    gl.uniformMatrix4fv(
      this.programInfo.locations.uniform.transform,
      false,
      temp
    );

    gl.drawArrays(gl.TRIANGLES, 0, this.vertexData.length/4);
    gl.disableVertexAttribArray(this.programInfo.locations.attribute.vertex);
  }

}




