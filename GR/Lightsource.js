class Lightsource {
    constructor(x, y){

        this.x = x;
        this.y = y;
        
    }

    show() {
        stroke(1);
        circle(this.x,this.y,30);
    }
  }