// Setup function is called once
// Global parameters
let walls = [];
let beam;
let src;

function setup() {
  // Create the canvas
  canvas = createCanvas(600, 400);
  canvas.parent('sketch-div');

  slider = document.getElementById("mass");
  output = document.getElementById("demo");
  output.innerHTML = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
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
}

// Draw function is called many times each second
function draw() {
  // put drawing code here
  background(230);
  src.updatePosition(mouseX, mouseY);
  src.show();

  for (let wall of walls) {
    wall.show();
  }
  src.setBeamDirection(walls);
}


class Source {
  constructor(x, y, numBeams) {
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
    fill(255, 200, 100);
    circle(this.pos.x, this.pos.y, 5);
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
      this.int = false;
      return;
    }
  }

  lookAt(x, y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }

  show() {
      stroke(255, 200, 100);
      push();
      strokeWeight(1);
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