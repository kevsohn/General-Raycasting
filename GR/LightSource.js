class LightSource {

    constructor(x1, y1, x2, y2) {
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2)
        this.t = 0.;
        this.u = 0.;
        this.px = 0.;
        this.py = 0.;
        this.p = createVector(0., 0.);
    }  
    
    intersection(a, b) {
        this.denom = (this.a.x-this.b.x)*(a.y-b.y) - (this.a.y-this.b.y)*(a.x-b.x);
        this.t = ((this.a.x-a.x)*(a.y-b.y) - (this.a.y-a.y)*(a.x-b.x)) / denom;
        this.u = ((this.a.x-this.b.x)*(this.a.y-a.y) - (this.a.y-this.b.y)*(this.a.x-a.x)) / denom;
        
        if (this.t >= 0.0 && this.u >= 0.0 && this.u <= 1.0) {
            this.p.x = this.a.x + t*(this.b.x-this.a.x);
            this.p.y = this.a.y + t*(this.b.y-this.a.y);
        }
        return this.p;
    }

    show() {
        stroke(255);
        if (this.p.x != 0. && this.p.y != 0.) {
            line(this.a.x, this.a.y, this.p.x, this.p.y);
        }else {
            line(this.a.x, this.a.y, this.b.x, this.b.y);
        }
    }
}