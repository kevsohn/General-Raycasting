function setup() {
  // // Create the canvas
  createCanvas(720, 400);
  background(200);

  // // Set colors
  // fill(204, 101, 192, 127);
  // stroke(127, 63, 120);

  // // A rectangle
  // //rect(40, 120, 120, 40);
  // // An ellipse
  // ellipse(240, 240, 80, 80);
  // // A triangle
  // triangle(300, 100, 320, 100, 310, 80);

  // // A design for a simple flower
  // translate(580, 200);
  // noStroke();
  // for (let i = 0; i < 10; i ++) {
  //   ellipse(0, 30, 20, 80);
  //   rotate(PI/5);

  source = lightsource(mousex, mousey);
  let Walls = [w1, w2, w3, w4]
  
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
      bdrylines.append(wall[i], wall[i+1]); // Line is stored as two points in array [(x0,y0),(x1,y1)]
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
      if !line_intersection(srcline, bdryline) {
        rays.append(rays)
      }
    })
  })

  // Draw the rays
  rays.forEach(ray => draw the line)

}

function draw() {
  // put drawing code here
  ellipse(50, 50);
}