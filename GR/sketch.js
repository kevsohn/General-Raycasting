// Setup function is called once

// Global parameters
// var Walls;
// var source;

/* let colormap = require('colormap')
let colors = colormap({
  colormap: 'jet',
  nshades: 10,
  format: 'hex',
  alpha: 1
})*/

let ball;

function setup() {
  // // Create the canvas
  createCanvas(720, 400);
  // canvas.parent('sketch-div');
  background(200);

  var slider = document.getElementById("mass");
  var output = document.getElementById("demo");

  output.innerHTML = slider.value; //Display the default slider value

  slider.oninput = function() {
    output.innerHTML = this.value;
  }

  // Create the walls and light source
  // source = lightsource(width / 2, height / 2);
  // Walls = [w1, w2, w3, w4] // Input manually here to desired shape

  //mass = new massive(mass1, (300,200), 10, 10)
  ball = new massiveball(100,200,20000,100);
}

// Draw function is called many times each second
function draw() {
  //background(255);
  ball.show();
  /*
  // FORMAT REFERENCE:
  // Point ~ [x0, y1]
  // Line ~ [[x0,y0],[x1,y1]] == [point1, point2]

  // Initial list of points to draw lines to
    points = []
    Walls.forEach(wall => {
    wall.forEach(point => {
      points.append([point.x, point.y])
    })
  })

  // Okay now we have the points we want so if we wanted rays to all the points we could do
  // line(point.x, point.y, source.x, source.y) for each point.
  // First though we want to remove points s.t. the ray to those points already passes through 
  // a wall

  // So lets collect all the lines to make this task easier.
  bdrylines = []
  Walls.forEach(wall => {
    for (var i = 0; i < wall.length-1; i++) {
      bdrylines.append([wall[i], wall[i+1]]); // Line is stored as two points in array [[x0,y0],[x1,y1]]
    }
  })

  // Ok now lets get the lines from the source to the points

  sourcelines = []
  points.forEach(point => {
    sourcelines.append([(source.x, source.y), (point.x, point.y)])
  })

  // Great so now lets eliminate the points we dont need by checking if a line to one of 
  // the points crosses a wall

  let rays = [];
  sourcelines.forEach(srcline => {
    bdrylines.forEach(bdryline => {
      if (line_intersection(srcline, bdryline) == false) {
        rays.append(rays)
      }
    })
  })

  // Draw the rays
  rays.forEach(ray => line(rays[0][0], rays[0][1], rays[1][0], rays[1][1]))*/
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