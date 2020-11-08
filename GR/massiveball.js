class MassiveBall{
    constructor(x, y, mass, radius, res){
        this.pos = createVector(x,y);
        this.mass = mass; //kg
        this.radius = radius; //m
        this.res = res;
    }
  
    show(){
        fill(255-2*this.mass/255, this.mass/255, this.mass*2/255); //need to integrate colormap somehow
        circle(this.pos.x, this.pos.y, this.radius);
    }
}