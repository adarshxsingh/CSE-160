// Adarsh Singh
// asing209@ucsc.edu
// 1930592
// Assignment 4: Lighting (Medium)

// asg4.js

// Vertex shader program
var VSHADER_SOURCE =
    'precision mediump float;' +
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_UV;' +
    'attribute vec3 a_Normal;' +
    'varying vec2 v_UV;' +
    'varying vec3 v_Normal;' +
    'varying vec4 v_VertPos;' +
    'uniform mat4 u_ModelMatrix;' +
    'uniform mat4 u_GlobalRotateMatrix;' +
    'uniform mat4 u_ViewMatrix;' +
    'uniform mat4 u_ProjectionMatrix;' +
    'void main() {\n' +
    '    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;' +
    '    v_UV = a_UV;' +
    '    v_Normal = a_Normal;' +
    '    v_VertPos = u_ModelMatrix * a_Position;' +
    '}\n';

//Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec2 v_UV;' +
    'varying vec3 v_Normal;' +
    'uniform vec4 u_FragColor;\n' +
    'uniform sampler2D u_Sampler0;' +
    'uniform sampler2D u_Sampler1;' +
    'uniform sampler2D u_Sampler2;' +
    'uniform int u_whichTexture;' +
    'uniform vec3 u_lightPos;' +
    'uniform vec3 u_cameraPos;' +
    'uniform vec3 u_lightColor;' +
    'uniform int u_light;' +
    'uniform int u_lightC;' +
    'varying vec4 v_VertPos;' +
    '' +
    'uniform vec3 u_spotLightPos;' +
    '' +
    'void main() {\n' +
    '   if(u_whichTexture == -3){' +
    '       gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);\n' +
    '   } else if(u_whichTexture == -2){' +
    '       gl_FragColor = u_FragColor;' +
    '   } else if (u_whichTexture ==-1){' +
    '       gl_FragColor = vec4(v_UV,1.0,1.0);' +
    '   } else if(u_whichTexture == 0){' +
    '       gl_FragColor = texture2D(u_Sampler0, v_UV);' +
    '   } else if(u_whichTexture == 1){' +
    '       gl_FragColor = texture2D(u_Sampler1, v_UV);' +
    '   } else if(u_whichTexture == 2){' +
    '       gl_FragColor = texture2D(u_Sampler2, v_UV);' +
    '   } else{' +
    '       gl_FragColor = vec4(1,.2,.2,1);' +
    '   }' +
    '' +
    '   if (u_light==1){' +
    '' +
    '   vec3 lightVector = u_lightPos - vec3(v_VertPos);' +
    '   float r = length(lightVector);' +
    '   vec3 L = normalize(lightVector);' +
    '   vec3 N = normalize(v_Normal);' +
    '   float nDotL = max(dot(N,L), 0.0);' +
    '' +
    '   vec3 R = reflect(-L,N);' +
    '' +
    '   vec3 E = normalize(u_cameraPos - vec3(v_VertPos));' +
    '' +
    '   float specular = pow(max(dot(E,R), 0.0), 100.0);' +
    '' +
    '   vec3 diffuse = vec3(gl_FragColor) * nDotL;' +
    '   vec3 ambient = vec3(gl_FragColor) * 0.3;' +
    '   if(u_whichTexture == 0 || u_whichTexture == 1|| u_whichTexture == -2)' +
    '       specular = 0.0;' +
    '       if(u_lightC == 0){' +
    '       gl_FragColor = vec4(specular+diffuse+ambient, 1.0);' +
    '} else{' +
    '       gl_FragColor = vec4(u_lightColor*(diffuse+ambient), 1.0);' +
    '       }' +
    '   } else if (u_light == 2){' +
    '' +
    '   vec3 lightVector = u_spotLightPos - vec3(v_VertPos);' +
    '   vec3 L = normalize(lightVector);' +
    '   vec3 N = normalize(v_Normal);' +
    '   float nDotL = dot(N,L);' +
    '       float spotFactor = 1.0;' +
    '       vec3 D = -vec3(0,-1,0);' +
    '   float spotCosine = dot(D,L);' +
    '       float spotCosineCutoff = 0.98; ' +
    '       if (spotCosine >= spotCosineCutoff) { \n' +
    '            spotFactor = pow(spotCosine,2.0);\n' +
    '       } else { ' +
    '            spotFactor = 0.0;' +
    '       }' +
    '       if(dot(N,L) <=0.0){' +
    '           gl_FragColor = vec4(0.0,0.0,0.0,1.0);' +
    '      } else{' +
    '           vec3 diffuse = vec3(gl_FragColor) * nDotL;' +
    '           vec3 ambient = vec3(gl_FragColor) * 0.3;' +
    '           vec3 reflection = dot(L,N) * u_lightColor * diffuse;' +
    '           vec3 R = reflect(-L,N);' +
    '           vec3 E = normalize(u_cameraPos - vec3(v_VertPos));' +
    '           float specular = pow(max(dot(E,R), 0.0), 100.0);' +
    '           if(dot(R,E)>0.0){' +
    '               float factor = pow(dot(R,E),2.0);' +
    '               reflection += factor *specular* u_lightColor;' +
    '             }' +
    '           vec3 color = spotFactor*reflection;' +
    '           gl_FragColor = vec4(color, 1.0);' +
    '       }' +
    '' +
    '   }' +
    '}';

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix
let u_whichTexture;

