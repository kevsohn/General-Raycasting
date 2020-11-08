class Lensing{
    constructor(source_x, source_y, mass_x, mass_y, mass_value, rayVector_x, rayVector_y, distanceUnit){
        // mass[0,1] = position, mass[2] = mass in kg
        this.mass = [mass_x, mass_y, mass_value]; 
        // unit ray vector
        this.rayVec = createVector(rayVector_x, rayVector_y).normalize();
        // source position
        this.source = [source_x, source_y]; 
        // unit perpendicular vector to ray vec
        var perpVec = createVector(this.rayVec.y, -this.rayVec.x)
        
        // finding intersection point between lines drawn by rayVec and vecPerp, which corresponds to closest point to mass's centre
        // slope of rayVec
        var slopeRayVec = this.rayVec.y / this.rayVec.x ;
        // intersect of rayVec: intersect = y - slope * x
        var interRayVec = this.source[1] - slopeRayVec * this.source[0];
        // slope of perpVec
        var slopePerpVec = perpVec.y / perpVec.x ;
        // intersect of perpVec
        var interPerpVec = this.mass[1] - slopePerpVec * this.mass[0];

        // intersection point of the two lines: x = (inter2 - inter1) / (slope1 - slope2)
        // also corresponds to closest point on ray line to mass's centre
        this.closestPoint = [ (interPerpVec - interRayVec) / (slopeRayVec - slopePerpVec), slopeRayVec * (interPerpVec - interRayVec) / (slopeRayVec - slopePerpVec) + interRayVec];
        // distance from closestPoint to mass's centre
        var closestDistance = sqrt( (this.closestPoint[0] - this.mass[0])**2 + (this.closestPoint[1] - this.mass[1])**2 );
        
        // Computing deflecting angle (gravitational lensing): theta = 2*arcsin(1 / [closestDistance * c**2 /(G * mass + 1)])
        // formula obtained from https://www.ita.uni-heidelberg.de/~massimo/sub/Lectures/gl_all.pdf
        let c = 299792458; // speed of light in m/s
        let G = 6.67408e-11; // gravitational constant in m**3 * kg**-1 * s**-2 
        // angle
        var angle = 2*asin(1/((closestDistance*distanceUnit)*c**2/G/mass[2]+1));

        // to know which way to deflect the line, compare to slope of line joining the source and mass's centre
        var slopeCentres = ( this.mass[1] - this.source[1] ) / ( this.mass[0] - this.source[0] );
        if (slopeRayVec > slopeCentres) { // deflect in clockwise direction 
            this.vecDeflected = createVector(cos(-angle)*(this.rayVec.x) - sin(-angle)*(this.rayVec.y), sin(-angle)*(this.rayVec.x) + cos(-angle)*(this.rayVec.y));
        } else { // decflect in counter-clockwise direction
            this.vecDeflected = createVector(cos(angle)*(this.rayVec.x) - sin(angle)*(this.rayVec.y), sin(angle)*(this.rayVec.x) + cos(angle)*(this.rayVec.y));
        }
    }
}