// Adarsh Singh
// asing209@ucsc.edu
// 1930592
// Assignment 5: Exploring a High-Level Graphics Library (Medium)

// Camera.js

import { Vector3, Matrix4 } from './lib/cuon-matrix-cse160.js';

class Camera {
  constructor() {
    this.eye = new Vector3([5, 5, 12]); // Camera position
    this.at = new Vector3([5, 0, 5]);   // Look-at target
    this.up = new Vector3([0, 1, 0]);   // World up vector
  }

  moveForward() {
    let direction = this.at.sub(this.eye).normalize();
    this.eye = this.eye.add(direction);
    this.at = this.at.add(direction);
  }

  moveBackward() {
    let direction = this.at.sub(this.eye).normalize();
    this.eye = this.eye.sub(direction);
    this.at = this.at.sub(direction);
  }

  moveLeft() {
    let forward = this.at.sub(this.eye).normalize();
    let strafe = Vector3.cross(this.up, forward).normalize();
    this.eye = this.eye.sub(strafe);
    this.at = this.at.sub(strafe);
  }

  moveRight() {
    let forward = this.at.sub(this.eye).normalize();
    let strafe = Vector3.cross(forward, this.up).normalize();
    this.eye = this.eye.add(strafe);
    this.at = this.at.add(strafe);
  }

  rotateLeft(deg = 5) {
    this.#rotateAroundUpAxis(deg);
  }

  rotateRight(deg = 5) {
    this.#rotateAroundUpAxis(-deg);
  }

  moveUp() {
    this.eye.elements[1] += 1;
    this.at.elements[1] += 1;
  }

  moveDown() {
    this.eye.elements[1] -= 1;
    this.at.elements[1] -= 1;
  }

  // Private helper
  #rotateAroundUpAxis(degrees) {
    let direction = this.at.sub(this.eye);
    const rotMatrix = new Matrix4().setRotate(degrees, ...this.up.elements);
    const rotated = rotMatrix.multiplyVector3(direction);
    this.at = this.eye.add(rotated);
  }
}

export { Camera };