// Setup function is called once

// Global parameters
// var Walls;
// var source;
let Walls;
let light;
let ball;

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

  // // Make a square :D
  // let p1 = [0,0];
  // let p2 = [0,20];
  // let p3 = [20,20];
  // let p4 = [20,0];

  // // Create the walls and light source
  // // Walls = [w1, w2, w3, w4] // Input manually here to desired shape
  // w1 = new Wall([p1, p2, p3, p4, p1]);
  // Walls = [w1]
  // light = new LightSource(100, height/2);
  // // ball = new massiveball(100,200,20000,slider.value*2);



}

// Draw function is called many times each second
function draw() {
//   // put drawing code here
//   background(255);
//   ball.show();
//   ball.radius = slider.value*2;
//   light.show();
//   light.look(mouseX, mouseY);

//   let p = light.intersect(wall);

//   // // FORMAT REFERENCE:
//   // // Point ~ [x0, y1]
//   // // Line ~ [[x0,y0],[x1,y1]] == [point1, point2]

//   // Draw the walls
//   Walls.forEach(wall => {
//     wall.show();
//   })

//   // Draw the lightsource
//   light.show();


//   // Initial list of points to draw lines to
//   points = []
//   Walls.forEach(wall => {
//     wall.forEach(point => {
//       points.append([point.x, point.y])
//     })
//   })

//   // Okay now we have the points we want so if we wanted rays to all the points we could do
//   // line(point.x, point.y, source.x, source.y) for each point.
//   // First though we want to remove points s.t. the ray to those points already passes through 
//   // a wall

//   // So lets collect all the lines to make this task easier.
//   bdrylines = []
//   Walls.forEach(wall => {
//     for (var i = 0; i < wall.length-1; i++) {
//       bdrylines.append([wall[i], wall[i+1]]); // Line is stored as two points in array [[x0,y0],[x1,y1]]
//     }
//   })

//   // // Ok now lets get the lines from the source to the points

//   sourcelines = []
//   points.forEach(point => {
//     sourcelines.append([[source.x, source.y], [point[0], point.y[1]]])
//   })

//   // Great so now lets eliminate the points we dont need by checking if a line to one of 
//   // the points crosses a wall

//   let rays = [];
//   sourcelines.forEach(srcline => {
//     bdrylines.forEach(bdryline => {
//       if (line_intersection(srcline, bdryline) == false) {
//         rays.append(rays)
//       }
//     })
//   })

//   // // Draw the rays
//   rays.forEach(ray => line(rays[0][0], rays[0][1], rays[1][0], rays[1][1]))
// }

// class LightSource {
//   constructor(x, y) { 
//     this.pos = createVector(x, y);      
//     this.dir = createVector(1, 0);    
//   }  
  
//   intersect(wall) {
//     const x1 = wall.a.x;
//     const y1 = wall.a.y;
//     const x2 = wall.b.x;
//     const y2 = wall.b.y;

//     const x3 = this.pos.x;
//     const y3 = this.pos.y;
//     const x4 = this.pos.x + this.dir.x;
//     const y4 = this.pos.y + this.dir.y;

//     const denom = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
//     if (denom == 0) {
//       return;
//     }

//     const t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / denom;
//     const u = -((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3)) / denom;
      
//     if (u > 0 && t > 0 && t < 1) {
//       return true;
//     }else {
//       return;
//     }
//   }

//   look(x, y) {
//     this.dir.x = x - this.pos.x;
//     this.dir.y = y - this.pos.y;
//     this.dir.normalize();
//   }

//   show() {
//       stroke(255,200,100);
//       push();
//       translate(this.pos.x, this.pos.y);
//       line(0, 0, this.dir.x*10, this.dir.y*10);
//       pop();
//   }
// }

// class Boundary {
//   constructor(x1, y1, x2, y2) {
//       this.a = createVector(x1, y1);
//       this.b = createVector(x2, y2);
//   }

//   show() {
//       stroke(0);
//       strokeWeight(5);
//       line(this.a.x, this.a.y, this.b.x, this.b.y);
//   }
// }

// class massiveball{
//   constructor(x, y, mass, radius){
//       this.name = name;
//       this.pos = createVector(x,y);
//       this.mass = mass; //kg
//       this.radius = radius; //m
//   }

//   show(){
//       fill(255-2*this.mass/255, this.mass/255, this.mass*2/255); //need to integrate colormap somehow
//       circle(this.pos.x, this.pos.y, this.radius);
//   }
}