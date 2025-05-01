// Adarsh Singh
// asing209@ucsc.edu
// 1930592
// Assignment 3: Creating a Virtual World (Hard)

// asg3.js
 
// Vertex shader program
var VSHADER_SOURCE = `
   precision mediump float;
   attribute vec4 a_Position;
   attribute vec2 a_UV;
   varying vec2 v_UV;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   uniform mat4 u_ViewMatrix;
   uniform mat4 u_ProjectionMatrix;
   void main() {
      gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
      v_UV = a_UV;
   }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform sampler2D u_Sampler3;
    uniform int u_whichTexture;
    void main() {
       if(u_whichTexture == -2){
           gl_FragColor = u_FragColor; }
       else if(u_whichTexture == -1){
           gl_FragColor = vec4(v_UV, 1.0, 1.0); }
    
       else if(u_whichTexture == 0){
           gl_FragColor = texture2D(u_Sampler0, v_UV);}

       else if(u_whichTexture == 1){
           gl_FragColor = texture2D(u_Sampler1, v_UV); }

       else if(u_whichTexture == 2){
           gl_FragColor = texture2D(u_Sampler2, v_UV); }
       else if(u_whichTexture == 3){
           gl_FragColor = texture2D(u_Sampler3, v_UV); }
       else { 
            gl_FragColor = vec4(1, .2, .2, 1);
       }
    }
   
    `

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

let u_Sampler0;
let u_Sampler1;
let u_Sampler2;

let g_CalltheSheep = false;
let g_migong = false;
let g_Animation = false;
let g_set_Location = 0;
let Shift_and_Click = false;

var g_vertexBufferCube = null;
var g_Angle = 0;
var head_animation = 0;
var g_tails_animation = 0;
var g_Angle2 = 0;

let g_BoolTailAnimation = false;
let g_globool = true;

let g_globalAngleX = 0;
let g_globalAngleY = 0;
let g_globalAngleZ = 0;

var g_start_time = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_start_time;
let g_camera = new Camera();

// Player head rotation with mouse
let g_yaw = -90;   // horizontal angle in degrees
let g_pitch = 0;   // vertical angle in degrees

//Map Changer
let g_useTerrain = false;

function setupCanvas() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true}); // gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }

    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // get the storage location of u_Sample0
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_sampler0');
        return false;
    }

    // get the storage location of u_Sampler1
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_sampler1');
        return;
    }

    // get the storage location of u_Sampler1
    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
        console.log('Failed to get the storage location of u_sampler2');
        return;
    }

    // get the storage location of u_Sampler
    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_sampler3');
        return;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}



function initTextures() {
    // image 0
    var image0 = new Image();
    if (!image0) {
        console.log('Failed to create the image0 object');
        return false;
    }


    image0.onload = function () {
        sendTextureToTEXTURE0(image0);
    };

    if (g_globool === true) {
        image0.src = 'tu.jpeg';
    }

    // image 1
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

    //image 2
    var image2 = new Image();
    if (!image2) {
        console.log('Failed to create the image2 object');
        return false;
    }

    image2.onload = function () {
        sendTextureToTEXTURE2(image2);
    };
    if (g_globool === true) {
        image2.src = 'cao.png';
    }

}

function sendTextureToTEXTURE0(image) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture0 object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler0, 0);

    console.log("successfully render the sky.jpg")


}

function sendTextureToTEXTURE1(image) {
    var texture = gl.createTexture();
    if (!texture) {
        console.log('Failed to create the texture1 object');
        return false;
    }


    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl.TEXTURE1);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler1, 1);

    console.log("successfully render the Grass.png")
}

function sendTextureToTEXTURE2(image) {
    var texture = gl.createTexture();

    if (!texture) {
        console.log('Failed to create the texture2 object');
        return false;
    }


    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    gl.activeTexture(gl.TEXTURE2);

    gl.bindTexture(gl.TEXTURE_2D, texture);


    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler2, 2);

    console.log("successfully render the soil.jpg")
}

