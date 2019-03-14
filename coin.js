/// <reference path="webgl.d.ts" />

let coins = class {
    constructor(gl, pos,n,url) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        var ini = 0;
        var angle = 360/n;
        this.positions = [];
        var r = 0.5;
        var num = (n+50);
        var pt = 0;
        for(var i=0;i<num;i++)
        {
            this.positions.push(0,pt,0);
            // this.positions.push(0,0,0);
            this.positions.push(r*Math.cos(ini*Math.PI/180),r*Math.sin(ini*Math.PI/180),pt);
            this.positions.push(r*Math.cos((ini+angle)*Math.PI/180),r*Math.sin((ini+angle)*Math.PI/180),pt);
            this.positions.push(r*Math.cos((ini+2*angle)*Math.PI/180),r*Math.sin((ini+2*angle)*Math.PI/180),pt);
            // console.log(ini);
            ini+=angle;
        }
        // console.log("LENGTH : ");
        // console.log(this.positions.length);
        // console.log(num);
        this.number_of_sides = num;
        this.rotation = 0;

        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        var textureCoordinates = [];
        for(var i=0;i<num;i++)
        {
            textureCoordinates.push(0,0);
            textureCoordinates.push(1,0);
            textureCoordinates.push(0,1);
            textureCoordinates.push(1,1);

        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

       var indices = [];
       var num = n;
       for(var i=0;i<num;i++)
       {
            indices.push(4*i);
            indices.push(4*i+1);
            indices.push(4*i+2);

            indices.push(4*i);
            indices.push(4*i+2);
            indices.push(4*i+3);

        }
        // console.log(indices.length);
        // console.log(indices.length);  
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices), gl.STATIC_DRAW);

          this.buffer = {
            position: this.positionBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        };
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        this.time = 0;
        this.speed = 4;
        // Because images have to be download over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                      width, height, border, srcFormat, srcType,
                        pixel);

        const image = new Image();
        image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        var a,b,h,w;
        h = image.height;
        w = image.width;
        a = ((h*(h-1))==0);
        b = ((w*(w-1))==0);

        if (a && b) {
        // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } 
        else 
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        };
        image.src = url;
        this.texture = texture;
    }

    drawCube(gl, projectionMatrix, programInfo, deltaTime) {
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        
        //this.rotation += Math.Math.PI / (((Math.random()) % 100) + 50);

        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.rotation,
            [1, 1, 1]);

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
            gl.vertexAttribPointer(
                programInfo.attribLocations.textureCoord,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.textureCoord);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, this.texture);


        {
            const vertexCount = 4*(this.number_of_sides);
            // console.log(vertexCount);
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }
};