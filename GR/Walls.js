class Walls {
    constructor(x1, y1, x2, y2){
        this.xs = createVector(x1, x2);
        this.ys = createVector(y1, y2);
    }

    show(){
        stroke(255);
        line(this.xs.x, this.ys.x, this.xs.x, this.ys.y);
        stroke(255);
        line(this.xs.x, this.ys.y, this.xs.y, this.ys.y);
        stroke(255);
        line(this.xs.y, this.ys.x, this.xs.y, this.ys.y);
        stroke(255);
        line(this.xs.x, this.ys.x, this.xs.y, this.ys.x);
    }
  }