function main() {
    setupCanvas();
    connectVariablesToGLSL();
    initTextures();
    document.onkeydown = keydown;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    var currentAngle = [g_globalAngleX, g_globalAngleY];
    initEventHandlers(canvas);
    document.getElementById("spawnSheepButton").onclick = function () {
      g_CalltheSheep = !g_CalltheSheep;
  
      const btn = document.getElementById("spawnSheepButton");
      btn.innerText = g_CalltheSheep ? "Despawn Sheep" : "Summon Sheep";
  
      renderAllShapes();
   };

    document.getElementById("terrainToggleButton").onclick = function () {
      g_useTerrain = !g_useTerrain;
      renderAllShapes();
   };
  
  
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
        g_set_Location = ((Math.sin(g_seconds * 3)) / 30) - (.3);
        g_Angle = 10 * Math.sin(g_seconds);
        head_animation = 12 * Math.sin(g_seconds);
        g_Angle2 = 3 * Math.sin(g_seconds);
    }
    if (g_BoolTailAnimation) {
        g_tails_animation = 5 * Math.sin(g_seconds);
    }
}

function keydown(ev) {
   ev.preventDefault(); // 🔒 Prevents browser scrolling

   switch (ev.keyCode) {
       case 87: // W
       case 38: // Up Arrow
           g_camera.forward();
           break;
       case 83: // S
       case 40: // Down Arrow
           g_camera.backward();
           break;
       case 65: // A
       case 37: // Left Arrow
           g_camera.left();
           break;
       case 68: // D
       case 39: // Right Arrow
           g_camera.right();
           break;
       case 69: // E
           g_camera.rotRight();
           break;
       case 81: // Q
           g_camera.rotLeft();
           break;
       case 90: // Z
           g_camera.upward();
           break;
       case 88: // X
           g_camera.downward();
           break;
           case 70: // F = add block
           tryPlaceBlock();
           break;
       case 71: // G = delete block
           tryRemoveBlock();
           break;       
   }

   renderAllShapes();
}


