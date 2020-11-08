class Wall {
    constructor(points){

        this.points = points;
        
    }

    show() {
        for (var i = 0; i < this.points.length-1; i++) {
            line(this.points[i][0],this.points[i][1],this.points[i+1][0],this.points[i+1][1]);
        }
        console.log("test");
    }
  }