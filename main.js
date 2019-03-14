var cubeRotation = 0.0;
var num = 10;
var jump=0;
var t = 0;
var track,sky,face,center,coin,boost_coin,boost,inital_y,boostcatch=0,inside,boots1,wearboots=0,stop=0,with_train = 0;
var wall,wall1,coin,leg1,leg2,train,police_face,police_center,police_leg1,police_leg2,ini,last,duck = 0;
var obstacle,rods,over;
var keys = 0;
var towr,latest1 = -1;
var duck_hap;
var dog1,dog2;
var grayScala = false;
var flashScala = false;
var score = 0;
var arr ;
var latest=-1;
var tpre = 0;
main();


Mousetrap.bind('a',function(){
  if(face.pos[0]>-10)
  {
    face.pos[0]-=10;
    leg1.pos[0]-=10;
    leg2.pos[0]-=10;
    center.pos[0]-=10;
    dog1.pos[0]-=10;
    dog2.pos[0]-=10;


  }
})
Mousetrap.bind('d',function(){
  if(face.pos[0]<10)
  {
    face.pos[0]+=10;
    leg1.pos[0]+=10;
    leg2.pos[0]+=10;
    center.pos[0]+=10;
    dog1.pos[0]+=10;
    dog2.pos[0]+=10;
  }
})
Mousetrap.bind('g',function(){
  grayScala = !grayScala
  // console.log(grayScala);
})
Mousetrap.bind('t',function(){
    
    duck = 1;
    if(center.pos[1]==-11)
    {
      face.pos[1]-=(2.5);
      leg1.pos[1]-=(2.5);
      leg2.pos[1]-=(2.5);
      center.pos[1]-=(2.5);
      dog1.pos[1]-=0.5;
      dog2.pos[1]-=0.5;
    }
    duck_hap = face.pos[2];
  
})

