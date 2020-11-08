class Source {
    constructor(x, y, numBeams) {
      this.radius = 25;
      this.pos = createVector(x, y);
      this.beams = [];
      this.angle = FOV/2;
      this.setAngles(this.angle);
    }
  
    setAngles(theta, num){
      this.beams=[];
      if (theta == 0){
          this.beams.push(new Beam(this.pos, 0.0));
      }
      
      else{
          for (let i=-theta; i<theta; i+=FOV / num) {
              this.beams.push(new Beam(this.pos, radians(i)));
          }
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
        // console.log(`dmin is: ${dMin}`);
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