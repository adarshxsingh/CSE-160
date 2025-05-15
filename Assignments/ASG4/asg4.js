// asg4.js – Lighting and Animation Assignment

// ===================== Global Variables =====================
let canvas, gl;
let a_Position, a_UV, a_Normal;
let u_ModelMatrix, u_GlobalRotateMatrix, u_ViewMatrix, u_ProjectionMatrix;
let u_FragColor, u_whichTexture;
let u_Sampler0, u_Sampler1, u_Sampler2;
let u_lightPos, u_spotLightPos, u_cameraPos, u_lightColor, u_light, u_lightC;

let g_camera = new Camera();
let g_lightPos = [10, 3, 12];
let g_spotlightPos = [10.125, 0.6, 7.15];
let g_lightColor = [1, 1, 1];
let g_seconds = 0, g_start_time = performance.now() / 1000;
let g_globalAngleX = 0, g_globalAngleY = 0;
let g_normal = false;
let g_CalltheSheep = true;
let g_Animation = false;
let g_lightMoveOn = false;

// ===================== Shader Strings (to be filled) =====================
const VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }
`;

const FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform vec3 u_lightColor;
  uniform int u_light;
  uniform int u_lightC;
  uniform vec3 u_spotLightPos;
  void main() {
    vec4 color;
    if(u_whichTexture == -3) {
      color = vec4((v_Normal + 1.0) / 2.0, 1.0);
    } else if(u_whichTexture == -2) {
      color = u_FragColor;
    } else if (u_whichTexture == -1) {
      color = vec4(v_UV, 1.0, 1.0);
    } else if(u_whichTexture == 0) {
      color = texture2D(u_Sampler0, v_UV);
    } else if(u_whichTexture == 1) {
      color = texture2D(u_Sampler1, v_UV);
    } else if(u_whichTexture == 2) {
      color = texture2D(u_Sampler2, v_UV);
    } else {
      color = vec4(1, 0.2, 0.2, 1);
    }

    if (u_light == 1) {
      vec3 L = normalize(u_lightPos - vec3(v_VertPos));
      vec3 N = normalize(v_Normal);
      float nDotL = max(dot(N, L), 0.0);
      vec3 R = reflect(-L, N);
      vec3 E = normalize(u_cameraPos - vec3(v_VertPos));
      float specular = pow(max(dot(E, R), 0.0), 100.0);
      vec3 diffuse = vec3(color) * nDotL;
      vec3 ambient = vec3(color) * 0.3;
      if (u_whichTexture == 0 || u_whichTexture == 1 || u_whichTexture == -2) specular = 0.0;
      if (u_lightC == 0) {
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      } else {
        gl_FragColor = vec4(u_lightColor * (diffuse + ambient), 1.0);
      }
    } else {
      gl_FragColor = color;
    }
  }
`;

// ===================== Main Entry =====================
function main() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('WebGL not supported');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error('Shader init failed');
    return;
  }

  connectVariablesToGLSL();
  initTextures();
  addActionForHtmlUI();
  document.onkeydown = keydown;
  requestAnimationFrame(tick);
}

function tick() {
  g_seconds = performance.now() / 1000.0 - g_start_time;
  updateAnimation();
  renderAllShapes();
  requestAnimationFrame(tick);
}

function updateAnimation() {
  if (g_Animation) {
    // update sheep position, etc.
  }
  if (g_lightMoveOn) {
    g_lightPos[1] = Math.cos(g_seconds) * 2 + 3;
    g_spotlightPos[1] = g_lightPos[1];
  }
}

function keydown(ev) {
  switch (ev.keyCode) {
    case 87: g_camera.forward(); break;   // W
    case 83: g_camera.backward(); break;  // S
    case 65: g_camera.left(); break;      // A
    case 68: g_camera.right(); break;     // D
    case 81: g_camera.rotLeft(); break;   // Q
    case 69: g_camera.rotRight(); break;  // E
    case 90: g_camera.upward(); break;    // Z
    case 88: g_camera.downward(); break;  // X
  }
  renderAllShapes();
}

// NOTE: The following still need to be defined for full functionality:
// - connectVariablesToGLSL()
// - initTextures()
// - addActionForHtmlUI()
// - renderAllShapes()
// All of these can reuse your existing logic from Assignment 3 or friend’s version.
