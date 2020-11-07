// Setup function is called once

// Global parameters
// var Walls;
// var source;
let wall;
let light;

function setup() {
  // Create the canvas
  canvas = createCanvas(720, 400);
  canvas.parent('sketch-div');

  slider = document.getElementById("mass");
  output = document.getElementById("demo");
  output.innerHTML = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    output.innerHTML = this.value;
  }

  // // Create the walls and light source
  // source = lightsource(width / 2, height / 2);
  // Walls = [w1, w2, w3, w4] // Input manually here to desired shape

  wall = new Boundary(width/2, height/2-50, width/2, height/2+50);
  light = new LightSource(100, height/2);
}

// Draw function is called many times each second
function draw() {
  // put drawing code here
  background(255);
  wall.show();
  light.show();
  light.look(mouseX, mouseY);

  let p = light.intersect(wall);
  //console.log(p);

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

class LightSource {
  constructor(x, y) { 
    this.pos = createVector(x, y);      
    this.dir = createVector(1, 0);    
  }  
  
  intersect(wall) {
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
      return true;
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
      line(0, 0, this.dir.x*10, this.dir.y*10);
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
      strokeWeight(5);
      line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}