let a_Normal = false;
let u_cameraPos;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_light;

let g_CalltheSheep = true;
let g_migong = false;
let g_Animation = false;
let g_set_Location = 0;
let Shift_and_Click = false;

var g_Angle = 0;
var head_animation = 0;
var g_tails_animation = 0;
var g_Angle2 = 0;

let g_BoolTailAnimation = false;
let g_globool = true;

let g_normal = false;
var g_start_time = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_start_time;
let g_camera = new Camera();

let u_spotLightPos;
let g_lightPos = [10,3,12]
let drawMap_bool = false;
let g_globalAngleY = 0;
let g_globalAngleX = 0;
let g_globalAngleZ = 0;
let g_lightColor = [1,1,1];
let g_lightMoveOn = false;
let g_spotlightPos = [10.125, g_set_Location+0.4, 7.15];

let u_lightColor;
let u_lightC;

function setupCanvas() {
  // Get canvas element
  canvas = document.getElementById('webgl');

  // Try to initialize WebGL with preserved drawing buffer
  const contextOptions = { preserveDrawingBuffer: true };
  gl = canvas.getContext('webgl', contextOptions);

  if (!gl) {
    console.error('Unable to initialize WebGL. Your browser may not support it.');
    return;
  }

  // Enable Z-depth testing and clear initial buffer
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error('Shader initialization failed.');
    return;
  }

  // === Attribute locations ===
  const attributes = {
    a_Position: 'a_Position',
    a_UV: 'a_UV',
    a_Normal: 'a_Normal'
  };

  for (let key in attributes) {
    const loc = gl.getAttribLocation(gl.program, attributes[key]);
    if (loc < 0) {
      console.error(`Failed to get location of ${attributes[key]}`);
      return;
    }
    eval(`${key} = loc`);
  }

  // === Uniform locations ===
  const uniforms = {
    u_FragColor: 'u_FragColor',
    u_ModelMatrix: 'u_ModelMatrix',
    u_GlobalRotateMatrix: 'u_GlobalRotateMatrix',
    u_ViewMatrix: 'u_ViewMatrix',
    u_ProjectionMatrix: 'u_ProjectionMatrix',
    u_Sampler0: 'u_Sampler0',
    u_Sampler1: 'u_Sampler1',
    u_Sampler2: 'u_Sampler2',
    u_whichTexture: 'u_whichTexture',
    u_lightPos: 'u_lightPos',
    u_spotLightPos: 'u_spotLightPos',
    u_cameraPos: 'u_cameraPos',
    u_lightColor: 'u_lightColor',
    u_light: 'u_light',
    u_lightC: 'u_lightC'
  };

  for (let key in uniforms) {
    const loc = gl.getUniformLocation(gl.program, uniforms[key]);
    if (!loc && loc !== 0) {
      console.error(`Failed to get location of ${uniforms[key]}`);
      return;
    }
    eval(`${key} = loc`);
  }

  // Default model matrix = identity
  const identityMatrix = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityMatrix.elements);
}

