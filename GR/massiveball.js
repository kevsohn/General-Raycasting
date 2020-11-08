class massiveball{
    constructor(x, y, mass, radius){
        this.name = name;
        this.pos = createVector(x,y);
        this.mass = mass; //kg
        this.radius = radius; //m
    }

    show(){
        fill(0);
        ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
    }
}