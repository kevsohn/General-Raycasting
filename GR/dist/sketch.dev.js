"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Setup function is called once
// Global parameters
var walls = [];
var beam;
var src;
var numBeams = 150;
var FOV = 60;
var ball;
var ballmoving = false;
var sourcemoving = false;

function setup() {
  // Create the canvas
  canvas_h = windowHeight * .8;
  canvas_w = windowWidth * .8;
  canvas = createCanvas(canvas_w, canvas_h);
  var canvas_div = document.getElementById("sketch-div");
  canvas_div.style.width = "".concat(canvas_w, "px");
  canvas_div.style.height = "".concat(canvas_h, "px");
  util_div = document.getElementById("util-container");
  util_div.style.height = "".concat(canvas_h, "px");
  canvas.parent('sketch-div');
  slider = document.getElementById("mass");
  output = document.getElementById("demo");
  output.innerHTML = slider.value; // Display the default slider value

  slider.oninput = function () {
    output.innerHTML = this.value;
  };

  src = new Source(width / 2, height / 2, numBeams);

  for (var i = 0; i < 5; i++) {
    var x1 = random(width / 2);
    var x2 = random(width / 2);
    var y1 = random(height);
    var y2 = random(height);
    walls[i] = new Boundary(x1, y1, x2, y2);
  }

  walls.push(new Boundary(0, 0, width, 0));
  walls.push(new Boundary(0, height, width, height));
  walls.push(new Boundary(0, 0, 0, height));
  walls.push(new Boundary(width / 2, 0, width / 2, height));
  ball = new massiveball(100, 200, 1e25, slider.value * 2);
  document.addEventListener('mousedown', function (e) {
    dist_b = Math.sqrt(Math.pow(mouseX - ball.pos.x, 2) + Math.pow(mouseY - ball.pos.y, 2));
    dist_src = Math.sqrt(Math.pow(mouseX - src.pos.x, 2) + Math.pow(mouseY - src.pos.y, 2)); //console.log(dist_src)

    if (dist_b < ball.radius) {
      // console.log('mouse down');
      // return;
      console.log('ball moving');
      ballmoving = true;
    }

    if (dist_src < src.radius) {
      console.log('source moving');
      sourcemoving = true;
    } // console.log('mouse down on ball');
    // ballmoving = true;

  });
  document.addEventListener('mouseup', function (e) {
    if (ballmoving) {
      ballmoving = false;
    }

    if (sourcemoving) {
      sourcemoving = false;
    }
  });
} // Draw function is called many times each second


function draw() {
  background(15); // src.updatePosition(mouseX, mouseY);
  // src.show();

  lens = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = src.beams[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _beam = _step.value;
      lens.push(new Lensing(src.pos.x, src.pos.y, ball.pos.x, ball.pos.y, 1e35, _beam.dir.x, _beam.dir.y, Math.pow(10, 6))); // 1e6 m is unit distance
    } //src.setBeamDirection(walls, lens);

  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  src.show();
  ball.show();
  ball.mass = slider.value * 400;

  if (ballmoving) {
    ball.pos.x = mouseX;
    ball.pos.y = mouseY;
  }

  if (sourcemoving) {
    src.updatePosition(mouseX, mouseY);
  }

  src.setBeamDirection(walls, lens);
}

var Source =
/*#__PURE__*/
function () {
  function Source(x, y, numBeams) {
    _classCallCheck(this, Source);

    this.radius = 25;
    this.pos = createVector(x, y);
    this.beams = [];

    for (var i = 0; i < FOV; i += FOV / numBeams) {
      this.beams.push(new Beam(this.pos, radians(i)));
    }
  }

  _createClass(Source, [{
    key: "updatePosition",
    value: function updatePosition(x, y) {
      this.pos.set(x, y);
    }
  }, {
    key: "setBeamDirection",
    value: function setBeamDirection(walls, lens) {
      for (var i = 0; i < this.beams.length; i++) {
        var pMin = null; // let dMin = Infinity;

        var dMin = height;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = walls[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var wall = _step2.value;
            var p = this.beams[i].getIntersection(wall);

            if (p) {
              var d = p5.Vector.dist(this.pos, p);

              if (d < dMin) {
                dMin = d;
                pMin = p;
              }
            }
          } // Record magnitude of the ray connecting to the shortest wall.

        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this.beams[i].mag = dMin;

        if (pMin) {
          push();
          stroke(255, 225, 125);
          line(this.pos.x, this.pos.y, lens[i].closestPoint[0], lens[i].closestPoint[1]);
          line(lens[i].closestPoint[0], lens[i].closestPoint[1], 1000 * lens[i].vecDeflected.x + lens[i].closestPoint[0], 1000 * lens[i].vecDeflected.y + lens[i].closestPoint[1]);
          pop();
        }
      }
    }
  }, {
    key: "show",
    value: function show() {
      fill(255, 194, 24);
      circle(this.pos.x, this.pos.y, this.radius);
    }
  }]);

  return Source;
}();

