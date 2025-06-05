// Adarsh Singh
// asing209@ucsc.edu
// 1930592
// Assignment 4: Lighting (Medium)

// Camera.js

import { Vector3, Matrix4 } from './lib/cuon-matrix-cse160.js';


class Camera{
    constructor() {
        this.eye = new Vector3([5, 5, 12]);  // start above and behind terrain
        this.at  = new Vector3([5, 0, 5]);   // look toward center of terrain
        this.up  = new Vector3([0, 1, 0]);
    }


    forward(){
        var atCopy  = new Vector3(this.at.elements);
        var eyeCopy = new Vector3(this.eye.elements);
        var f = atCopy.sub(eyeCopy);
        f = f.normalize();
        this.eye = this.eye.add(f);
        this.at  = this.at.add(f);
    }

    backward(){
        var atCopy  = new Vector3(this.at.elements);
        var eyeCopy = new Vector3(this.eye.elements);
        var f = atCopy.sub(eyeCopy);
        f = f.normalize();
        this.at  = this.at.sub(f);
        this.eye = this.eye.sub(f);
    }

    left(){
        var atCopy  = new Vector3(this.at.elements);
        var eyeCopy = new Vector3(this.eye.elements);
        var left_move = atCopy.sub(eyeCopy);
        left_move = left_move.normalize();
        left_move = left_move.mul(-1);
        var s = Vector3.cross(left_move, this.up);
        s = s.normalize();
        this.at  = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    right(){
        var atCopy  = new Vector3(this.at.elements);
        var eyeCopy = new Vector3(this.eye.elements);
        var upCopy  = new Vector3(this.up.elements);
        var move_right = atCopy.sub(eyeCopy);
        move_right = move_right.normalize();
        var s = Vector3.cross(move_right, upCopy);
        s = s.normalize();
        this.at  = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    rotRight(){
        var atCopy  = new Vector3(this.at.elements);
        var eyeCopy = new Vector3(this.eye.elements);
        var f = atCopy.sub(eyeCopy);
        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);
        this.at = f_prime.add(this.eye);
    }

    rotLeft(){
        var atCopy  = new Vector3(this.at.elements);
        var eyeCopy = new Vector3(this.eye.elements);
        var f = atCopy.sub(eyeCopy);
        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);
        this.at = f_prime.add(this.eye);
    }
    upward(){
        this.eye.elements[1] += 1;
        this.at.elements[1]  += 1;
    }
    downward(){
        this.eye.elements[1] -= 1;
        this.at.elements[1]  -= 1;
    }

}

export { Camera };