function addActionForHtmlUI() {
  const toggleFlags = {
    Animate: () => { g_Animation = !g_Animation; },
    CallTheSheep: () => { g_CalltheSheep = !g_CalltheSheep; },
    Random: () => { g_migong = !g_migong; },
    Normal_On: () => { g_normal = !g_normal; },
    Map_1: () => { drawMap_bool = !drawMap_bool; }
  };

  Object.entries(toggleFlags).forEach(([id, handler]) => {
    document.getElementById(id).onclick = handler;
  });

  const lightSliders = ['X', 'Y', 'Z'];
  lightSliders.forEach((axis, i) => {
    document.getElementById(`lightSlide${axis}`).addEventListener('mousemove', function (ev) {
      if (ev.buttons === 1) {
        g_lightPos[i] = this.value / 100;
        renderAllShapes();
      }
    });
  });

  const spotSliders = ['X', 'Y', 'Z'];
  spotSliders.forEach((axis, i) => {
    document.getElementById(`SpotlightSlide${axis}`).addEventListener('mousemove', function (ev) {
      if (ev.buttons === 1) {
        g_spotlightPos[i] = this.value / 10;
      }
    });
  });

  document.getElementById('light_animation_On').addEventListener('mousemove', () => {
    g_lightMoveOn = true;
    renderAllShapes();
  });

  document.getElementById('light_animation_Off').addEventListener('mousemove', () => {
    g_lightMoveOn = false;
    renderAllShapes();
  });

  document.getElementById('Light_On').onclick = () => {
    gl.uniform1i(u_light, 1);
  };

  document.getElementById('Light_Off').onclick = () => {
    gl.uniform1i(u_light, 0);
    gl.uniform1i(u_lightC, 0);
    g_lightColor = [1, 1, 1];
    ['Red', 'Green', 'Blue'].forEach((col, i) => {
      document.getElementById(`light${col}`).value = g_lightColor[i] * 255;
    });
  };

  document.getElementById('Spot_Light_on').onclick = () => {
    gl.uniform1i(u_light, 2);
  };

  document.getElementById('Spot_Light_off').onclick = () => {
    gl.uniform1i(u_light, 0);
    gl.uniform1i(u_lightC, 0);
    g_lightColor = [1, 1, 1];
    ['Red', 'Green', 'Blue'].forEach((col, i) => {
      document.getElementById(`light${col}`).value = g_lightColor[i] * 255;
    });
  };

  ['Red', 'Green', 'Blue'].forEach((col, i) => {
    document.getElementById(`light${col}`).addEventListener('mousemove', function (ev) {
      if (ev.buttons === 1) {
        gl.uniform1i(u_lightC, 1);
        g_lightColor[i] = this.value / 100;
      }
    });
  });
}



function initTextures() {
    // image 0 (minecraft dirt)
    var image0 = new Image();
    if (!image0) {
        console.log('Failed to create the image0 object');
        return false;
    }
    image0.onload = function () {
        sendTextureToTEXTURE0(image0);
    };
    if (g_globool === true) {
        image0.src = 'dirt.jpeg';
    }
    // image 1 (minecraft sky)
    var image1 = new Image();
    if (!image1) {
        console.log('Failed to create the image1 object');
        return false;
    }
    image1.onload = function () {
        sendTextureToTEXTURE1(image1);
    };
    if (g_globool === true) {
        image1.src = 'sky.png';
    }
    //image 2 (minecraft grass)
    var image2 = new Image();
    if (!image2) {
        console.log('Failed to create the image2 object');
        return false;
    }
    image2.onload = function () {
        sendTextureToTEXTURE2(image2);
    };
    if (g_globool === true) {
        image2.src = 'grass.png';
    }
}

function sendTextureToTEXTURE0(image) {
  const tex0 = gl.createTexture();
  if (!tex0) {
    console.error('Texture creation for TEXTURE0 failed.');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex0);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler0, 0);

  console.log('[Texture0] sky.png uploaded successfully');
}

function sendTextureToTEXTURE1(image) {
  const tex1 = gl.createTexture();
  if (!tex1) {
    console.error('TEXTURE1 creation failed.');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, tex1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    image
  );
  gl.uniform1i(u_Sampler1, 1);

  console.log('[Texture1] grass.png uploaded successfully');
}

function sendTextureToTEXTURE2(image) {
  const tex2 = gl.createTexture();
  if (!tex2) {
    console.error('Failed to initialize texture unit 2 (TEXTURE2).');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, tex2);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    image
  );
  gl.uniform1i(u_Sampler2, 2);

  console.log('[Texture2] dirt.jpeg successfully uploaded');
}

