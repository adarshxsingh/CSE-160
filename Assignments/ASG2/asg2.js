// Adarsh Singh
// asing209@ucsc.edu
// 1930592
// Assignment 2: Blocky 3D Animal (Medium)

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
      console.log('Failed to get WebGL context');
      return;
    }
  
    // Initialize shaders from HTML script tags
    if (!initShaders(gl,
      document.getElementById('vertex-shader').text,
      document.getElementById('fragment-shader').text)) {
      console.log('Failed to initialize shaders.');
      return;
    }
  
    // Get shader attribute/uniform locations
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  
    if (a_Position < 0 || a_Color < 0 || !u_ModelMatrix || !u_ViewMatrix || !u_ProjMatrix) {
      console.log('Failed to get attribute/uniform locations');
      return;
    }
  
    // Set up the view and projection matrices
    viewMatrix.setLookAt(0, 0, 5, 0, 0, 0, 0, 1, 0);
    projMatrix.setPerspective(60, canvas.width / canvas.height, 1, 100);
  
    // Set up WebGL render state
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // black background
    gl.enable(gl.DEPTH_TEST);          // enable z-buffer
  
    // Call the animation loop
    tick();
  }
  

function tick() {
    g_seconds = (performance.now() - g_startTime) / 1000.0;
    updateAnimationAngles(); 
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
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  
    let baseMatrix = new Matrix4();
    baseMatrix.rotate(g_xRotate, 1, 0, 0);     // tilt forward/back
    baseMatrix.rotate(g_globalRotate, 0, 1, 0); // spin left/right
  
    // Body
    modelMatrix.set(baseMatrix);
    modelMatrix.translate(0, 0, 0);
    modelMatrix.scale(1.0, 0.5, 0.5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  
    // Head
    modelMatrix.set(baseMatrix);
    modelMatrix.translate(0, 0.75, 0);
    modelMatrix.scale(0.5, 0.5, 0.5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  
    // Left Leg
    modelMatrix.set(baseMatrix);
    modelMatrix.translate(-0.3, -0.5, 0.2);
    modelMatrix.rotate(g_leftLegAngle, 1, 0, 0);  // 1st-level joint
    modelMatrix.scale(0.2, 0.4, 0.2);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Left Foot
    modelMatrix.translate(0, -0.4, 0);
    modelMatrix.rotate(g_leftFootAngle || 0, 1, 0, 0);
    modelMatrix.translate(0, -0.1, 0);
    modelMatrix.scale(1.0, 0.5, 1.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Right Lag
    modelMatrix.set(baseMatrix);
    modelMatrix.translate(0.3, -0.5, 0.2);
    modelMatrix.rotate(g_rightLegAngle, 1, 0, 0);  // 1st-level joint
    modelMatrix.scale(0.2, 0.4, 0.2);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Right Foot
    modelMatrix.translate(0, -0.4, 0);
    modelMatrix.rotate(g_rightFootAngle || 0, 1, 0, 0); 
    modelMatrix.translate(0, -0.1, 0);
    modelMatrix.scale(1.0, 0.5, 1.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Left Ar
    modelMatrix.set(baseMatrix);
    modelMatrix.translate(-0.6, 0.1, 0);
    modelMatrix.rotate(g_leftArmAngle, 1, 0, 0);
    modelMatrix.scale(0.2, 0.3, 0.2);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Left Hand
    modelMatrix.translate(0, -0.3, 0);
    modelMatrix.rotate(g_leftHandAngle || 0, 1, 0, 0);
    modelMatrix.translate(0, -0.15, 0);
    modelMatrix.scale(1.0, 1.0, 1.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Right Ar
    modelMatrix.set(baseMatrix);
    modelMatrix.translate(0.6, 0.1, 0);
    modelMatrix.rotate(g_rightArmAngle, 1, 0, 0);
    modelMatrix.scale(0.2, 0.3, 0.2);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // RIGHT HAND (2nd-level)
    modelMatrix.translate(0, -0.3, 0);
    modelMatrix.rotate(g_rightHandAngle || 0, 1, 0, 0);
    modelMatrix.translate(0, -0.15, 0);
    modelMatrix.scale(1.0, 1.0, 1.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();

    // Snout
    modelMatrix.set(baseMatrix);
    modelMatrix.translate(0, 0.85, 0.25);
    modelMatrix.scale(0.2, 0.2, 0.1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  
    // Tail
    // Tail (wagging animation)
    // let tailAngle = 30 * Math.sin(g_seconds * g_tailSpeed);  // wag back and forth
    let tailAngle = g_tailAngle;

    modelMatrix.rotate(tailAngle, 0, 1, 0); // wag side-to-side

    modelMatrix.set(baseMatrix);
    modelMatrix.translate(0, 0.0, -0.7);
    modelMatrix.rotate(tailAngle, 0, 1, 0); // wag side-to-side
    modelMatrix.scale(0.1, 0.1, 0.3);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  
    // Left Ear
    modelMatrix.set(baseMatrix);
    modelMatrix.translate(-0.2, 1.1, 0);
    modelMatrix.scale(0.1, 0.2, 0.1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  
    // Right Ear
    modelMatrix.set(baseMatrix);
    modelMatrix.translate(0.2, 1.1, 0);
    modelMatrix.scale(0.1, 0.2, 0.1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  
    // Left Nostril
    modelMatrix.set(baseMatrix);
    modelMatrix.translate(-0.05, 0.88, 0.31);
    modelMatrix.scale(0.05, 0.05, 0.01);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  
    // Right Nostril
    modelMatrix.set(baseMatrix);
    modelMatrix.translate(0.05, 0.88, 0.31);
    modelMatrix.scale(0.05, 0.05, 0.01);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  
    // Left Eye
    modelMatrix.set(baseMatrix);
    modelMatrix.translate(-0.1, 1.0, 0.25);
    modelMatrix.scale(0.05, 0.05, 0.01);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  
    // Right Eye
    modelMatrix.set(baseMatrix);
    modelMatrix.translate(0.1, 1.0, 0.25);
    modelMatrix.scale(0.05, 0.05, 0.01);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawCube();
  }

// Camera rotation variable
let g_cameraAngle = 0;
let g_globalRotate = 0;
function onGlobalRotateChange(val) {
    g_globalRotate = parseFloat(val);
    renderScene();
  }

let g_xRotate = 0;
function onXRotateChange(val) {
  g_xRotate = parseFloat(val);
  renderScene();
}

let g_tailSpeed = 5;
function onTailSpeedChange(val) {
  g_tailSpeed = parseFloat(val);
}

let g_leftArmAngle = 0;
let g_rightArmAngle = 0;

function onLeftArmChange(val) {
  g_leftArmAngle = parseFloat(val);
  renderScene();
}

function onRightArmChange(val) {
  g_rightArmAngle = parseFloat(val);
  renderScene();
}

let g_tailAnimationOn = false;
let g_tailAngle = 0;

function updateAnimationAngles() {
  if (g_tailAnimationOn) {
    g_tailAngle = 30 * Math.sin(g_seconds * g_tailSpeed);
  }
}

function toggleTailAnimation() {
  g_tailAnimationOn = !g_tailAnimationOn;
}

// Slider for the second-level joint (left hand)
let g_leftHandAngle = 0;
function onLeftHandChange(val) {
  g_leftHandAngle = parseFloat(val);
  renderScene();
}

// Slider for the second-level joint (right hand)
let g_rightHandAngle = 0;
function onRightHandChange(val) {
  g_rightHandAngle = parseFloat(val);
  renderScene();
}

// Slider for second-joint (left foot)
let g_leftFootAngle = 0;
function onLeftFootChange(val) {
  g_leftFootAngle = parseFloat(val);
  renderScene();
}

// Slider for second-joint (right foot)
let g_rightFootAngle = 0;
function onRightFootChange(val) {
  g_rightFootAngle = parseFloat(val);
  renderScene();
}

// Slider for left leg
let g_leftLegAngle = 0;
function onLeftLegChange(val) {
  g_leftLegAngle = parseFloat(val);
  renderScene();
}

// Slider for right leg
let g_rightLegAngle = 0;
function onRightLegChange(val) {
  g_rightLegAngle = parseFloat(val);
  renderScene();
}

// Key controls
document.onkeydown = function (ev) {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(ev.key)) {
    ev.preventDefault();
  }

  if (ev.key === 'ArrowLeft') {
    g_cameraAngle -= 5;
  } else if (ev.key === 'ArrowRight') {
    g_cameraAngle += 5;
  } else if (ev.key === 'ArrowUp') {
    g_xRotate = Math.min(g_xRotate + 5, 90);
  } else if (ev.key === 'ArrowDown') {
    g_xRotate = Math.max(g_xRotate - 5, -90);
  } else if (ev.key === 'q' || ev.key === 'Q') {
    g_leftArmAngle = Math.min(g_leftArmAngle + 5, 90);
    document.getElementById('leftArm').value = g_leftArmAngle;
  } else if (ev.key === 'a' || ev.key === 'A') {
    g_leftArmAngle = Math.max(g_leftArmAngle - 5, 0);
    document.getElementById('leftArm').value = g_leftArmAngle;
  } else if (ev.key === 'e' || ev.key === 'E') {
    g_rightArmAngle = Math.min(g_rightArmAngle + 5, 90);
    document.getElementById('rightArm').value = g_rightArmAngle;
  } else if (ev.key === 'd' || ev.key === 'D') {
    g_rightArmAngle = Math.max(g_rightArmAngle - 5, 0);
    document.getElementById('rightArm').value = g_rightArmAngle;
  }

  // Left Hand: Z / X
  else if (ev.key === 'z' || ev.key === 'Z') {
    g_leftHandAngle = Math.min(g_leftHandAngle + 5, 45);
    document.getElementById('leftHand').value = g_leftHandAngle;
  } else if (ev.key === 'x' || ev.key === 'X') {
    g_leftHandAngle = Math.max(g_leftHandAngle - 5, -45);
    document.getElementById('leftHand').value = g_leftHandAngle;
  }

  // Right Hand: C / V
  else if (ev.key === 'c' || ev.key === 'C') {
    g_rightHandAngle = Math.min(g_rightHandAngle + 5, 45);
    document.getElementById('rightHand').value = g_rightHandAngle;
  } else if (ev.key === 'v' || ev.key === 'V') {
    g_rightHandAngle = Math.max(g_rightHandAngle - 5, -45);
    document.getElementById('rightHand').value = g_rightHandAngle;
  }

  // Left Leg: T / G
  else if (ev.key === 't' || ev.key === 'T') {
    g_leftLegAngle = Math.min(g_leftLegAngle + 5, 45);
    document.getElementById('leftLeg').value = g_leftLegAngle;
  } else if (ev.key === 'g' || ev.key === 'G') {
    g_leftLegAngle = Math.max(g_leftLegAngle - 5, -45);
    document.getElementById('leftLeg').value = g_leftLegAngle;
  }

  // Right Leg: Y / H
  else if (ev.key === 'y' || ev.key === 'Y') {
    g_rightLegAngle = Math.min(g_rightLegAngle + 5, 45);
    document.getElementById('rightLeg').value = g_rightLegAngle;
  } else if (ev.key === 'h' || ev.key === 'H') {
    g_rightLegAngle = Math.max(g_rightLegAngle - 5, -45);
    document.getElementById('rightLeg').value = g_rightLegAngle;
  }

  // Left Foot: B / N
  else if (ev.key === 'b' || ev.key === 'B') {
    g_leftFootAngle = Math.min(g_leftFootAngle + 5, 45);
    document.getElementById('leftFoot').value = g_leftFootAngle;
  } else if (ev.key === 'n' || ev.key === 'N') {
    g_leftFootAngle = Math.max(g_leftFootAngle - 5, -45);
    document.getElementById('leftFoot').value = g_leftFootAngle;
  }

  // Right Foot: M / ,
  else if (ev.key === 'm' || ev.key === 'M') {
    g_rightFootAngle = Math.min(g_rightFootAngle + 5, 45);
    document.getElementById('rightFoot').value = g_rightFootAngle;
  } else if (ev.key === ',' || ev.key === '<') {
    g_rightFootAngle = Math.max(g_rightFootAngle - 5, -45);
    document.getElementById('rightFoot').value = g_rightFootAngle;
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

  