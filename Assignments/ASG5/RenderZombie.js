// Adarsh Singh
// asing209@ucsc.edu
// 1930592
// Assignment 5: Exploring a High-Level Graphics Library (Medium)

import * as THREE from 'three';

class Zombie {
  constructor(x, y, z, yaw = 0, time = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.yaw = yaw;
    this.time = time;

    this.group = new THREE.Group(); // Root group for the whole zombie

    this.initZombie(); // Build zombie parts
  }

  initZombie() {
    const scale = 0.5;

    const green = new THREE.MeshBasicMaterial({ color: 0x33cc33 });
    const blue = new THREE.MeshBasicMaterial({ color: 0x4444aa });
    const black = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const gray = new THREE.MeshBasicMaterial({ color: 0x222222 });

    // HEAD
    const head = new THREE.Mesh(
      new THREE.BoxGeometry(scale * 0.8, scale * 0.8, scale * 0.8),
      green
    );
    head.position.set(scale * 0.4, scale * 3.4, 0);
    this.group.add(head);

    // EYES
    const leftEye = new THREE.Mesh(
      new THREE.BoxGeometry(scale * 0.12, scale * 0.12, scale * 0.12),
      black
    );
    leftEye.position.set(scale * 0.25, scale * 3.65, scale * 0.4);
    this.group.add(leftEye);

    const rightEye = new THREE.Mesh(
      new THREE.BoxGeometry(scale * 0.12, scale * 0.12, scale * 0.12),
      black
    );
    rightEye.position.set(scale * 0.55, scale * 3.65, scale * 0.4);
    this.group.add(rightEye);

    // MOUTH
    const mouth = new THREE.Mesh(
      new THREE.BoxGeometry(scale * 0.25, scale * 0.1, scale * 0.1),
      gray
    );
    mouth.position.set(scale * 0.4, scale * 3.4, scale * 0.45);
    this.group.add(mouth);

    // TORSO
    const torso = new THREE.Mesh(
      new THREE.BoxGeometry(scale * 1.0, scale * 1.2, scale * 0.6),
      new THREE.MeshBasicMaterial({ color: 0x0099cc })
    );
    torso.position.set(scale * 0.5, scale * 2.1, 0);
    this.group.add(torso);

    // ARMS (swing later)
    this.leftArm = new THREE.Mesh(
      new THREE.BoxGeometry(scale * 0.3, scale * 1.0, scale * 0.3),
      green
    );
    this.leftArm.position.set(-scale * 0.1, scale * 2.6, 0);
    this.group.add(this.leftArm);

    this.rightArm = new THREE.Mesh(
      new THREE.BoxGeometry(scale * 0.3, scale * 1.0, scale * 0.3),
      green
    );
    this.rightArm.position.set(scale * 1.1, scale * 2.6, 0);
    this.group.add(this.rightArm);

    // LEGS
    const leftLeg = new THREE.Mesh(
      new THREE.BoxGeometry(scale * 0.3, scale * 1.0, scale * 0.3),
      blue
    );
    leftLeg.position.set(scale * 0.3, scale * 0.5, 0);
    this.group.add(leftLeg);

    const rightLeg = new THREE.Mesh(
      new THREE.BoxGeometry(scale * 0.3, scale * 1.0, scale * 0.3),
      blue
    );
    rightLeg.position.set(scale * 0.7, scale * 0.5, 0);
    this.group.add(rightLeg);
  }

  render(scene) {
    // Clear old rotation
    this.group.rotation.set(0, 0, 0);

    // Apply overall position + yaw
    this.group.position.set(this.x, this.y, this.z);
    this.group.rotation.y = THREE.MathUtils.degToRad(this.yaw);

    // Animate arms
    const armSwingAngle = Math.sin(this.time * 5) * 0.5; // radians
    this.leftArm.rotation.x = armSwingAngle;
    this.rightArm.rotation.x = -armSwingAngle;

    // Add to scene (if not already)
    if (!scene.children.includes(this.group)) {
      scene.add(this.group);
    }
  }
}

export { Zombie };
