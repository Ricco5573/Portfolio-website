class Platforms {
    constructor() {
        this.platforms = [];
        this.tileDistancing = 32;
    }
    Update(){
        for(let plat of this.platforms){
            if(plat !== undefined){
                plat.Update();
            }
        }
    }
    createPlatform(row,column,sizeX,sizeY,layer,type,endrow,endcolumn) { // WIP for what each platform can have as attributes
        let xsize = constrain(sizeX,32,32);
        let ysize = constrain(sizeY,32,32);
        
        if (type === "HorizontalMover" || type === "VerticalMover") {
            this.platforms.push (new MovingPlatform(createVector(this.tileDistancing * row, this.tileDistancing * column), createVector(xsize,ysize), layer, type,createVector(endrow * this.tileDistancing, endcolumn * this.tileDistancing)));
        } else if (type === "Phasing") {
            this.platforms.push (new PhasingPlatform(createVector(this.tileDistancing * row, this.tileDistancing * column), createVector(xsize,ysize), layer, type));
        } else {
            this.platforms.push (new Platform(createVector(this.tileDistancing * row, this.tileDistancing * column),createVector(xsize,ysize),layer,type));
        }
    }
}


class Platform extends CollisionObject{
    constructor(position, size, renderLayer,type, spriteIndex){
        super(position, size, renderLayer, sprites[36], spriteIndex);
        this.type = type;
        this.description = "Basic platform, player collides with it. If renderlayer is below 10. Acts as part of the background.";
        if(!this.spriteIndex){
        this.spriteIndex = 36;
        }
    }
    Update(){
        super.Update();

    }
    
}

class MovingPlatform extends Platform{
    constructor(position,size,renderLayer,type,secondPosition, spriteIndex) {
        super(position,size,renderLayer,type, spriteIndex)
        this.secondPosition = secondPosition;
        this.firstPosition = createVector(position.x,position.y);
        this.velocity = createVector(this.firstPosition.x - this.secondPosition.x,this.firstPosition.y - this.secondPosition.y);
        this.velocity.normalize();
        this.directionChanged = true;
        this.moved = 0;
        this.speed = 3;
        this.velocity.mult(this.speed);
        this.description = "Platform that moves between two given locations. Hold down the mouse button when placing to place its move point."
    }

    // Updates all systems related to moving platforms, including movement and rendering. Only use this function externally.
    Update(){
        if (!pauzed) {
                this.#move();
        }

        super.Update();

    }
    UpdateSecondPosition(pos){
        this.secondPosition = pos;
        this.velocity = createVector(this.firstPosition.x - this.secondPosition.x,this.firstPosition.y - this.secondPosition.y);
        this.velocity.normalize();
        this.velocity.mult(this.speed);
    }

    // For use only inside this class
    #move() {

        if(player!== null)
        {        
            if (this.checkCollision(player.position,player.size)) {
                player.position.y += this.velocity.y;
                player.position.x += this.velocity.x;
            }
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(!this.directionChanged && dist(this.position.x, this.position.y, this.secondPosition.x, this.secondPosition.y) <= 5){
            this.directionChanged = true;
            this.velocity.mult(-1);
        }
        else if(this.directionChanged && dist(this.position.x, this.position.y, this.firstPosition.x, this.firstPosition.y) <= 5){
            this.directionChanged = false;
            this.velocity.mult(-1);
        }
    

    }

    // For use only inside this class
}

class PhasingPlatform extends Platform{
    constructor(position,size,renderLayer,type) {
        super(position,size,renderLayer,type);
    }
}