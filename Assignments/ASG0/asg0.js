// Adarsh Singh
// asing209@ucsc.edu
// 1930592
// Assignment 0: Vector Library

// DrawTriangle.js (c) 2012 matsuda
function main() {
  let canvas = document.getElementById('example');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return;
  }

  window.ctx = canvas.getContext('2d');
  clearCanvas();

  // Draw initial test vector (optional)
  let v1 = new Vector3([2.25, 2.25, 0]);
  drawVector(v1, "red");
}

function clearCanvas() {
  let ctx = window.ctx;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawVector(v, color) {
  let ctx = window.ctx;
  let centerX = ctx.canvas.width / 2;
  let centerY = ctx.canvas.height / 2;

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + v.elements[0] * 20, centerY - v.elements[1] * 20);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function handleDrawEvent() {
  let x1 = parseFloat(document.getElementById("xInput").value);
  let y1 = parseFloat(document.getElementById("yInput").value);
  let x2 = parseFloat(document.getElementById("x2Input").value);
  let y2 = parseFloat(document.getElementById("y2Input").value);

  let v1 = new Vector3([x1, y1, 0]);
  let v2 = new Vector3([x2, y2, 0]);

  clearCanvas();
  drawVector(v1, "red");
  drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
  let x1 = parseFloat(document.getElementById("xInput").value);
  let y1 = parseFloat(document.getElementById("yInput").value);
  let x2 = parseFloat(document.getElementById("x2Input").value);
  let y2 = parseFloat(document.getElementById("y2Input").value);

  let scalar = parseFloat(document.getElementById("scalarInput").value);
  let operation = document.getElementById("operationSelect").value;

  let v1 = new Vector3([x1, y1, 0]);
  let v2 = new Vector3([x2, y2, 0]);

  clearCanvas();
  drawVector(v1, "red");
  drawVector(v2, "blue");

  if (operation === "add") {
    let v3 = new Vector3([x1, y1, 0]).add(v2);
    drawVector(v3, "green");
  } else if (operation === "sub") {
    let v3 = new Vector3([x1, y1, 0]).sub(v2);
    drawVector(v3, "green");
  } else if (operation === "mul") {
    let v3 = new Vector3([x1, y1, 0]).mul(scalar);
    let v4 = new Vector3([x2, y2, 0]).mul(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  } else if (operation === "div") {
    let v3 = new Vector3([x1, y1, 0]).div(scalar);
    let v4 = new Vector3([x2, y2, 0]).div(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  } else if (operation === "magnitude") {
    console.log("Magnitude v1:", v1.magnitude());
    console.log("Magnitude v2:", v2.magnitude());
  } else if (operation === "normalize") {
    let v3 = new Vector3([x1, y1, 0]).normalize();
    let v4 = new Vector3([x2, y2, 0]).normalize();
    drawVector(v3, "green");
    drawVector(v4, "green");
  }
  else if (operation === "angle") {
    angleBetween(v1, v2);
  }
  else if (operation === "area") {
    areaTriangle(v1, v2);
  }
}

function angleBetween(v1, v2) {
  let dotProduct = Vector3.dot(v1, v2);
  let mag1 = v1.magnitude();
  let mag2 = v2.magnitude();

  if (mag1 === 0 || mag2 === 0) {
    console.log("One of the vectors is zero-length; angle is undefined.");
    return;
  }

  let cosTheta = dotProduct / (mag1 * mag2);
  let angleRad = Math.acos(Math.min(Math.max(cosTheta, -1), 1)); // Clamp due to float error
  let angleDeg = angleRad * (180 / Math.PI);
  console.log("Angle between v1 and v2:", angleDeg.toFixed(2), "degrees");
}

function areaTriangle(v1, v2) {
  let crossProduct = Vector3.cross(v1, v2);
  let area = 0.5 * crossProduct.magnitude();
  console.log("Area of the triangle:", area.toFixed(2));
}
