// asg2.js

// Global Variables
let canvas, gl;
let a_Position, a_Color;
let u_ModelMatrix, u_ViewMatrix, u_ProjMatrix;
let modelMatrix = new Matrix4();
let viewMatrix = new Matrix4();
let projMatrix = new Matrix4();

function main() {
  // Get canvas element
  canvas = document.getElementById('webgl');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return;
  }

  // Get WebGL context
  gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, document.getElementById('vertex-shader').text, document.getElementById('fragment-shader').text)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // Get attribute and uniform locations
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

  if (a_Position < 0 || a_Color < 0 || !u_ModelMatrix || !u_ViewMatrix || !u_ProjMatrix) {
    console.log('Failed to get attribute or uniform locations');
    return;
  }

  // Set up the view and projection matrices
  viewMatrix.setLookAt(0, 0, 5, 0, 0, 0, 0, 1, 0);
  projMatrix.setPerspective(60, canvas.width / canvas.height, 1, 100);

  // Set background color and clear
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Draw the scene
  renderScene();
}

function renderScene() {
  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Pass view and projection matrices
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

  // Example: draw a single block
  modelMatrix.setTranslate(0, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  drawCube();
}

function drawCube() {
  // Define cube vertices (position and color)
  let vertices = new Float32Array([
    // Positions         // Colors
    -0.5, -0.5, -0.5,    1.0, 0.0, 0.0,
     0.5, -0.5, -0.5,    0.0, 1.0, 0.0,
     0.5,  0.5, -0.5,    0.0, 0.0, 1.0,
    -0.5,  0.5, -0.5,    1.0, 1.0, 0.0,
    -0.5, -0.5,  0.5,    0.0, 1.0, 1.0,
     0.5, -0.5,  0.5,    1.0, 0.0, 1.0,
     0.5,  0.5,  0.5,    0.5, 0.5, 0.5,
    -0.5,  0.5,  0.5,    1.0, 1.0, 1.0,
  ]);

  let indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    0, 1, 5, 0, 5, 4,
    2, 3, 7, 2, 7, 6,
    0, 3, 7, 0, 7, 4,
    1, 2, 6, 1, 6, 5,
  ]);

  // Create buffers
  let vertexBuffer = gl.createBuffer();
  let indexBuffer = gl.createBuffer();
  if (!vertexBuffer || !indexBuffer) {
    console.log('Failed to create buffers');
    return;
  }

  // Bind and write vertex buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  let FSIZE = vertices.BYTES_PER_ELEMENT;

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // Bind and write index buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  // Draw
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
}