function main() {
  // Step 1: Initialize canvas and WebGL context
  setupCanvas();

  // Step 2: Link JS variables to shader variables
  connectVariablesToGLSL();

  // Step 3: Set up user interaction and UI events
  addActionForHtmlUI();

  // Step 4: Load texture images
  initTextures();

  // Step 5: Configure keyboard controls
  document.onkeydown = keydown;

  // Step 6: Set clear color for background
  gl.clearColor(0, 0, 0, 1);

  // Step 7: Mouse drag interaction
  const dragRotation = [g_globalAngleX, g_globalAngleY];
  initEventHandlers(canvas, dragRotation);

  // Step 8: Begin animation/render loop
  requestAnimationFrame(tick);
}

function tick() {
  // Update time-dependent variables
  const now = performance.now() / 1000;
  g_seconds = now - g_start_time;

  // Advance animations and redraw the scene
  updateAnimation();
  renderAllShapes();

  // Request the next frame
  requestAnimationFrame(tick);
}

function updateAnimation() {
  // Animate sheep movement and body parts if enabled
  if (g_Animation) {
    g_set_Location = Math.sin(g_seconds * 3) / 30 - 0.3;
    g_Angle = 10 * Math.sin(g_seconds);
    head_animation = 12 * Math.sin(g_seconds);
    g_Angle2 = 3 * Math.sin(g_seconds);
  }

  // Tail wagging logic
  if (g_BoolTailAnimation) {
    g_tails_animation = 5 * Math.sin(g_seconds);
  }

  // Animate light source vertically
  if (g_lightMoveOn) {
    const yOscillation = Math.cos(g_seconds) * 2;
    g_lightPos[1] = yOscillation;
    g_spotlightPos[1] = yOscillation;
  }
}


function keydown(ev) {
  const keyMap = {
    87: () => g_camera.forward(),   // W
    83: () => g_camera.backward(),  // S
    65: () => g_camera.left(),      // A
    68: () => g_camera.right(),     // D
    81: () => g_camera.rotLeft(),   // Q
    69: () => g_camera.rotRight(),  // E
    90: () => g_camera.upward(),    // Z
    88: () => g_camera.downward()   // X
  };

  if (keyMap[ev.keyCode]) {
    keyMap[ev.keyCode]();
    renderAllShapes();
  }
}


function renderAllShapes() {
  const startTime = performance.now();

  // === Setup Camera Projection ===
  const projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width / canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  const viewMat = new Matrix4();
  viewMat.setLookAt(
    ...g_camera.eye.elements,
    ...g_camera.at.elements,
    ...g_camera.up.elements
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  const globalRotMat = new Matrix4()
    .rotate(g_globalAngleX, 1, 0, 0)
    .rotate(g_globalAngleY, 0, 1, 0)
    .rotate(g_globalAngleZ, 0, 0, 1);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // === Clear Canvas ===
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // === Lighting Uniforms ===
  gl.uniform3fv(u_lightPos, g_lightPos);
  gl.uniform3fv(u_spotLightPos, g_spotlightPos);
  gl.uniform3fv(u_lightColor, g_lightColor);
  gl.uniform3fv(u_cameraPos, g_camera.eye.elements);

  // === Draw Floor ===
  const floor = new Cube();
  floor.textureNum = g_normal ? -3 : 2;
  floor.matrix.translate(0, -0.75, 0);
  floor.matrix.scale(20, 0.01, 20);
  floor.matrix.translate(0, -0.5, 0);
  floor.drawCubeFast();

  // === Draw Light Cube ===
  const lightCube = new Cube();
  lightCube.color = [2, 2, 0, 1];
  lightCube.textureNum = g_normal ? -3 : -2;
  lightCube.matrix.translate(...g_lightPos);
  lightCube.matrix.scale(-0.1, -0.1, -0.1);
  lightCube.matrix.translate(-0.5, -0.5, -0.5);
  lightCube.drawCubeFast();

  // === Draw Scene Objects ===
  drawSetting();

  if (!g_CalltheSheep) {
    drawthesheep();
  }

  if (g_migong) {
    draw_migong();
  } else if (drawMap_bool) {
    drawMap();
  }

  // === Performance Stats ===
  const duration = performance.now() - startTime;
  const fpsText = `ms: ${Math.floor(duration)} fps: ${Math.floor(10000 / duration) / 10}`;
  SendTextToHTML(fpsText, "fps");
}

function SendTextToHTML(text, elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = text;
  } else {
    console.warn(`Element with ID "${elementId}" not found.`);
  }
}

