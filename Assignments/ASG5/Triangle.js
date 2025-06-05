// Adarsh Singh
// asing209@ucsc.edu
// 1930592
// Assignment 5: Exploring a High-Level Graphics Library (Medium)

// Triangle.js

class Triangle {
  constructor() {
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.buffer = null;
  }

  render() {
    const [x, y] = this.position;
    const [r, g, b, a] = this.color;

    // Create buffer if it hasn't been made yet
    if (this.buffer === null) {
      this.buffer = gl.createBuffer();
      if (!this.buffer) {
        console.error("Failed to create vertex buffer.");
        return;
      }
    }

    // Configure shader attributes
    gl.disableVertexAttribArray(a_Position);
    gl.uniform4f(u_FragColor, r, g, b, a);
    gl.uniform1f(u_Size, size);

    // Draw a small triangle centered at (x, y)
    const tri = [
      x, y,
      x + 0.005 * size, y - 0.01 * size,
      x - 0.005 * size, y - 0.01 * size
    ];
    draw2DTriangle(tri);
  }
}

// === Draw 2D triangle using float array (XY only)
function draw2DTriangle(vertices) {
  const count = vertices.length / 2;

  const vbuf = gl.createBuffer();
  if (!vbuf) {
    console.error("Failed to create buffer object.");
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.drawArrays(gl.TRIANGLES, 0, count);
}

// === Draw 3D triangle (XYZ only)
function drawTriangle3D(vertices) {
  const count = vertices.length / 3;

  const vbuf = gl.createBuffer();
  if (!vbuf) {
    console.error("Failed to create vertex buffer.");
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.drawArrays(gl.TRIANGLES, 0, count);
}

// === Predefined global buffer (used for faster reuse)
let g_vertexBufferCube = null;

// === Setup static buffer for cube vertices
function initTriangle3D(vertices) {
  g_vertexBufferCube = gl.createBuffer();
  if (!g_vertexBufferCube) {
    console.error("Failed to create vertex buffer.");
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBufferCube);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
}

let g_uvBuffer = null;

// === Setup UV coordinates for texture mapping
function initUV(uvs) {
  g_uvBuffer = gl.createBuffer();
  if (!g_uvBuffer) {
    console.error("Failed to create UV buffer.");
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_UV);
}

// === Draw textured triangle with optional UVs
function drawTriangle3DUV(vertices, uv) {
  const count = vertices.length / 3;

  if (g_vertexBufferCube === null) {
    g_vertexBufferCube = gl.createBuffer();
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBufferCube);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  if (g_uvBuffer === null) {
    initUV(uv);
  }

  gl.drawArrays(gl.TRIANGLES, 0, count);
}

// === Draw 3D triangle with UVs and Normals (for lighting)
function drawTriangle3DUVNormal(vertices, uv, normals) {
  const count = vertices.length / 3;

  // Position buffer
  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // UV buffer
  const uvBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_UV);

  // Normal buffer
  const normBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Normal);

  gl.drawArrays(gl.TRIANGLES, 0, count);

  // Prevent reuse
  g_vertexBufferCube = null;
}