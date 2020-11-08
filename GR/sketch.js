// Setup function is called once

// Global parameters
// var Walls;
// var source;
let walls;
let beam;
let src;

function setup() {
  // Create the canvas
  canvas_h = windowHeight*.8
  canvas_w = windowWidth*.5
  canvas = createCanvas(canvas_w, canvas_h);
  let canvas_div = document.getElementById("sketch-div");
  canvas_div.style.width = `${canvas_w}px`;
  canvas_div.style.height = `${canvas_h}px`;

  util_div = document.getElementById("util-container")
  util_div.style.height = `${canvas_h}px`

  canvas.parent('sketch-div');
  background(200,200,200);
  stroke(1);

  slider = document.getElementById("mass");
  output = document.getElementById("demo");
  output.innerHTML = slider.value; // Display the default slider value
  output.innerHTML = slider.value; //Display the default slider value
  slider.oninput = function() {
    output.innerHTML = this.value;
  }


  // // Create the walls and light source
  // source = new Lightsource(width / 2, height / 2);

  wall1 = new Boundary(100, 100, width/2, height/2+50);
  wall2 = new Boundary(width/2, height/2-50, width/2-100, height/2+50);
  //beam = new Beam(100, height/2);
  let numBeams = 100;
  src = new Source(width/2, height/2, numBeams);
}

// Draw function is called many times each second
function draw() {
  // put drawing code here
  background(230);
  src.pos.x = mouseX;
  src.pos.y = mouseY;
  src.show();
  wall1.show();
  wall2.show();

  //beam.show();
  //beam.lookAt(mouseX, mouseY);

  //let p1 = beam.intersect(wall1);
  for (let beam of src.beams) {
    let p1 = beam.getIntersectionParams(wall1);
    //let p2 = beam.intersect(wall2);
  }
  //console.log(p1);

  // // FORMAT REFERENCE:
  // // Point ~ [x0, y1]
  // // Line ~ [[x0,y0],[x1,y1]] == [point1, point2]


  // // Initial list of points to draw lines to
  // points = []
  // Walls.forEach(wall => {
  //   wall.forEach(point => {
  //     points.append([point.x, point.y])
  //   })
  // })

  // // Okay now we have the points we want so if we wanted rays to all the points we could do
  // // line(point.x, point.y, source.x, source.y) for each point.
  // // First though we want to remove points s.t. the ray to those points already passes through 
  // // a wall

  // // So lets collect all the lines to make this task easier.
  // bdrylines = []
  // Walls.forEach(wall => {
  //   for (var i = 0; i < wall.length-1; i++) {
  //     bdrylines.append([wall[i], wall[i+1]]); // Line is stored as two points in array [[x0,y0],[x1,y1]]
  //   }
  // })

  // // Ok now lets get the lines from the source to the points

  // sourcelines = []
  // points.forEach(point => {
  //   sourcelines.append([(source.x, source.y), (point.x, point.y)])
  // })

  // // Great so now lets eliminate the points we dont need by checking if a line to one of 
  // // the points crosses a wall

  // let rays = [];
  // sourcelines.forEach(srcline => {
  //   bdrylines.forEach(bdryline => {
  //     if (line_intersection(srcline, bdryline) == false) {
  //       rays.append(rays)
  //     }
  //   })
  // })

  // // Draw the rays
  // rays.forEach(ray => line(rays[0][0], rays[0][1], rays[1][0], rays[1][1]))
}

class Beam {
  constructor(pos, theta) { 
    this.pos = pos;      
    this.dir = p5.Vector.fromAngle(theta);  
    this.int = false;
  }  
  
  getIntersectionParams(wall) {
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
      this.int = true;
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
      if (!this.int) {
        line(0, 0, this.dir.x*500, this.dir.y*500);
      }else {
        line(0, 0, this.p.x-this.pos.x, this.p.y-this.pos.y);
      }
      pop();
  }
}

class Source {
  constructor(x, y, numBeams) {
    this.pos = createVector(x, y);
    this.beams = [];
    for (let i=0; i<360; i+=360./numBeams) {
      this.beams.push(new Beam(this.pos, radians(i)));
    }
  }

  updatePos(x, y) {
    this.pos.set(x, y);    
  }

  getClosestIntersection(walls) {

  }

  setBeamDirection() {
    for (let beam of this.beams) {
      const p = beam.getIntersectionParams();
    }
  }

  show() {
    fill(0);
    circle(this.pos.x, this.pos.y, 10);
    for (let beam of this.beams) {
      beam.show();
    }
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