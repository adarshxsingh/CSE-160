import * as THREE from 'three';
import { Camera } from './Camera.js';
import { Zombie } from './RenderZombie.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';



// === Canvas & Renderer ===
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(600, 600);

// === Scene ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// === Add a custom 3D model ===
const mtlLoader = new MTLLoader();
mtlLoader.setPath('models/');
mtlLoader.load('male02.mtl', (materials) => {
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('models/');
  objLoader.load('male02.obj', (object) => {
    object.position.set(0, 0, 0);
    object.scale.set(0.6, 0.6, 0.6);
    scene.add(object);
  });
});



// === Ambient Light (softens shadows) ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// === Directional Light (like sunlight) ===
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, 200, 100);
scene.add(directionalLight);

// === Point Light ===
const pointLight = new THREE.PointLight(0xffffff, 2.5, 300);
pointLight.position.set(5, 30, 5);
scene.add(pointLight);
const lightHelper = new THREE.PointLightHelper(pointLight, 2);
scene.add(lightHelper);

// === Camera ===
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

let zombieFollowEnabled = true;

const myCam = new Camera();
myCam.eye.elements = [0, 100, 150];     // Position: high and back
myCam.at.elements = [0, 0, 0];          // Looking toward center of the world

// === Mouse Scroll ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;


function updateThreeCamera() {
  const eye = myCam.eye.elements;
  const at = myCam.at.elements;
  camera.position.set(eye[0], eye[1], eye[2]);
  camera.lookAt(at[0], at[1], at[2]);
}
updateThreeCamera();

// === Textures ===
const textureLoader = new THREE.TextureLoader();
const dirtTexture = textureLoader.load('dirt.jpeg');
const grassTexture = textureLoader.load('grass.png');

// === Large Flat Ground ===
const groundSize = 300;
const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
const groundMaterial = new THREE.MeshStandardMaterial({ map: grassTexture });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);


let skyboxTexture = null;
let skyboxEnabled = true;

// === Skybox (LARGER and around everything) ===
// === Cubemap Skybox ===
const loader = new THREE.CubeTextureLoader();
loader.setPath('textures/');

skyboxTexture = loader.load([
  'posx.jpg', 'negx.jpg',
  'posy.jpg', 'negy.jpg',
  'posz.jpg', 'negz.jpg'
]);

scene.background = skyboxTexture;







// === Dirt Pile in Middle ===
const dirtPile = new THREE.Group();
const pileSize = 10;
for (let x = -1; x <= 1; x++) {
  for (let z = -1; z <= 1; z++) {
    for (let y = 0; y <= 2; y++) {
      const geo = new THREE.BoxGeometry(pileSize, pileSize, pileSize);
      const mat = new THREE.MeshStandardMaterial({ map: dirtTexture });
      const cube = new THREE.Mesh(geo, mat);
      cube.position.set(x * pileSize, y * pileSize + pileSize / 2, z * pileSize);
      dirtPile.add(cube);
    }
  }
}
dirtPile.position.set(0, 0, 0);
scene.add(dirtPile);

// === Controls ===
document.addEventListener('keydown', (event) => {
  switch (event.key.toLowerCase()) {
    case 'w': myCam.forward(); break;
    case 's': myCam.backward(); break;
    case 'a': myCam.left(); break;
    case 'd': myCam.right(); break;
    case 'q': myCam.rotLeft(); break;
    case 'e': myCam.rotRight(); break;
    case 'r': myCam.upward(); break;
    case 'f': myCam.downward(); break;
  }
  updateThreeCamera();
});

// === Zombies ===
let zombies = [];
let zombieCount = 0;

const initialZombie = new Zombie(0, 0, -5);
initialZombie.render(scene); // force render to attach body parts
zombies.push(initialZombie);
scene.add(initialZombie.group);


let zombieVisible = true;
document.getElementById('toggleZombie').addEventListener('click', () => {
  zombieVisible = !zombieVisible;
});

document.getElementById('addZombie').addEventListener('click', () => {
  const x = Math.floor(Math.random() * 50) - 25;
  const z = Math.floor(Math.random() * 50) - 25;
  const newZombie = new Zombie(x, 0, z);
  zombies.push(newZombie);
  scene.add(newZombie.group);
  zombieCount++;
});

// === 20 Primary Shapes (huge, evenly spaced with jitter) ===
const shapesGroup = new THREE.Group();
const cylinders = [];
const size = 20;
const rows = 4;
const cols = 5;
const spacing = 60;

for (let i = 0; i < 20; i++) {
  let mesh;
  const shapeType = i % 3;
  const row = Math.floor(i / cols);
  const col = i % cols;

  const jitterX = (Math.random() - 0.5) * 10;
  const jitterZ = (Math.random() - 0.5) * 10;
  const x = col * spacing - ((cols - 1) * spacing) / 2 + jitterX;
  const z = row * spacing - ((rows - 1) * spacing) / 2 + jitterZ;
  const y = size / 2;

  if (shapeType === 0) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    const material = i === 0
      ? new THREE.MeshStandardMaterial({ map: dirtTexture })
      : new THREE.MeshStandardMaterial({ color: 0x00ffcc });
    mesh = new THREE.Mesh(geometry, material);
  } else if (shapeType === 1) {
    const geometry = new THREE.SphereGeometry(size * 0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xff9955 });
    mesh = new THREE.Mesh(geometry, material);
  } else {
    const geometry = new THREE.CylinderGeometry(size * 0.4, size * 0.4, size, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x9966ff });
    mesh = new THREE.Mesh(geometry, material);
    cylinders.push(mesh);
  }

  mesh.position.set(x, y, z);
  shapesGroup.add(mesh);
}

