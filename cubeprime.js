/// <reference path="webgl.d.ts" />

let cube = class {
    constructor(gl, pos,url,len,bre,ht) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        var positions = [
             // Front face
             -1.0, -1.0, 1.0,
             1.0, -1.0, 1.0,
             1.0, 1.0, 1.0,
             -1.0, 1.0, 1.0,
             //Back Face
             -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, 1.0, -1.0,
             -1.0, 1.0, -1.0,
             //Top Face
             -1.0, 1.0, -1.0,
             1.0, 1.0, -1.0,
             1.0, 1.0, 1.0,
             -1.0, 1.0, 1.0,
             //Bottom Face
             -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0, 1.0,
             -1.0, -1.0, 1.0,
             //Left Face
             -1.0, -1.0, -1.0,
             -1.0, 1.0, -1.0,
             -1.0, 1.0, 1.0,
             -1.0, -1.0, 1.0,
             //Right Face
             1.0, -1.0, -1.0,
             1.0, 1.0, -1.0,
             1.0, 1.0, 1.0,
             1.0, -1.0, 1.0,
        ];
        for(var i=0;i<72;i++)
        {
            if(i%3==0)
                positions[i] *=len;
            else if(i%3==1)
                positions[i]*=bre;
            else
                positions[i]*=ht; 
        }
        this.rotation = 0;

        this.pos = pos;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

        const textureCoordinates = [
            // Front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Back
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
          ];

          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),gl.STATIC_DRAW);

          // Build the element array buffer; this specifies the indices
          // into the vertex arrays for each face's vertices.

          const indexBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

          // This array defines each face as two triangles, using the
          // indices into the vertex array to specify each triangle's
          // position.

          const indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
          ];

          // Now send the element array to GL

          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices), gl.STATIC_DRAW);

          this.buffer = {
            position: positionBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        };
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        this.time = 0;
        this.speed = 1;
        this.speed1 = 2;
        this.speed2 = 1.75;
        this.sy = 1;
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
    drawCube(gl, projectionMatrix, programInfo,deltaTime) {
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        
        //this.rotation += Math.PI / (((Math.random()) % 100) + 50);

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

        
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);


        {
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }
    move()
    {
       this.pos[2] -=(this.speed1)*(this.time);
       console.log(this.speed1);
       this.time = 0.4;
    }
    projectile(t)
    {
        this.pos[2]-=(this.speed)*(t);
        this.pos[1]+=(this.speed)*t-5*t*t;
        this.sy = this.speed-10*t;
        // console.log(this.pos[1],this.sy,"PROJ");
    }
    // projectile1(t)
    // {
    //     this.pos[2]-=(0.5)*(t);
    //     this.pos[1]+=(0.5)*t-5*t*t;
    //     this.sy = this.speed-10*t;
    //     this.time = 0.09;
    //     // console.log(this.pos[1],this.sy,"PROJ");
    // }

    jump_boots(t)
    {
        this.pos[2]-=(this.speed2)*(t);
        this.pos[1]+=(this.speed2)*t-5*t*t;
        this.sy = this.speed-10*t;
    }

};