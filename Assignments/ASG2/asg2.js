// asg2.js

// Global Variables
let canvas, gl;
let a_Position, a_Color;
let u_ModelMatrix, u_ViewMatrix, u_ProjMatrix;
let modelMatrix = new Matrix4();
let viewMatrix = new Matrix4();
let projMatrix = new Matrix4();

// Animation
let g_seconds = 0;
let g_startTime = performance.now();

console.log('asg2.js loaded');


function main() {
    // Get the canvas element from HTML
    canvas = document.getElementById('webgl');
  
    // Get WebGL context
    gl = getWebGLContext(canvas);
    if (!gl) {
      console.log('❌ Failed to get WebGL context');
      return;
    }
  
    // Initialize shaders from HTML script tags
    if (!initShaders(gl,
      document.getElementById('vertex-shader').text,
      document.getElementById('fragment-shader').text)) {
      console.log('❌ Failed to initialize shaders.');
      return;
    }
  
    // Get shader attribute/uniform locations
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  
    if (a_Position < 0 || a_Color < 0 || !u_ModelMatrix || !u_ViewMatrix || !u_ProjMatrix) {
      console.log('❌ Failed to get attribute/uniform locations');
      return;
    }
  
    // Set up the view and projection matrices
    viewMatrix.setLookAt(0, 0, 5, 0, 0, 0, 0, 1, 0);
    projMatrix.setPerspective(60, canvas.width / canvas.height, 1, 100);
  
    // Set up WebGL render state
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // black background
    gl.enable(gl.DEPTH_TEST);          // enable z-buffer
  
    // ✅ Call the animation loop
    tick();
  }
  

function tick() {
  g_seconds = (performance.now() - g_startTime) / 1000.0;
  updateViewMatrix();
  renderScene();
  requestAnimationFrame(tick);
}

function updateViewMatrix() {
    let rad = g_cameraAngle * Math.PI / 180;
    let eyeX = 5 * Math.sin(rad);
    let eyeZ = 5 * Math.cos(rad);
    viewMatrix.setLookAt(eyeX, 0, eyeZ, 0, 0, 0, 0, 1, 0);
  }

function renderScene() {
    console.log('renderScene called');

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  
    // Body
    modelMatrix.setIdentity();
    modelMatrix.translate(0, 0, 0);
    modelMatrix.scale(1.0, 0.5, 0.5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  
    // Head
    modelMatrix.setIdentity();
    modelMatrix.translate(0, 0.75, 0);
    modelMatrix.scale(0.5, 0.5, 0.5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  
    // Left Leg
    modelMatrix.setIdentity();
    modelMatrix.translate(-0.3, -0.5, 0.2);
    modelMatrix.scale(0.2, 0.4, 0.2);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  
    // Right Leg
    modelMatrix.setIdentity();
    modelMatrix.translate(0.3, -0.5, 0.2);
    modelMatrix.scale(0.2, 0.4, 0.2);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  
    // Tail
    let tailOffset = 0.2 * Math.sin(g_seconds * 5.0);
    modelMatrix.setIdentity();
    modelMatrix.translate(0, 0.0, -0.6);
    modelMatrix.rotate(tailOffset * 30, 0, 1, 0);
    modelMatrix.scale(0.1, 0.1, 0.4);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
    
    // Left Ear
    modelMatrix.setTranslate(-0.2, 1.1, 0);
    modelMatrix.scale(0.1, 0.2, 0.1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Right Ear
    modelMatrix.setTranslate(0.2, 1.1, 0);
    modelMatrix.scale(0.1, 0.2, 0.1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Snout
    modelMatrix.setTranslate(0, 0.85, 0.25);  // sticking out from the head
    modelMatrix.scale(0.2, 0.2, 0.1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Left Arm
    modelMatrix.setTranslate(-0.6, 0.1, 0);
    modelMatrix.scale(0.2, 0.3, 0.2);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Right Arm
    modelMatrix.setTranslate(0.6, 0.1, 0);
    modelMatrix.scale(0.2, 0.3, 0.2);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Tail
    modelMatrix.setTranslate(0, 0.0, -0.7);  // sticking behind the body
    modelMatrix.scale(0.1, 0.1, 0.3);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Left Nostril
    modelMatrix.setTranslate(-0.05, 0.88, 0.31);
    modelMatrix.scale(0.05, 0.05, 0.01);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Right Nostril
    modelMatrix.setTranslate(0.05, 0.88, 0.31);
    modelMatrix.scale(0.05, 0.05, 0.01);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Left Eye
    modelMatrix.setTranslate(-0.1, 1.0, 0.25);
    modelMatrix.scale(0.05, 0.05, 0.01);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Right Eye
    modelMatrix.setTranslate(0.1, 1.0, 0.25);
    modelMatrix.scale(0.05, 0.05, 0.01);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

  }

// Camera rotation variable
let g_cameraAngle = 0;

// Key controls
document.onkeydown = function (ev) {
  if (ev.key === 'ArrowLeft') {
    g_cameraAngle -= 5;
  } else if (ev.key === 'ArrowRight') {
    g_cameraAngle += 5;
  }
  updateViewMatrix();
  renderScene();
};

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