scene.add(shapesGroup);




// === Animated Diamond with Texture and Light ===
const floatGroup = new THREE.Group();
const texturedGeometry = new THREE.OctahedronGeometry(8);  // Diamond shape
const texturedMaterial = new THREE.MeshStandardMaterial({ map: grassTexture });
const floatingObject = new THREE.Mesh(texturedGeometry, texturedMaterial);
floatingObject.position.set(0, 60, 0); // Higher Y starting point
floatGroup.add(floatingObject);

// Add glowing light at its center
const floatingLight = new THREE.PointLight(0x00ffcc, 2, 100);
floatingLight.position.set(0, 0, 0);
floatGroup.add(floatingLight);

scene.add(floatGroup);




// === Spinning Tetrahedron (Triangle Shape) ===
const triangleGroup = new THREE.Group();
const triangleGeometry = new THREE.TetrahedronGeometry(25);
const triangleMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
const triangleObject = new THREE.Mesh(triangleGeometry, triangleMaterial);
triangleObject.position.set(100, 15, -100);  // Different spot on the map
triangleGroup.add(triangleObject);
scene.add(triangleGroup);





// === Spinning Textured Cube ===
const texturedCubeGroup = new THREE.Group();
const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
const cubeMaterial = new THREE.MeshStandardMaterial({ map: grassTexture });
const texturedCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
texturedCube.position.set(-120, 40, 100); // Opposite corner from diamond/triangle
texturedCubeGroup.add(texturedCube);
scene.add(texturedCubeGroup);








// === Follow Logic ===
function followPlayer(zombie, cameraPos) {
  const zombiePos = new THREE.Vector3(zombie.x, zombie.y, zombie.z);
  const direction = new THREE.Vector3().subVectors(cameraPos, zombiePos);
  direction.y = 0;
  const angle = Math.atan2(direction.x, direction.z);
  zombie.yaw = THREE.MathUtils.radToDeg(angle);
  direction.normalize();
  zombie.x += direction.x * 0.02;
  zombie.z += direction.z * 0.02;
}





const gltfLoader = new GLTFLoader();
gltfLoader.load(
  'Adarsh_Singh-Lab4.glb', // Replace with your actual filename
  function (gltf) {
    const model = gltf.scene;
    model.position.set(-50, 40, -50);   // Place it on the map
    model.scale.set(10, 10, 10);       // Scale it up to match scene size
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error('An error occurred loading the 3D model:', error);
  }
);







// === Render Loop ===
function render(time) {
  time *= 0.001;
  //updateThreeCamera();


  // Animate floating object
  const floatY = Math.sin(time * 2) * 7 + 100;
  floatingObject.position.y = floatY;
  floatingObject.rotation.y += 0.01;




  // Animate triangle object
  triangleObject.rotation.y += 0.03;
  triangleObject.rotation.x += 0.01;


  
  // Animate spinning textured cube
  texturedCube.rotation.y += 0.06;
  texturedCube.rotation.x += 0.01;


  



  if (zombieFollowEnabled) {
    const cameraPos = new THREE.Vector3(
      myCam.eye.elements[0],
      myCam.eye.elements[1],
      myCam.eye.elements[2]
    );
    for (let z of zombies) {
      followPlayer(z, cameraPos);
    }
  }

  if (zombieVisible) {
    for (let z of zombies) {
      z.time += 0.016;
      z.render(scene);
    }
  } else {
    for (let z of zombies) {
      scene.remove(z.group);
    }
  }

  if (cylinders.length > 0) {
    cylinders[2].rotation.y += 0.05;
  }


  for (let zombie of zombies) {
    zombie.time += 0.016; // Animate arms ~60 FPS
    zombie.render(scene); // Render and update pose
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);

  controls.update();

}
requestAnimationFrame(render);

// === UI Events ===
document.getElementById('lightX').addEventListener('input', (e) => {
  pointLight.position.x = parseFloat(e.target.value);
});
document.getElementById('lightY').addEventListener('input', (e) => {
  pointLight.position.y = parseFloat(e.target.value);
});
document.getElementById('lightZ').addEventListener('input', (e) => {
  pointLight.position.z = parseFloat(e.target.value);
});

document.getElementById('toggleFollow').addEventListener('click', () => {
  zombieFollowEnabled = !zombieFollowEnabled;
});

let skyboxVisible = true;
document.getElementById('toggleSkyboxBtn').onclick = () => {
  skyboxEnabled = !skyboxEnabled;
  scene.background = skyboxEnabled ? skyboxTexture : null;
};