function renderAllShapes() {
    var startTime = performance.now();

    // Pass the project matrix
    var projMat = new Matrix4();
    projMat.setPerspective(60, canvas.width / canvas.height, .1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    // Pass the view matrix
    var viewMat = new Matrix4();
    viewMat.setLookAt(
        g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
        g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
        g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    // Pass the global rotate matrix
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, new Matrix4().elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var duration = performance.now() - startTime;
    SendTextToHTML(" ms:" + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "fps");

    // ------------------ BEGIN RENDERING CUBES ------------------

    drawSetting();
    if (g_migong) {
        draw_migong();
    } else {
        drawMap();
    }
    if (g_CalltheSheep) {
        drawthesheep()
    }
    if (!g_useTerrain) {
      // draw flat floor
      drawMap();
    } else {
      drawTerrain(); // ✅ draw voxel terrain
    }
    
}

function SendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    htmlElm.innerHTML = text;
}

function drawSetting() {
   if (!g_useTerrain) {
       // Flat green floor
       let floor = new Cube();
       floor.textureNum = 2; // grass
       floor.matrix.translate(-16, -0.76, -16);
       floor.matrix.scale(32, 0.01, 32);
       floor.drawCubeFast();
   } else {
       // Terrain mode (bumpy ground using 1x1 textured cubes)
       for (let x = 0; x < 32; x++) {
           for (let z = 0; z < 32; z++) {
               let cube = new Cube();
               cube.textureNum = 2;
               let height = 0.1 * Math.sin((x + z) * 0.5); // small undulating terrain
               cube.matrix.translate(x - 16, -0.8 + height, z - 16);
               cube.matrix.scale(1, 0.1 + height, 1);
               cube.drawCubeFast();
           }
       }
   }

   // Always draw sky
   let sky = new Cube();
   sky.textureNum = 1;
   sky.matrix.translate(-16, -16, -16);
   sky.matrix.scale(64, 64, 64);
   sky.drawCubeFast();
}



//MAP LAYOUT
let g_map = [];

for (let i = 0; i < 32; i++) {
    let row = [];
    for (let j = 0; j < 32; j++) {
        let rand = Math.random();

        // Only ~20% chance of wall, rest is empty ground
        if (rand < 0.1) {
            row.push(1); // 1 cube high wall
        } else if (rand < 0.2) {
            row.push(2); // 2 cube high wall
        } else {
            row.push(0); // empty tile
        }
    }
    g_map.push(row);
}

//Terrain Map
let terrainMap = [];

for (let i = 0; i < 32; i++) {
  let row = [];
  for (let j = 0; j < 32; j++) {
    let h = Math.floor(2 * Math.abs(Math.sin(i * 0.3 + j * 0.2))); // height: 0–2
    row.push(h);
  }
  terrainMap.push(row);
}

function drawTerrain() {
   for (let x = 0; x < 32; x++) {
     for (let z = 0; z < 32; z++) {
       let height = terrainMap[x][z];
       for (let h = 0; h < height; h++) {
         let cube = new Cube();
         cube.textureNum = 2; // green
         cube.matrix.translate(z - 16, h - 0.75, x - 16);
         cube.drawCubeFast();
       }
     }
   }
 }
 

function drawMap() {
   for (let x = 0; x < 32; x++) {
       for (let y = 0; y < 32; y++) {
           let height = g_map[x][y];

           for (let h = 0; h < height; h++) {
               let cube = new Cube();
               //The Cube Color:
               cube.textureNum = 0; // dirt wall texture
               cube.matrix.translate(y - 16, h - 0.75, x - 16); // placed at ground level
               cube.drawCubeFast();
           }
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
    for (x = 0; x < 32; x++) {
        for (y = 0; y < 32; y++) {
            for (z = 0; z < g_migongmap[x][y]; z++) {
                var cube_rendering = new Cube();
                if (g_migongmap[x][y] === 0) {
                    cube_rendering.textureNum = 0;
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                } else if (g_migongmap[x][y] === 2) {
                    cube_rendering.textureNum = 2;
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                } else if (g_migongmap[x][y] > 2 && g_migongmap[x][y] < 7) {
                    cube_rendering.textureNum = 0;
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                } else if (g_migongmap[x][y] >= 7) {
                    cube_rendering.color = [1, 1, 1, 1];
                    cube_rendering.matrix.translate(y - 4, z - 0.75, x - 4);
                    cube_rendering.drawCubeFast();
                }
            }
        }
    }
}


function initEventHandlers(canvas) {
   let isDragging = false;
   let lastX = -1, lastY = -1;

   canvas.addEventListener('mousedown', (ev) => {
       isDragging = true;
       lastX = ev.clientX;
       lastY = ev.clientY;
   });

   canvas.addEventListener('mouseup', () => {
       isDragging = false;
   });

   canvas.addEventListener('mousemove', (ev) => {
       if (!isDragging) return;

       let dx = ev.clientX - lastX;
       let dy = ev.clientY - lastY;

       lastX = ev.clientX;
       lastY = ev.clientY;

       const sensitivity = 0.2; // adjust to your liking

       g_yaw += dx * sensitivity;
       g_pitch -= dy * sensitivity;

       // Clamp pitch to avoid flipping over
       g_pitch = Math.max(-89, Math.min(89, g_pitch));

       // Convert yaw/pitch to directional vector
       const radYaw = g_yaw * Math.PI / 180;
       const radPitch = g_pitch * Math.PI / 180;

       const dirX = Math.cos(radPitch) * Math.cos(radYaw);
       const dirY = Math.sin(radPitch);
       const dirZ = Math.cos(radPitch) * Math.sin(radYaw);

       const eye = g_camera.eye;
       g_camera.at = new Vector3([
           eye.elements[0] + dirX,
           eye.elements[1] + dirY,
           eye.elements[2] + dirZ
       ]);

       renderAllShapes();
   });
}

function tryPlaceBlock() {
   const dir = g_camera.at.sub(g_camera.eye).normalize();
   const targetX = g_camera.eye.elements[0] + dir.elements[0];
   const targetZ = g_camera.eye.elements[2] + dir.elements[2];

   const col = Math.floor(targetX + 16);
   const row = Math.floor(targetZ + 16);

   if (row >= 0 && row < 32 && col >= 0 && col < 32 && g_map[row][col] < 4) {
       g_map[row][col] += 1;
   }

   renderAllShapes();
}

function tryRemoveBlock() {
   const dir = g_camera.at.sub(g_camera.eye).normalize();
   const targetX = g_camera.eye.elements[0] + dir.elements[0];
   const targetZ = g_camera.eye.elements[2] + dir.elements[2];

   const col = Math.floor(targetX + 16);
   const row = Math.floor(targetZ + 16);

   if (row >= 0 && row < 32 && col >= 0 && col < 32 && g_map[row][col] > 0) {
       g_map[row][col] -= 1;
   }

   renderAllShapes();
}

