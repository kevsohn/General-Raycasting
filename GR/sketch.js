// Setup function is called once
// Global parameters
let walls = [];
let beam;
let src;
let numBeams = 100;
let FOV = 60;
let phi = 0;
let ball;
let res = 30;
let ballmoving = false;
let sourcemoving = false;
let angleLarger = false;
let angleSmaller = false;
let rotateRight = false;
let rotateLeft = false;

function setup() {
  // Create the canvas
  canvas_h = windowHeight*.8;
  canvas_w = windowWidth*.8;
  canvas = createCanvas(canvas_w, canvas_h);
  let canvas_div = document.getElementById("sketch-div");
  canvas_div.style.width = `${canvas_w}px`;
  canvas_div.style.height = `${canvas_h}px`;

  util_div = document.getElementById("util-container");
  util_div.style.height = `${canvas_h}px`;

  canvas.parent('sketch-div');

  slider = document.getElementById("mass");
  output = document.getElementById("mass-output");
  output.innerHTML = `Mass : ${slider.value}`; // Display the default slider value
  slider.oninput = function() {
    output.innerHTML = `Mass : ${this.value}`;
  }

  slider2 = document.getElementById("radius");
  output2 = document.getElementById("radius-output");
  output2.innerHTML = `Radius : ${slider2.value}`; // Display the default slider value
  slider2.oninput = function() {
    output2.innerHTML = `Radius :${this.value}`;
  }

  slider3 = document.getElementById("density");
  output3 = document.getElementById("density-output");
  output3.innerHTML = `Density : ${slider3.value}`; // Display the default slider value
  slider3.oninput = function() {
    output3.innerHTML = `Density : ${this.value}`;
  }

  src = new Source(width/4, height/2, numBeams);
  ball = new MassiveBall(100, 200, slider.value*400, slider2.value*2);

  for (let i=0; i<4; i++) {
    const x1 = random(width/2);
    const x2 = random(width/2);
    const y1 = random(height);
    const y2 = random(height);
    walls[i] = new Boundary(x1, y1, x2, y2);
  }
  walls.push(new Boundary(0, 0, width, 0));
  walls.push(new Boundary(0, height, width, height));
  walls.push(new Boundary(0, 0, 0, height));
  walls.push(new Boundary(width/2, 0, width/2, height));

  document.addEventListener('keypress', function(e){
      if (e.code == 'KeyW'){        
        angleLarger = true;
      }else if (e.code == 'KeyS'){  
        angleSmaller = true;
      }else if (e.code == 'KeyD'){
        rotateLeft = true;
      }else if (e.code == 'KeyA'){
        rotateRight = true;
    }
  })

  document.addEventListener('mousedown', function(e){
    dist_b = Math.sqrt((mouseX - ball.pos.x)**2 + (mouseY - ball.pos.y)**2);
    dist_src = Math.sqrt((mouseX - src.pos.x)**2 + (mouseY - src.pos.y)**2);
    
    if (dist_src < src.radius){ //check if you are grabbing the source  
      console.log('source moving');
      sourcemoving = true;
    }else if (dist_b < ball.radius){ //check if you are grabbing the ball
      console.log('ball moving');
      ballmoving = true;
    }
  })

  document.addEventListener('mouseup', function(e){
    if (ballmoving){
        ballmoving = false;
    }
    if (sourcemoving){
        sourcemoving = false;
    }
  })
}

// Draw function is called many times each second
function draw() {
    background(30);

    src.setBeamDirection(walls); // show walls
    src.show(); // show source
    draw3DScene(src.beams) // 3D rendering

    for (let wall of walls) { // show walls
      wall.show();
    }
    walls = subset(walls, 0, res);

    createCircleWall(ball.pos.x, ball.pos.y, ball.radius/2, res);
    ball.mass = slider.value*400; //slider for ball
    ball.radius = slider2.value*2;
    ball.show();

    if (angleLarger){
        if (FOV + 15 <= 360){
            FOV += 15;
            angleLarger = false;
            src.setAngles(phi, FOV/2, numBeams);
        }
    }

    if (angleSmaller){
        if (FOV - 15 >= 0){
            FOV -= 15;
            angleSmaller = false;
            src.setAngles(phi, FOV/2, numBeams);
        }
    }

    if (rotateLeft){
      phi += 15;
      rotateLeft = false;
      src.setAngles(phi, FOV/2, numBeams);
    }

    if (rotateRight){
      phi -= 15;
      rotateRight = false;
      src.setAngles(phi, FOV/2, numBeams);
    }

    n = slider3.value;
    if (n != numBeams){
      numBeams = n;
      src.setAngles(phi, FOV/2, numBeams);
    }
   
    if (keyCode === UP_ARROW) {
      FOV -= 15;
      src.updateFOV();
    }else if (keyCode === DOWN_ARROW) {
      FOV += 15;
      src.updateFOV();
    }

    if (ballmoving){ // if you are moving the ball
        ball.pos.x = mouseX;
        ball.pos.y = mouseY;
    }

    if (sourcemoving){ // if you are moving the source
        src.updatePosition(mouseX, mouseY);
    }
}

// 3D 
// The farther away the ray the smaller it should be and the darker it should be
function draw3DScene(rays) {
  // Get magnitude of each ray
  let ray_mags = rays.map(ray => ray.mag); 

  // Find relative heights of rectangles based off magnitude.
  let max_mag = Math.max(ray_mags);
  // let rect_heights = ray_mags.map(ray_mag => Math.floor(ray_mag / max_mag * height));

  // Find relative brightness of rectanges based off magnitude.
  rect_flux = ray_mags.map(ray_mag => Math.floor(ray_mag/height * 255));

  // Find available width we have for each ray
  let w = Math.ceil(width / 2 / rays.length);

  // Change sky and ground colour
  rectMode(CENTER);
  fill(1,110,150);
  rect(3/4*width, height/2, width/2, height);
  fill(50,50,50);
  rect(3/4*width, 3/4*height, width/2, height/2);

  for (let i = 0; i < rays.length; i++) {
    rect_height = 1/ray_mags[i]*8000;
    fill(255-rect_flux[i]);
    noStroke();
    rect(width/2+w*i+w/2, height/2, w, rect_height);
  }
  // Draw a border in case # rays is small (hardcoding 1 pixel for each ray right now)
  fill(1);
  rect(width/2+w*rays.length + w/2, height/2, 1, height);
}

function createCircleWall(x0, y0, r, res) {
  // Generate the points on the circle with the given resolution.
  let thetas = [];
  for (let i = 0; i<360; i+=360/res) {
    thetas.push(i);
  }
  thetas = thetas.map(theta => theta * Math.PI / 180);
  let x = thetas.map(theta => x0 + r*Math.cos(theta));
  let y = thetas.map(theta => y0 + r*Math.sin(theta));

  // Connect all the neighboring points on the circle with a boundary
  let boundaries = [];
  for (let i = 0; i < x.length-1; i++) {
    boundaries.push(new Boundary(x[i], y[i], x[i+1], y[i+1]));
  }
  // Don't forget to connect the last point to the first point!
  boundaries.push(new Boundary(x[x.length-1],y[y.length-1],x[0],y[0]));
  walls = walls.concat(boundaries);
}