Mousetrap.bind('space',function(){
  if(wearboots)
    jump=2;
  else
    jump = 1;
  t = 0;
});
function main() {


  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  var cur = -20;
  var c,x,a,y;
  track = [];
  wall = [];
  wall1 = [];
  sky = [];
  train = [];
  arr = [];
  boots = [];
  for(var i=0;i<num;i++)
  {
    c = new cube(gl, [0,-15.0,cur],'track.jpeg',5,1,80);
    track.push(c);
    c = new cube(gl, [10,-15.0,cur],'track.jpeg',5,1,80);
    track.push(c);
    c = new cube(gl, [-10,-15.0,cur],'track.jpeg',5,1,80);
    track.push(c);
    cur=cur-160;
  }
  initial_y = -9.5;
  cur = -20;
  for(var i=0;i<num;i++)
  {
    c = new cube(gl, [15,-15.0,cur],'wall.jpg',0.25,20,50);
    wall.push(c);
    cur=cur-140;
  }
  cur = -20;
  for(var i=0;i<num;i++)
  {
    c = new cube(gl, [-15,-15.0,cur],'wall.jpg',0.25,20,50);
    wall1.push(c);
    cur=cur-140;
  }
  cur = -50;
  x = 10.75;
  for(var i=0;i<num;i++)
  {
    if(i&1)
       c = new cube(gl,[-x,-9,cur],'train.jpeg',4,5,20);
    else
        c = new cube(gl,[x,-9,cur],'train.jpeg',4,5,20);
    cur -=100;
    train.push(c);

  }
  boost = [];
  face = new cube(gl,[0,-9.5,-30],'face.jpeg',1,0.5,0.075);
  center = new cube(gl,[0,-11,-30],'cloth.png',2,1,0.15);
  leg1 = new cube(gl,[-0.85,-13,-30],'face.png',0.25,1,0.15);
  leg2 = new cube(gl,[0.85,-13,-30],'face.png',0.25,1,0.15);
  police_face = new cube(gl,[0,-5.75,-20],'police_face.jpeg',1,1.25,0.075);
  police_center = new cube(gl,[0,-8.25,-20],'center.jpeg',2.5,1.75,0.15);
  police_leg1 = new cube(gl,[-1.25,-12,-20],'center.jpeg',0.65,2,0.15);
  police_leg2 = new cube(gl,[1.25,-12,-20],'center.jpeg',0.65,2,0.15);
  b = new  cube(gl,[0,-12.5,-210],'boost.jpeg',0.5,1.5,0.5);
  boost.push(b);
  b = new cube(gl,[10,-13.5,-100],'boots.jpeg',0.7,0.5,1.5);
  boots.push(b);
  b = new cube(gl,[10,-12.5,-99.8],'boots.jpeg',0.7,0.5,0.3);
  boots.push(b);
  b = new cube(gl,[-10,-13.5,-250],'boots.jpeg',0.7,0.5,1.5);
  boots.push(b);
  b = new cube(gl,[10,-12.5,-249.8],'boots.jpeg',0.7,0.5,0.3);
  boots.push(b);
  b = new  cube(gl,[10,-12.5,-340],'boost.jpeg',0.5,1.5,0.5);
  boost.push(b);
  cur = -70;
  x = 0;
  y = 2.5;
  obstacle = [];
  rods = [];
  rods1 = [];
  for(var i=0;i<6;i++)
  {
      if(i%3==0) x = 0,y = -2.5;
      else if(i%3==1) x = 10,y = 7.5;
      else if(i%3==2) x = -10,y=-12.5;
      c1 = new cube(gl,[x,-10.75,cur],'up.jpeg',3,0.25,0.1);
      c2 = new cube(gl,[y,-12.5,cur],'rod.jpg',0.5,1.5,0.1);
      c3 = new cube(gl,[y+5,-12.5,cur],'rod.jpg',0.5,1.5,0.1);
      obstacle.push(c1);
      rods.push(c2);
      rods1.push(c3);
      cur -=100;
  }
  cur = -40;
  coin = [];
  for(var i=0;i<6;i++)
  {
    z = cur;
    if(!(i%3))
    {
      for(var j=0;j<5;j++)
      {
        c = new coins(gl,[0,-11,z],100,'coin.jpeg');
        coin.push(c);
        arr.push(0);
        c = new coins(gl,[-10,-11,z],100,'coin.jpeg');
        coin.push(c);
        arr.push(0);
        c = new coins(gl,[10,-11,z],100,'coin.jpeg');
        coin.push(c);
        arr.push(0);
        z-=5;

      }
    }
    else
    {
      for(var j=0;j<5;j++)
      {
        c = new coins(gl,[0,-11,z],100,'coin.jpeg');
        coin.push(c);
        arr.push(0);
        z-=5;
      }
    }
    cur-=100;
  }
  z = -50;
  for(var j=0;j<2;j++)
  {
    if(j&1)
      x = -10;
    else
      x = 10;
    for(var i=0;i<30;i++)
    {
      c = new coins(gl,[x,11,z],100,'coin.jpeg');
      z-=10;
      coin.push(c);
    }
  }
  cur = -50;
  last = new cube(gl, [0,-5,-1000],'back1.jpeg',15,10,5);
  over = new cube(gl, [0,0,0],'over.jpeg',15,10,5);
  dog1 = new cube(gl,[4,-11.5,-20],'dog.jpeg',0.75,0.5,0.25);
  dog2 = new cube(gl,[4,-13,-20],'dog.jpeg',0.5,1,0.25);
  towr = new cube(gl,[0,-11,-130],'towr.jpeg',0.5,3,0.5);
  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;


    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uNormalMatrix;
    uniform bool flashScala;

    varying highp vec3 vLighting;
    varying highp vec2 vTextureCoord;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
      highp vec3 directionalLightColor = vec3(1,1,1);
      if(flashScala)
        directionalLightColor = vec3(10,10,10);

      highp vec3 ambientLight = vec3(0.75, 0.75, 0.75);
      highp vec3 directionalVector = normalize(vec3(0.85,0.8,0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  // Fragment shader program

  const fsSource = `
    precision mediump float;
    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform bool grayScala;
    varying highp vec3 vLighting;
    uniform bool flashScala;

    uniform float now;
    varying lowp vec4 vColor;
    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
      if(grayScala && flashScala)
      {
        float gray = dot(texelColor.rgb*vLighting,vec3(0.299,0.587,0.114));
        gl_FragColor = vec4(vec3(gray),1.0);
      }
      else if(grayScala)
      {
        float gray = dot(texelColor.rgb,vec3(0.299,0.587,0.114));
        gl_FragColor = vec4(vec3(gray),1.0);
      }
      else if(flashScala)
      {
        gl_FragColor = vec4(texelColor.rgb*vLighting,texelColor.a);
      }
      else
          gl_FragColor = texelColor;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),

    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
      grayScala : gl.getUniformLocation(shaderProgram,'grayScala'),
      flashScala: gl.getUniformLocation(shaderProgram, 'flashScala'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffers

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    // if(now%200>100 && boostcatch)
    //   boostcatch = 0;
    // console.log("FLash",flashScala);
    if(now%3>1)
      flashScala = true;
    else
      flashScala = false;
    document.getElementById("Score").innerHTML = score;
    document.getElementById("Keys").innerHTML = keys;

    gl.uniform1i(programInfo.uniformLocations.flashScala,flashScala);
    gl.uniform1i(programInfo.uniformLocations.grayScala,grayScala);
    drawScene(gl, programInfo, deltaTime);
    if(Math.abs(duck_hap-face.pos[2])>5 && duck==1)
    {
      duck =0 
      face.pos[1]+=2.5;
      leg1.pos[1]+=2.5;
      leg2.pos[1]+=2.5;
      center.pos[1]+=2.5;
      dog1.pos[1]+=0.5;
      dog2.pos[1]+=0.5;

    }
    if(face.speed1==0)
      with_train = 1;
    if(Math.abs(face.pos[2])>1000)
      stop = 1;
    // console.log(face.pos[2],stop);
    if(!stop && !with_train)
    {
     tick();
     detect();
    }


    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
function detect()
{
  var a;
  for(var i=0;i<coin.length;i++)
  {
      a = coin[i];
      if(detect_collision(a))
      {
        score+=1;
        coin.splice(i,1);
        i--;
        // console.log(i,coin.length);
      }
  }
  for(var i=0;i<boost.length;i++)
  {
     a = boost[i];
     if(detect_collision1(a))
     {
          boostcatch = 1;
          face.pos[1] +=22;
          leg1.pos[1] +=22;
          leg2.pos[1] +=22; 
          center.pos[1]+=22;
          inside = face.pos[2];
          // console.log("BOOST");
          boost.splice(i,1);
          i--;
     }
  }
  for(var i=0;i<boots.length;i+=2)
  {
      a = boots[i];
      if(detect_collision2(a))
      {
            wearboots = 1;
            ini = boots[i].pos[2];
            boots.splice(i,2);
            i-=2;
      }
  }
  for(var i=0;i<train.length;i++)
  {
      a = train[i];
      if(detect_collision_train(a) && latest1!=i)
      {
          if(keys)
          {
            keys--;
            latest1 = i;
            continue;
          }
          latest1 = i;
          with_train = 1;
      }
  }
  for(var i=0;i<obstacle.length;i++)
  {
     a = obstacle[i];
     if(duck)continue;
     if(detect_type2(a) && latest!=i)
     {
          if(keys)
          {
            latest = i;
            keys--;
            continue;
          }
          latest = i;

          face.speed1-=1;
          center.speed1-=1;
          leg1.speed1-=1;
          leg2.speed1-=1;
          dog1.speed1-=1;
          dog2.speed1-=1;
          console.log("TYPE2!!!!!");

     }
  }
  if(towr_collision() && !tpre)
  {
      keys+=1;
      tpre = 1;
  }
}
function tick()
{
  // console.log(jump);
   // console.log(face.pos[2],ini-50,wearboots);
  if(!(Math.abs(face.pos[2])<Math.abs(inside-50)) && boostcatch)
    boostcatch = 0;
  if(!(Math.abs(face.pos[2])<Math.abs(ini-50)) && wearboots)
      wearboots = 0;
  if(boostcatch)
  {
      // face.pos[1] +=0.75;
      // leg1.pos[1]  +=0.75;
      // leg2.pos[1] +=0.75; 
      // center.pos[1]+=0.75;
      face.pos[2]-=0.5;
      leg1.pos[2]  -=0.5;
      leg2.pos[2] -=0.5; 
      center.pos[2]-=0.5;
      dog1.pos[2]-=0.5;
      dog2.pos[2]-=0.5;


  }
  else
  {
    if(!jump)
    {
      face.move();
      leg1.move();
      leg2.move();
      dog1.move();
      dog2.move();

      center.move();
      if(!duck)
      {
        face.pos[1] = -9.5;
        leg1.pos[1] = -13;
        leg2.pos[1] = -13;
        center.pos[1] = -11;
        dog1.pos[1]=-11.5;
        dog2.pos[1]=-13;
      }

      t = 0;
    }
    else
    {
      t+=0.001;
      if(jump==1)
      {
        face.projectile(t);
        leg1.projectile(t);
        leg2.projectile(t);
        center.projectile(t);
        dog1.projectile(t);
        dog2.projectile(t);

      }
      else if(jump==2)
      {
        face.jump_boots(t);
        leg1.jump_boots(t);
        leg2.jump_boots(t);
        center.jump_boots(t);
        dog1.jump_boots(t);
        dog2.jump_boots(t);
      }
    // console.log(face.pos[1],initial_y);
      if(face.pos[1]<=initial_y)
        jump = 0;
      t+=0.001;
    }
  }
  if(police_face.pos[2]>-30)
  {
    police_face.pos[2]-=0.06;
    police_center.pos[2]-=0.06;
    police_leg1.pos[2]-=0.06;
    police_leg2.pos[2]-=0.06;
  }
  for(var i=0;i<num;i+=3)
  {
    train[i].pos[2]+=0.1;
  }
  // for(var i=0;i<num*3;i++)
  //   track[i].move();
  // for(var i=0;i<num;i++)
  //   wall[i].move();
}
function detect_type2(a)
{
  var l1,l2,x1,x2,z1,z2,h1,h2,y1,y2,b1,b2;
  x2 = center.pos[0];
  y2 = center.pos[1];
  z2 = center.pos[2];
  l2 = 2;
  b2 = 3.5;
  h2 = 0.15;
  l1 = 0.5;
  b1 = 3;
  h1 = 0.5;
  x1 = a.pos[0];
  y1 = a.pos[1];
  z1 = a.pos[2];
  var flag = 0;
  if(Math.abs((x1-x2)*2)<=(l1+l2) && Math.abs((z1-z2)*2)<=(h1+h2) && Math.abs((y1-y2)*2)<=(b1+b2))
    flag = 1;
  if(flag) 
  {
    if(keys)
    {
      keys = 0;
      face.pos[0] = 0;
      leg1.pos[0] = -0.85;
      leg2.pos[0] = 0.85;
      center.pos[0] = 0;

      return false;
    }
    return true;
  }
  else return false;

}
function detect_collision_train(a)
{
  var l1,l2,x1,x2,z1,z2,h1,h2,y1,y2,b1,b2;
  x2 = center.pos[0];
  y2 = center.pos[1];
  z2 = center.pos[2];
  l2 = 2;
  b2 = 3.5;
  h2 = 0.15;
  l1 = 4;
  b1 = 5;
  h1 = 20;
  x1 = a.pos[0];
  y1 = a.pos[1];
  z1 = a.pos[2];
  var flag = 0;
  if(Math.abs((x1-x2)*2)<=(l1+l2) && Math.abs((z1-z2)*2)<=(h1+h2) && Math.abs((y1-y2)*2)<=(b1+b2))
    flag = 1;
  if(flag)
  {
    if(keys) 
    {
      keys = 0;
      face.pos[0] = 0;
      leg1.pos[0] = -0.85;
      leg2.pos[0] = 0.85;
      center.pos[0] = 0;
      return false;
    }
    return true;
  }
  else return false;


}
function towr_collision()
{
   var l1,l2,x1,x2,z1,z2,h1,h2,y1,y2,b1,b2;
   x2 = leg1.pos[0];
   y2 = leg1.pos[1];
   z2 = leg1.pos[2];
   l2 = 2;
   b2 = 3.5;
   h2 = 0.15;
    l1 = 0.7;
   b1 = 0.5;
   h1 = 1.5;
   x1 = towr.pos[0];
   y1 = towr.pos[1];
   z1 = towr.pos[2];
  if(Math.abs((x1-x2)*2)<=(l1+l2) && Math.abs((z1-z2)*2)<=(h1+h2) && Math.abs((y1-y2)*2)<=(b1+b2))
    return true;
  else return false;



}
function detect_collision2(a)
{
   var l1,l2,x1,x2,z1,z2,h1,h2,y1,y2,b1,b2;
   x2 = leg1.pos[0];
   y2 = leg1.pos[1];
   z2 = leg1.pos[2];
   l2 = 2;
   b2 = 3.5;
   h2 = 0.15;
   l1 = 0.7;
   b1 = 0.5;
   h1 = 1.5;
   x1 = a.pos[0];
   y1 = a.pos[1];
   z1 = a.pos[2];
   var flag = 0;
   // console.log(x1-x2,z1-z2,y1-y2,l1+l2,h1+h2,b1+b2,x1,x2,y1,y2,z1,z2);
  if(Math.abs((x1-x2)*2)<=(l1+l2) && Math.abs((z1-z2)*2)<=(h1+h2) && Math.abs((y1-y2)*2)<=(b1+b2))
    flag = 1;
  if(flag) return true;
  else return false;

}
function detect_collision1(a)
{
  var l1,l2,x1,x2,z1,z2,h1,h2,y1,y2,b1,b2;
  x2 = center.pos[0];
  y2 = center.pos[1];
  z2 = center.pos[2];
  l2 = 2;
  b2 = 3.5;
  h2 = 0.15;
  l1 = 0.5;
  b1 = 1.5;
  h1 = 0.5;
  x1 = a.pos[0];
  y1 = a.pos[1];
  z1 = a.pos[2];
  var flag = 0;
  if(Math.abs((x1-x2)*2)<=(l1+l2) && Math.abs((z1-z2)*2)<=(h1+h2) && Math.abs((y1-y2)*2)<=(b1+b2))
    flag = 1;
  if(flag) return true;
  else return false;




}
function detect_collision(a)
{
  var l1,l2,x1,x2,z1,z2,h1,h2,y1,y2,b1,b2;
  l1 = 1;
  b1 = 1;
  h1 = 0;
  l2 = 2;
  b2 = 3.5;
  h2 = 0.15;
  x1 = a.pos[0];
  x2 = center.pos[0];
  z1 = a.pos[2];
  z2 = center.pos[2];
  y1 = a.pos[1];
  y2 = center.pos[1];
  var flag = 0;
  // console.log(x1,y1,z1,x2,y2,z2);
  if(Math.abs((x1-x2)*2)<=(l1+l2) && Math.abs((z1-z2)*2)<=(h1+h2) && Math.abs((y1-y2)*2)<=(b1+b2))
    flag = 1;
  if(flag) 
  { 
    return true;
  }
  else return false;
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, [0.0,2, 45+face.pos[2]]);
    var cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];
    // console.log(cameraMatrix[12],cameraMatrix[13],cameraMatrix[14]);
    var up = [0, 1, 0];

    mat4.lookAt(cameraMatrix, cameraPosition, [0.0,0.0,face.pos[2]], up);

    var viewMatrix = cameraMatrix;//mat4.create();

    //mat4.invert(viewMatrix, cameraMatrix);

    var viewProjectionMatrix = mat4.create();
    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
    for(var i=0;i<num*3;i++)
      track[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    for(var i=0;i<num;i++)
    {
      wall[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
      wall1[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
      // sky[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
 
    }
    for(var i=0;i<num;i++)
      train[i].drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    for(var i=0;i<6;i++)
    {
      obstacle[i].drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
      rods[i].drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
      rods1[i].drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);

    }
    for(var i=0;i<coin.length;i++)
    {
      coin[i].drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    }

    face.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    center.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    leg1.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    leg2.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    police_face.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    police_center.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    police_leg1.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    police_leg2.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    last.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    dog1.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    dog2.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    if(!tpre)
      towr.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    for(var i=0;i<boost.length;i++)
      boost[i].drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    for(var i=0;i<boots.length;i++)
    {
      boots[i].drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    }
    // console.log(with_train);
    if(with_train)
    {
      over.pos[2] = face.pos[2];
      over.drawCube(gl,viewProjectionMatrix,programInfo,deltaTime);
    }


    // wall2.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);

  //c1.drawCube(gl, projectionMatrix, programInfo, deltaTime);

}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
