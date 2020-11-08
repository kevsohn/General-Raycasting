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