function drawSetting() {
  // === Sky Cube ===
  const skybox = new Cube();
  skybox.textureNum = g_normal ? -3 : 1;
  skybox.matrix.translate(0, 0, 0);
  skybox.matrix.scale(20, 20, 20);
  skybox.matrix.translate(0, -0.5, 0);
  skybox.drawCubeFast();

  // === Decorative Sphere ===
  const redSphere = new Sphere();
  redSphere.color = [1, 0, 0, 1];         // red
  redSphere.textureNum = -2;             // force flat color
  redSphere.matrix.translate(12, 1, 12);
  redSphere.render();
}


let g_map = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 6, 6, 6, 6, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0, 4, 4, 4, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 6, 4, 4, 6, 4, 0, 2, 0, 0, 2, 0, 0, 0, 0, 4, 6, 6, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 6, 4, 4, 6, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0, 4, 6, 6, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 6, 6, 6, 6, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0, 4, 4, 4, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 4,4, 4, 4, 4, 4, 4, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0,4,0, 4,0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 2, 0, 0, 0, 0, 0, 0, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
]

function drawMap() {
  const tileSize = 1;

  for (let row = 0; row < g_map.length; row++) {
    for (let col = 0; col < g_map[row].length; col++) {
      const tileType = g_map[row][col];

      if (tileType === 0) continue; // skip empty space

      const block = new Cube();

      // Choose texture based on tile type
      if (g_normal) {
        block.textureNum = -3; // normal shading
      } else {
        block.textureNum = (tileType === 2) ? 0 : 1; // dirt or grass, for example
      }

      block.matrix.translate(col * tileSize - 16, -0.75, row * tileSize - 16);
      block.drawCubeFast();
    }
  }
}

let g_migongmap = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 6, 6, 6, 6, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0, 4, 4, 4, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 6, 4, 4, 6, 4, 0, 2, 0, 0, 2, 0, 0, 0, 0, 4, 6, 6, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 6, 4, 4, 6, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0, 4, 6, 6, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 4, 6, 6, 6, 6, 4, 0, 0, 0, 0, 2, 0, 0, 0, 0, 4, 4, 4, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 4,4, 4, 4, 4, 4, 4, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0,4,0, 4,0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 2, 0, 0, 0, 0, 0, 0, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
]

function draw_migong() {
  const offset = 4;

  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 32; y++) {
      const height = g_migongmap[x][y];

      for (let z = 0; z < height; z++) {
        const block = new Cube();

        // Texture / color selection based on height value
        if (g_normal) {
          block.textureNum = -3;
        } else if (height === 0) {
          block.textureNum = 0;
        } else if (height === 2) {
          block.textureNum = 2;
        } else if (height > 2 && height < 7) {
          block.textureNum = 0;
        } else if (height >= 7) {
          block.textureNum = -2;
          block.color = [1, 1, 1, 1];
        }

        block.matrix.translate(y - offset, z - 0.75, x - offset);
        block.drawCubeFast();
      }
    }
  }
}

function initEventHandlers(canvas, currentAngle) {
  let isDragging = false;
  let lastX = -1, lastY = -1;

  canvas.onmousedown = (e) => {
    const { clientX: x, clientY: y } = e;
    const rect = canvas.getBoundingClientRect();

    if (x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom) {
      isDragging = true;
      lastX = x;
      lastY = y;
    }
  };

  canvas.onmouseup = () => {
    isDragging = false;
  };

  canvas.onmousemove = (e) => {
    if (!isDragging) return;

    const x = e.clientX;
    const y = e.clientY;
    const scale = 100 / canvas.height;

    const dx = scale * (x - lastX);
    const dy = scale * (y - lastY);

    currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90), -90); // limit tilt
    currentAngle[1] += dx;

    g_globalAngleX = -currentAngle[0];
    g_globalAngleY = -currentAngle[1];

    lastX = x;
    lastY = y;
  };
}
