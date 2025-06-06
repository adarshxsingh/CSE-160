// Adarsh Singh
// asing209@ucsc.edu
// 1930592
// Assignment 4: Lighting (Medium)

// Point.js

class Point{
    constructor(){
        this.type='point';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.outline = 0;
    }


    render() {
            var xy = this.position;
            var rgba = this.color;
            var size = this.size;

            //pass the position of a point to a_position variable
            gl.disableVertexAttribArray(a_Position);
            //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([xy[0],xy[1]]),gl.DYNAMIC_DRAW);
            gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
            //pass the color of a point of u_FragColor variable
            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
            //pass the color of a point to u_FragColor variable
            gl.uniform1f(u_Size, size);
            //draw
            gl.drawArrays(gl.POINTS, 0, 1);
            //drawTriangle([xy[0],xy[1],xy[0]+0.1,xy[1],xy[0],xy[1]+0.1]);
    };
}