import { vec2, mat4 } from "../engine/gl-matrix.js";
import * as Keyboard from "../engine/keyboard.js";
import * as Util from "../engine/util.js";

import * as fragSrc from "../../assets/shaders/basicTexture.frag";
import * as vertSrc from "../../assets/shaders/basic.vert";

export default class Corpsebot {

  constructor(gl, tilesheet) {
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

    this.translation = mat4.create();

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

    this.pos = vec2.fromValues(10, 8);
    this.vel = vec2.create();
    this.friction = 0.65;
  }

  update() {
    function moreRecentPress(a, b) {
      if (Keyboard.keys[a] && Keyboard.keys[b])
        return (Keyboard.timestamps[b] > Keyboard.timestamps[a]) ? -1 : 1;
      else if (Keyboard.keys[a] || Keyboard.keys[b])
        return Keyboard.keys[b] ? -1 : 1;
      else
        return 0;
    }

    const direction = moreRecentPress(68, 65);

    this.vel[0] += direction * 0.1;
    this.vel[0] *= this.friction;

    vec2.add(this.pos, this.pos, this.vel);

    Util.mat4fromTrans2d(this.translation, this.pos);
  }

  buildVerts() {
    const verts = [];

    function correctedUV(pos) {
      return (pos + 0.5) / tilesheetPxWidth;
    }

    // Width and height of tilesheet in px
    const tilesheetPxWidth = 128;

    // Width and height of tilesheet in different images
    const tilesheetWidth = 8;
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

    gl.uniformMatrix4fv(
      this.programInfo.locations.uniform.transform,
      false,
      this.translation
    );

    gl.drawArrays(gl.TRIANGLES, 0, this.vertexData.length/4);
    gl.disableVertexAttribArray(this.programInfo.locations.attribute.vertex);
  }

}




