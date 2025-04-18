// Adarsh Singh
// asing209@ucsc.edu
// 1930592
// Assignment 1: Painting (Easy)

// asg1.js

// Vertex shader program
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }
`;

// Fragment shader program
const FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`;

let canvas, gl;
let a_Position, u_FragColor, u_Size;
let shapesList = [];
let currentShapeType = 'square';

function main() {
  canvas = document.getElementById('webgl');
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get WebGL context');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');

  canvas.onmousedown = (ev) => handleClick(ev);
  canvas.onmousemove = (ev) => { if (ev.buttons === 1) handleClick(ev); };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  clearCanvas();
}

function handleClick(ev) {
  const [x, y] = convertCoordinates(ev);
  const color = getCurrentColor();
  const size = getCurrentSize();
  const segments = getCurrentSegments();

  shapesList.push({ type: currentShapeType, x, y, color, size, segments });
  renderAllShapes();
}

function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (const shape of shapesList) {
    gl.uniform4f(u_FragColor, ...shape.color);
    gl.uniform1f(u_Size, shape.size || 10);

    if (shape.type === 'triangle') {
      drawTriangle(shape);
    } else if (shape.type === 'circle') {
      drawCircle(shape);
    } else if (shape.type === 'customTriangle') {
      drawCustomTriangle(shape);
    } else {
      gl.vertexAttrib3f(a_Position, shape.x, shape.y, 0.0);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }
}

function drawTriangle(shape) {
  const [x, y] = [shape.x, shape.y];
  const size = shape.size / 100; // Scale size for triangle vertices

  const vertices = new Float32Array([
    x, y + size,
    x - size, y - size,
    x + size, y - size
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function drawCircle(shape) {
  const [x, y] = [shape.x, shape.y];
  const r = shape.size / 200; // scale radius
  const n = shape.segments;

  const vertices = [x, y]; // Center of the circle
  for (let i = 0; i <= n; i++) {
    const angle = (i * 2 * Math.PI) / n;
    vertices.push(x + r * Math.cos(angle));
    vertices.push(y + r * Math.sin(angle));
  }

  const vertexData = new Float32Array(vertices);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);
}

function convertCoordinates(ev) {
  const rect = canvas.getBoundingClientRect();
  const x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
  const y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);
  return [x, y];
}

function getCurrentColor() {
  const r = parseFloat(document.getElementById('redSlider').value);
  const g = parseFloat(document.getElementById('greenSlider').value);
  const b = parseFloat(document.getElementById('blueSlider').value);
  return [r, g, b, 1.0];
}

function getCurrentSize() {
  return parseFloat(document.getElementById('sizeSlider').value);
}

function getCurrentSegments() {
  return parseInt(document.getElementById('segmentSlider').value);
}

function setShapeType(type) {
  currentShapeType = type;
}

function clearCanvas() {
  shapesList = [];
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function addBMWMLogo() {
  const logoTriangles = [
    // Light Blue Stripe
    { verts: [-0.8, 0.6, -0.7, -0.4, -0.6, 0.6], color: [0.0, 0.5, 1.0, 1.0] },
    { verts: [-0.9, -0.4, -0.7, -0.4, -0.8, 0.6], color: [0.0, 0.5, 1.0, 1.0] },
    
    // Dark Blue Stripe
    { verts: [-0.6, 0.6, -0.5, -0.4, -0.4, 0.6], color: [0.0, 0.0, 0.6, 1.0] },
    { verts: [-0.7, -0.4, -0.5, -0.4, -0.6, 0.6], color: [0.0, 0.0, 0.6, 1.0] },

    // Red Stripe
    { verts: [-0.4, 0.6, -0.3, -0.4, -0.2, 0.6], color: [1.0, 0.0, 0.0, 1.0] },
    { verts: [-0.5, -0.4, -0.3, -0.4, -0.4, 0.6], color: [1.0, 0.0, 0.0, 1.0] },
  
    // White "M" - right of red stripe (1st line)
    { verts: [-0.2, 0.6, -0.1, -0.4, 0.0, 0.6], color: [1.0, 1.0, 1.0, 1.0] },
    { verts: [-0.3, -0.4, -0.1, -0.4, -0.2, 0.6], color: [1.0, 1.0, 1.0, 1.0] },

    // White "M" - 2nd line
    { verts: [-0.05, 0.6, -0.05, -0.4, 0.1, -0.4], color: [1.0, 1.0, 1.0, 1.0] },
    { verts: [-0.05, 0.6, 0.1, 0.6, 0.1, -0.4], color: [1.0, 1.0, 1.0, 1.0] },

    // White "M" - 3rd line
    { verts: [0.15, 0.6, 0.25, -0.4, 0.35, 0.6], color: [1.0, 1.0, 1.0, 1.0] },
    { verts: [0.05, -0.4, 0.25, -0.4, 0.15, 0.6], color: [1.0, 1.0, 1.0, 1.0] },

    // White "M" - 4th line
    { verts: [0.3, 0.6, 0.3, -0.4, 0.5, -0.4], color: [1.0, 1.0, 1.0, 1.0] },
    { verts: [0.3, 0.6, 0.5, 0.6, 0.5, -0.4], color: [1.0, 1.0, 1.0, 1.0] }
];

  for (const tri of logoTriangles) {
    shapesList.push({
      type: 'customTriangle',
      vertices: tri.verts,
      color: tri.color
    });
  }

  renderAllShapes();
}

function drawCustomTriangle(shape) {
  const vertices = new Float32Array(shape.vertices);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}


