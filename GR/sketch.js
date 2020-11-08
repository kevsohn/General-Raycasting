// Setup function is called once
// Global parameters
let walls = [];
let beam;
let src;
let ball;

let ballmoving = false;
let sourcemoving = false;

function setup() {
  // Create the canvas
  canvas_h = windowHeight*.8
  canvas_w = windowWidth*.6
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

  let numBeams = 100;
  src = new Source(width/2, height/2, numBeams);
  for (let i=0; i<5; i++) {
    const x1 = random(width);
    const x2 = random(width);
    const y1 = random(height);
    const y2 = random(height);
    walls[i] = new Boundary(x1, y1, x2, y2);
  }
  walls.push(new Boundary(0, 0, width, 0));
  walls.push(new Boundary(0, height, width, height));
  walls.push(new Boundary(0, 0, 0, height));
  walls.push(new Boundary(width, 0, width, height));

  ball = new massiveball(100,200,0,slider.value*2);

  document.addEventListener('mousedown', function(e){
    dist_b = Math.sqrt((mouseX - ball.pos.x)**2 + (mouseY - ball.pos.y)**2);
    dist_src = Math.sqrt((mouseX - src.pos.x)**2 + (mouseY - src.pos.y)**2);
    //console.log(dist_src)
    if (dist_b < ball.radius){
      // console.log('mouse down');
      // return;
      console.log('ball moving');
      ballmoving = true;
    }

    if (dist_src < src.radius){
        console.log('source moving');
        sourcemoving = true;
    }
    // console.log('mouse down on ball');
    // ballmoving = true;
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
  background(230);
  // src.updatePosition(mouseX, mouseY);
  // src.show();

  src.setBeamDirection(walls);
  src.show();

  ball.show();
  ball.mass = slider.value*400;

  if (ballmoving){
    ball.pos.x = mouseX;
    ball.pos.y = mouseY;
  }

  if (sourcemoving){
      src.updatePosition(mouseX, mouseY);
  }

  for (let wall of walls) {
    wall.show();
  }
}


class Source {
  constructor(x, y, numBeams) {
    this.radius = 25;
    this.pos = createVector(x, y);
    this.beams = [];
    for (let i=0; i<360; i+=360./numBeams) {
      this.beams.push(new Beam(this.pos, radians(i)));
    }
  }

  updatePosition(x, y) {
    this.pos.set(x, y);    
  }

  setBeamDirection(walls) {
    for (let beam of this.beams) {
      let pMin = null;
      let dMin = Infinity;
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
      if (pMin) {
        push();
        stroke(255, 100, 100);
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
    stroke(0);
    push();
    strokeWeight(5);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
    pop();
  }
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