var Beam =
/*#__PURE__*/
function () {
  function Beam(pos, theta) {
    _classCallCheck(this, Beam);

    this.pos = pos;
    this.dir = p5.Vector.fromAngle(theta);
    this.mag = null;
  }

  _createClass(Beam, [{
    key: "getIntersection",
    value: function getIntersection(wall) {
      var x1 = wall.a.x;
      var y1 = wall.a.y;
      var x2 = wall.b.x;
      var y2 = wall.b.y;
      var x3 = this.pos.x;
      var y3 = this.pos.y;
      var x4 = this.pos.x + this.dir.x;
      var y4 = this.pos.y + this.dir.y;
      var denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

      if (denom == 0) {
        return;
      }

      var t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
      var u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

      if (u > 0 && t > 0 && t < 1) {
        this.p = createVector();
        this.p.x = x1 + t * (x2 - x1);
        this.p.y = y1 + t * (y2 - y1);
        return this.p;
      } else {
        return;
      }
    }
  }, {
    key: "look",
    value: function look(x, y) {
      this.dir.x = x - this.pos.x;
      this.dir.y = y - this.pos.y;
      this.dir.normalize();
    }
  }, {
    key: "show",
    value: function show() {
      stroke(255, 200, 100);
      push();
      translate(this.pos.x, this.pos.y);

      if (!this.p) {
        line(0, 0, this.dir.x * 500, this.dir.y * 500);
      } else {
        line(0, 0, this.p.x - this.pos.x, this.p.y - this.pos.y);
      }

      pop();
    }
  }]);

  return Beam;
}();

var Boundary = function Boundary(x1, y1, x2, y2) {
  _classCallCheck(this, Boundary);

  this.a = createVector(x1, y1);
  this.b = createVector(x2, y2);
}
/*
show() {
  stroke(150);
  push();
  strokeWeight(5);
  line(this.a.x, this.a.y, this.b.x, this.b.y);
  pop();
  */
; // 3D 
// The farther away the ray the smaller it should be and the darker it should be

/*
function draw3DScene(rays) {
  // Get magnitude of each ray
  let ray_mags = rays.map(ray => ray.mag); 

  // Find relative heights of rectangles based off magnitude.
  let max_mag = Math.max(ray_mags);
  let rect_heights = ray_mags.map(ray_mag => Math.floor(ray_mag / max_mag * height));

  // Find relative brightness of rectanges based off magnitude.
  rect_flux = ray_mags.map(ray_mag => Math.floor(ray_mag/height * 255));

  // Find available width we have for each ray
  let w = Math.floor(width / 2 / rays.length);
  console.log(w);
  rectMode(CENTER);
  for (let i = 0; i < rays.length; i++) {
    rect_height = 1/ray_mags[i]*1500;
    fill(255-rect_flux[i]);
    noStroke();
    rect(width/2+w*i, height/2, w, rect_height);
    console.log(rect_height[i]); 
  }
  // Draw a border in case # rays is small (hardcoding 1 pixel for each ray right now)
  rect(width/2+w*rays.length, height/2, 1, height);
}*/


var massiveball =
/*#__PURE__*/
function () {
  function massiveball(x, y, mass, radius) {
    _classCallCheck(this, massiveball);

    this.name = name;
    this.pos = createVector(x, y);
    this.mass = mass; //kg

    this.radius = radius; //m
  }

  _createClass(massiveball, [{
    key: "show",
    value: function show() {
      fill(255 - 2 * this.mass / 255, this.mass / 255, this.mass * 2 / 255); //need to integrate colormap somehow

      circle(this.pos.x, this.pos.y, this.radius);
    }
  }]);

  return massiveball;
}();