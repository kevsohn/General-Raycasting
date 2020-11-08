// Setup function is called once
// Global parameters
let walls = [];
let beam;
let src;
let numBeams = 100;
let FOV = 60;
let phi = 0;
let ball;
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
  output.innerHTML = slider.value; // Display the default slider value
  slider.oninput = function() {
    output.innerHTML = this.value;
  }

  slider2 = document.getElementById("radius");
  output2 = document.getElementById("radius-output");
  output2.innerHTML = slider2.value; // Display the default slider value
  slider2.oninput = function() {
    output2.innerHTML = this.value;
  }

  slider3 = document.getElementById("density");
  output3 = document.getElementById("density-output");
  output3.innerHTML = slider3.value; // Display the default slider value
  slider3.oninput = function() {
    output3.innerHTML = this.value;
  }

  src = new Source(width/2, height/2, numBeams);
  for (let i=0; i<5; i++) {
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

  ball = new massiveball(100,200,slider.value*400,slider2.value*2);

  document.addEventListener('keypress', function(e){
      //console.log("Key event");
      if (e.code == 'KeyW'){
          print("W");
          angleLarger = true;
      }

      else if (e.code == 'KeyS'){
          print("S")
          angleSmaller = true;
      }

      else if (e.code == 'KeyA'){
        print("A")
        rotateLeft = true;
      }

      else if (e.code == 'KeyD'){
        print("D")
        rotateRight = true;
    }
  })

  document.addEventListener('mousedown', function(e){
    dist_b = Math.sqrt((mouseX - ball.pos.x)**2 + (mouseY - ball.pos.y)**2);
    dist_src = Math.sqrt((mouseX - src.pos.x)**2 + (mouseY - src.pos.y)**2);
    
    if (dist_src < src.radius){ //check if you are grabbing the source
        console.log('source moving');
        sourcemoving = true;
    }
    
    else if (dist_b < ball.radius){ //check if you are grabbing the ball
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

    n = slider3.value;

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
      //if (phi + 15 <= 360){
      phi += 15;
      rotateLeft = false;
      src.setAngles(phi, FOV/2, numBeams);
      //}
    }

    if (rotateRight){
      //if (phi - 15 >= 360){
      phi -= 15;
      rotateRight = false;
      src.setAngles(phi, FOV/2, numBeams);
      //}
    }

    if (n != numBeams){
      numBeams = n;
      src.setAngles(phi, FOV/2, numBeams);
    }

    draw3DScene(src.beams) // 3D rendering

    ball.show();
    ball.mass = slider.value*400; //slider for ball
    ball.radius = slider2.value*2;

    //src.updateAngle(FOV);
    src.setBeamDirection(walls); // show walls
    src.show(); // show source

    if (ballmoving){ // if you are moving the ball
        ball.pos.x = mouseX;
        ball.pos.y = mouseY;
    }

    if (sourcemoving){ // if you are moving the source
        src.updatePosition(mouseX, mouseY);
    }

    for (let wall of walls) { // show walls
        wall.show();
    }
}

// 3D 
// The farther away the ray the smaller it should be and the darker it should be

function draw3DScene(rays) {
  // Get magnitude of each ray
  let ray_mags = rays.map(ray => ray.mag); 

  // Find relative heights of rectangles based off magnitude.
  let max_mag = Math.max(ray_mags);
  let rect_heights = ray_mags.map(ray_mag => Math.floor(ray_mag / max_mag * height));

  // Find relative brightness of rectanges based off magnitude.
  rect_flux = ray_mags.map(ray_mag => Math.floor(ray_mag/height * 255));

  // Find available width we have for each ray
  let w = Math.ceil(width / 2 / rays.length);
  //console.log(w);
  console.log(rays.length);
  rectMode(CENTER);
  for (let i = 0; i < rays.length; i++) {
    rect_height = 1/ray_mags[i]*8000;
    fill(255-rect_flux[i]);
    noStroke();
    rect(width/2+w*i+w/2, height/2, w, rect_height);
    // console.log(rect_height[i]); 
  }
  // Draw a border in case # rays is small (hardcoding 1 pixel for each ray right now)
  fill(1);
  rect(width/2+w*rays.length + w/2, height/2, 1, height);
}
