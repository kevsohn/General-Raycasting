// Setup function is called once
// Global parameters
let walls = [];
let beam;
let src;
let numBeams = 30;
let FOV = 360;
let ball;
let ballmoving = false;
let sourcemoving = false;

function setup() {
  // Create the canvas
  canvas_h = windowHeight*.8
  canvas_w = windowWidth*.8
  canvas = createCanvas(canvas_w, canvas_h);
  let canvas_div = document.getElementById("sketch-div");
  canvas_div.style.width = `${canvas_w}px`;
  canvas_div.style.height = `${canvas_h}px`;

  util_div = document.getElementById("util-container")
  util_div.style.height = `${canvas_h}px`

  canvas.parent('sketch-div');

  slider = document.getElementById("mass");
  output = document.getElementById("demo");
  output.innerHTML = slider.value; // Display the default slider value
  slider.oninput = function() {
    output.innerHTML = this.value;
  }

  src = new Source(width/2, height/2, FOV, numBeams);
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
  createCircleWall(50, 50, 15, 20);

  ball = new massiveball(100,200,0,slider.value*2);

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

/*function keyPressed() {
  if (keyCode === UP_ARROW) {
    FOV -= 15;
    src.updateFOV();
  }else if (keyCode === DOWN_ARROW) {
    FOV += 15;
    src.updateFOV();
  }
}*/

// Draw function is called many times each second
function draw() {
  console.log(walls.length);
  background(15);
  // src.updatePosition(mouseX, mouseY);
  // src.show();

    draw3DScene(src.beams) // 3D rendering

    ball.show();
    ball.mass = slider.value*400; //slider for ball

    src.setBeamDirection(walls); // show walls
    src.show(); // show source
   
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

    for (let wall of walls) { // show walls
        wall.show();
    }
}

class Source {
  constructor(x, y, FOV, numBeams) {
    this.radius = 25;
    this.pos = createVector(x, y);
    this.beams = [];
    for (let i=0; i<FOV; i+=FOV/numBeams) {
      this.beams.push(new Beam(this.pos, radians(i)));
    }
  }

  updateFOV() {
    for (let i=0; i<FOV; i+=FOV/numBeams) {
      this.beams[i].dir = p5.Vector.fromAngle(radians(i));
    }
  }

  updatePosition(x, y) {
    this.pos.set(x, y);    
  }

  setBeamDirection(walls) {
    for (let beam of this.beams) {
      let pMin = null;
      // let dMin = Infinity;
      let dMin = height;
      for (let wall of walls) {
        const p = beam.getIntersection(wall);
        if (p) {
          const d = p5.Vector.dist(this.pos, p);
          if (d < dMin) {
            dMin = d;
            pMin = p;
          }
        }
      }
      // Record magnitude of the ray connecting to the shortest wall.
      beam.mag = dMin;
      if (pMin) {
        push();
        stroke(255, 225, 125);
        line(this.pos.x, this.pos.y, pMin.x, pMin.y);
        pop();
      }
    }
  }

  show() {
    fill(255, 194, 24);
    circle(this.pos.x, this.pos.y, this.radius);
  }
}

class Beam {
  constructor(pos, theta) { 
    this.pos = pos;      
    this.dir = p5.Vector.fromAngle(theta);  
    this.mag = null;
  }  
  
  getIntersection(wall) {
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;
    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const denom = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
    if (denom == 0) {
      return;
    }

    const t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / denom;
    const u = -((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3)) / denom;
      
    if (u > 0 && t > 0 && t < 1) {
      this.p = createVector();
      this.p.x = x1 + t*(x2-x1);
      this.p.y = y1 + t*(y2-y1);
      return this.p;
    }else {
      return;
    }
  }

  look(x, y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }

  show() {
      stroke(255,200,100);
      push();
      translate(this.pos.x, this.pos.y);
      if (!this.p) {
        line(0, 0, this.dir.x*500, this.dir.y*500);
      }else {
        line(0, 0, this.p.x-this.pos.x, this.p.y-this.pos.y);
      }
      pop();
  }
}

class Boundary {
  constructor(x1, y1, x2, y2) {
      this.a = createVector(x1, y1);
      this.b = createVector(x2, y2);
  }

  show() {
    stroke(150);
    push();
    strokeWeight(5);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
    pop();
  }
}

// 3D 
// The farther away the ray the smaller it should be and the darker it should be
function draw3DScene(rays) {
  // Get magnitude of each ray
  let ray_mags = rays.map(ray => ray.mag); 

  // Find relative heights of rectangles based off magnitude.
  let max_mag = Math.max(ray_mags);
  //let rect_heights = ray_mags.map(ray_mag => Math.floor(ray_mag / max_mag * height));

  // Find relative brightness of rectanges based off magnitude.
  rect_flux = ray_mags.map(ray_mag => Math.floor(ray_mag/height * 255));

  // Find available width we have for each ray
  let w = Math.floor(width / 2 / rays.length);
  rectMode(CENTER);
  for (let i = 0; i < rays.length; i++) {
    rect_height = 1/ray_mags[i]*2500;
    fill(255-rect_flux[i]);
    noStroke();
    rect(width/2+w*i, height/2, w, rect_height);
  }
  // Draw a border in case # rays is small (hardcoding 1 pixel for each ray right now)
  fill(1);
  rect(width/2+w*rays.length, height/2, 1, height);
}

class massiveball{
    constructor(x, y, mass, radius){
        this.name = name;
        this.pos = createVector(x,y);
        this.mass = mass; //kg
        this.radius = radius; //m
    }

    show(){
        fill(255-2*this.mass/255, this.mass/255, this.mass*2/255); //need to integrate colormap somehow
        circle(this.pos.x, this.pos.y, this.radius);
    }
}

function createCircleWall(x0, y0, r, res) {

  // Generate the points on the circle with the given resolution.
  let thetas = [];
  // np.linspace(0,360,res);
  for (let i = 0; i<360; i+=360/res) {
    thetas.push(i);
  }
  thetas = thetas.map(theta => theta * Math.PI / 180);
  let x = thetas.map(theta => x0 + r*Math.cos(theta));
  let y = thetas.map(theta => y0 + r*Math.sin(theta));

  console.log(`x is: ${x}`);

  // Connect all the neighboring points on the circle with a boundary
  boundaries = [];
  for (let i = 0; i < x.length-1; i++) {
    boundaries.push(new Boundary(x[i], y[i], x[i+1], y[i+1]));
  }
  // Don't forget to connect the last point to the first point!
  boundaries.push(new Boundary(x[x.length-1],y[y.length-1],x[0],y[0]));
  walls = walls.concat(boundaries);
}