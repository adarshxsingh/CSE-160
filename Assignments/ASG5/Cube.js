// Adarsh Singh
// asing209@ucsc.edu
// 1930592
// Assignment 5: Exploring a High-Level Graphics Library (Medium)

// Cube.js

import { Matrix4 } from './lib/cuon-matrix-cse160.js';


class Cube {
  constructor() {
    this.type = 'cube';
    this.color = [1.0, 1.0, 1.0, 1.0];      // Default white
    this.matrix = new Matrix4();           // Transformation matrix
    this.textureNum = -2;                  // Texture flag
  }

  // === Draw the cube face-by-face with different shading ===
  drawCube() {
    gl.uniform1i(u_whichTexture, this.textureNum);
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Face 1 (Front)
    this.#setColor(1.0);
    drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([0,0,0, 1,1,0, 0,1,0], [0,0, 1,1, 0,1]);

    // Face 2 (Top)
    this.#setColor(0.7);
    drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);
    drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0]);

    // Face 3 (Bottom)
    this.#setColor(0.6);
    drawTriangle3DUV([0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1]);
    drawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0]);

    // Face 4 (Back)
    this.#setColor(0.9);
    drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);

    // Face 5 (Left)
    this.#setColor(0.8);
    drawTriangle3DUV([0,0,0, 0,1,1, 0,1,0], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([0,0,0, 0,1,1, 0,0,1], [0,0, 1,1, 0,1]);

    // Face 6 (Right)
    drawTriangle3DUV([1,0,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 0,1]);
  }

  // === Optimized full-draw for performance ===
  drawCubeFast() {
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, ...this.color);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    const vertices = [].concat(
      [0,0,0, 1,1,0, 1,0,0,     0,0,0, 0,1,0, 1,1,0], // front
      [0,0,1, 1,1,1, 1,0,1,     0,0,1, 0,1,1, 1,1,1], // back
      [0,1,0, 0,1,1, 1,1,1,     0,1,0, 1,1,1, 1,1,0], // top
      [0,0,0, 0,0,1, 1,0,1,     0,0,0, 1,0,1, 1,0,0], // bottom
      [1,1,0, 1,1,1, 1,0,0,     1,0,0, 1,1,1, 1,0,1], // right
      [0,1,0, 0,1,1, 0,0,0,     0,0,0, 0,1,1, 0,0,1]  // left
    );

    const uvs = Array(6).fill([0,0, 1,1, 1,0,  0,0, 0,1, 1,1]).flat();
    const normals = [].concat(
      Array(6).fill([0,0,-1]).flat(),
      Array(6).fill([0,0,1]).flat(),
      Array(6).fill([0,1,0]).flat(),
      Array(6).fill([0,-1,0]).flat(),
      Array(6).fill([1,0,0]).flat(),
      Array(6).fill([-1,0,0]).flat()
    );

    drawTriangle3DUVNormal(vertices, uvs, normals);
  }

  // === Internal helper to apply face shading ===
  #setColor(scale = 1.0) {
    const [r, g, b, a] = this.color;
    gl.uniform4f(u_FragColor, r * scale, g * scale, b * scale, a);
  }
}

export { Cube };