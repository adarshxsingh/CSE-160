import * as THREE from 'three';
import { Camera } from './Camera.js';
import { Zombie } from './RenderZombie.js';

// === Canvas & Renderer ===
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(600, 600);

// === Scene ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// === Bright Light ===
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

// === Skybox (LARGER and around everything) ===
const skyboxSize = 500;
const skyTexture = textureLoader.load('sky.png');
skyTexture.mapping = THREE.EquirectangularReflectionMapping;
const skyGeometry = new THREE.BoxGeometry(skyboxSize, skyboxSize, skyboxSize);
const skyMaterial = new THREE.MeshBasicMaterial({
  map: skyTexture,
  side: THREE.BackSide
});
const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skybox);


// === Dirt Pile in Middle ===
const dirtPile = new THREE.Group();
const pileSize = 5;
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

// === Render Loop ===
function render(time) {
  time *= 0.001;
  updateThreeCamera();

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

  renderer.render(scene, camera);
  requestAnimationFrame(render);
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
document.getElementById('toggleSkybox').addEventListener('click', () => {
  skyboxVisible = !skyboxVisible;
  if (skyboxVisible) {
    scene.add(skybox);
  } else {
    scene.remove(skybox);
  }
});
