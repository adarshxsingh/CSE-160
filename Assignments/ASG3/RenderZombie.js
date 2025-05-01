// RenderZombie.js

class Zombie {
    constructor(x, y, z, yaw = 0, time = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.yaw = yaw; // rotation to face player
      this.time = time; // time for animation
    }
  
    render() {
      const baseX = this.x;
      const baseY = this.y;
      const baseZ = this.z;
      const scale = 0.5;
      const armSwing = Math.sin(this.time * 5) * 15; // swing angle in degrees
  
      let rotateAll = new Matrix4();
      rotateAll.setTranslate(baseX, baseY, baseZ);
      rotateAll.rotate(this.yaw, 0, 1, 0);
  
      // === Head ===
      let head = new Cube();
      head.color = [0.2, 0.8, 0.2, 1.0];
      head.textureNum = -2;
      head.matrix = new Matrix4(rotateAll);
      head.matrix.translate(0, scale * 3.0, 0);
      head.matrix.scale(scale * 0.8, scale * 0.8, scale * 0.8);
      head.drawCubeFast();
  
      // === Eyes ===
      let leftEye = new Cube();
      leftEye.color = [0, 0, 0, 1];
      leftEye.textureNum = -2;
      leftEye.matrix = new Matrix4(rotateAll);
      leftEye.matrix.translate(scale * 0.15, scale * 3.35, scale * 0.45);
      leftEye.matrix.scale(scale * 0.12, scale * 0.12, scale * 0.12);
      leftEye.drawCubeFast();
  
      let rightEye = new Cube();
      rightEye.color = [0, 0, 0, 1];
      rightEye.textureNum = -2;
      rightEye.matrix = new Matrix4(rotateAll);
      rightEye.matrix.translate(scale * 0.45, scale * 3.35, scale * 0.45);
      rightEye.matrix.scale(scale * 0.12, scale * 0.12, scale * 0.12);
      rightEye.drawCubeFast();
  
      // === Mouth ===
      let mouth = new Cube();
      mouth.color = [0.1, 0.1, 0.1, 1];
      mouth.textureNum = -2;
      mouth.matrix = new Matrix4(rotateAll);
      mouth.matrix.translate(scale * 0.28, scale * 3.05, scale * 0.5); // pull forward
      mouth.matrix.scale(scale * 0.25, scale * 0.1, scale * 0.1);
      mouth.drawCubeFast();
  
      // === Torso ===
      let torso = new Cube();
      torso.color = [0.0, 0.6, 0.8, 1.0];
      torso.textureNum = -2;
      torso.matrix = new Matrix4(rotateAll);
      torso.matrix.translate(0, scale * 1.5, 0);
      torso.matrix.scale(scale * 1.0, scale * 1.2, scale * 0.6);
      torso.drawCubeFast();
  
      // === Left Arm ===
      let leftArm = new Cube();
      leftArm.color = [0.2, 0.8, 0.2, 1.0];
      leftArm.textureNum = -2;
      leftArm.matrix = new Matrix4(rotateAll);
      leftArm.matrix.translate(-scale * 0.6, scale * 2.0, 0);
      leftArm.matrix.rotate(armSwing, 1, 0, 0);
      leftArm.matrix.scale(scale * 0.3, scale * 1.0, scale * 0.3);
      leftArm.drawCubeFast();
  
      // === Right Arm ===
      let rightArm = new Cube();
      rightArm.color = [0.2, 0.8, 0.2, 1.0];
      rightArm.textureNum = -2;
      rightArm.matrix = new Matrix4(rotateAll);
      rightArm.matrix.translate(scale * 1.3, scale * 2.0, 0);
      rightArm.matrix.rotate(-armSwing, 1, 0, 0);
      rightArm.matrix.scale(scale * 0.3, scale * 1.0, scale * 0.3);
      rightArm.drawCubeFast();
  
      // === Left Leg ===
      let leftLeg = new Cube();
      leftLeg.color = [0.2, 0.2, 0.6, 1.0];
      leftLeg.textureNum = -2;
      leftLeg.matrix = new Matrix4(rotateAll);
      leftLeg.matrix.translate(scale * 0.1, 0, 0);
      leftLeg.matrix.scale(scale * 0.3, scale * 1.0, scale * 0.3);
      leftLeg.drawCubeFast();
  
      // === Right Leg ===
      let rightLeg = new Cube();
      rightLeg.color = [0.2, 0.2, 0.6, 1.0];
      rightLeg.textureNum = -2;
      rightLeg.matrix = new Matrix4(rotateAll);
      rightLeg.matrix.translate(scale * 0.6, 0, 0);
      rightLeg.matrix.scale(scale * 0.3, scale * 1.0, scale * 0.3);
      rightLeg.drawCubeFast();
    }
  }