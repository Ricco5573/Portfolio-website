class CollisionObject{
    #sprite;
    #spriteCopy;
    #originalSprite;
    spriteIndex;
    position;
    renderLayer
    description; //to be used in the editor
    setRenderLayer = false;
    constructor(position, size, renderLayer, sprite, spriteIndex){
        this.position = position;
        this.size = size;
        if(spriteIndex === undefined){
            this.spriteIndex = -1;
        }
        else{
            this.spriteIndex = spriteIndex
        }
        this.#sprite = createImage(size.x, size.y);
        this.#spriteCopy = createImage(size.x, size.y);
        if(sprite === null  || sprite === undefined){
        this.#originalSprite = createImage(size.x,size.y);
        }
        else if(sprites.includes(sprite)){
            this.#originalSprite = sprite;
        }
        else
        {
        if(typeof sprite === "string"){
            this.#originalSprite = loadImage(sprite);
        }
        else{
            this.#originalSprite = sprite;

        }
        }
        imageMode(CENTER);
        if(this.#originalSprite !== undefined){
            this.#sprite.copy(this.#originalSprite, 0,0, this.size.x, this.size.y, 0,0,this.size.x,this.size.y);
        }
        this.gravity = 0.075;
        this.description = "The base collision class, if youre reading this, something's gone wrong. Yell for Ricardo."
    
        this.renderLayer = renderLayer;
    }

    checkCollision(pos, size){
        let x = this.position.x;
        let y = this.position.y;

        if( x + this.size.x/2 >= pos.x - size.x/2 &&
            x - this.size.x/2<= pos.x + size.x/2 &&
            y + this.size.y/2 >= pos.y - size.y/2 &&
            y - this.size.y/2 <= pos.y + size.y/2 ){
                return true;
            }
        }

    async ChangeRenderLayer(layer){

        if(this.#originalSprite !== undefined ){
        this.setRenderLayer = true;
        this.renderLayer = layer;
         this.#sprite.loadPixels();
         this.#originalSprite.loadPixels();
        if(this.#sprite.pixels.length > this.#originalSprite.pixels.length){
            let collumns = this.size.x/32;
            let rows = this.size.y/32;
            for(let i = 0; i <= collumns; i+=1){
                for(let j = 0; j <=rows; j+=1){
                    this.#sprite.copy(this.#originalSprite, 0,0, 32, 32, 32*i,32*j,32,32);
                }
            }
        }
        else{
            this.#sprite.copy(this.#originalSprite, 0,0, this.size.x, this.size.y, 0,0,this.size.x,this.size.y);
        }
         this.#spriteCopy.copy(this.#sprite,0,0, this.size.x, this.size.y, 0,0, this.size.x, this.size.y);
        this.#spriteCopy.loadPixels();
        if(this.renderLayer <10){
            for (let i = 0; i< this.#sprite.pixels.length; i+=4){
       
                this.#sprite.pixels[i] = lerp(10,this.#spriteCopy.pixels[i], this.renderLayer/15);
                this.#sprite.pixels[i + 1] = lerp(10,this.#spriteCopy.pixels[i+1], this.renderLayer/15);
                this.#sprite.pixels[i + 2] = lerp(10,this.#spriteCopy.pixels[i+2], this.renderLayer/15);
                this.#sprite.pixels[i + 3] = this.#spriteCopy.pixels[i+3];
                if(i %100000 == 0){
                    await sleep(1);
                }
            }
            this.#sprite.updatePixels();
            if(this.#spriteCopy !== undefined){
                this.#spriteCopy.updatePixels();
            }
        }
        else if(this.renderLayer > 10){
            for (let i = 0; i< this.#sprite.pixels.length; i+=4){
                this.#sprite.pixels[i] = this.#spriteCopy.pixels[i]
                this.#sprite.pixels[i + 1] = this.#spriteCopy.pixels[i+1]
                this.#sprite.pixels[i + 2] = this.#spriteCopy.pixels[i+2]
                this.#sprite.pixels[i + 3] = this.#spriteCopy.pixels[i+3];
                if(i %10000 == 0){
                    await sleep(1);
                }
            }
            this.#sprite.updatePixels();
            if(this.#spriteCopy !== undefined){
                this.#spriteCopy.updatePixels();
            }
        }
    }

}
    GetOriginalSprite(){
        return this.#originalSprite;
    }
    
    collisionSideCheck(pos,size,range) {
        range = range === undefined ? 0 : range;


        if (this.#bottomCollision(pos,size,range)) {
            return "bottom";
        } else if (this.#leftCollision(pos,size,range)) {
            return "left";
        } else if (this.#rightCollision(pos,size,range)) {
            return "right";
        } else if (this.#topCollision(pos,size,range)) {
            return "top";
        } else {
            return false;
        }
    }

    #bottomCollision(position,size,range) {
        if(this.position.x + (this.size.x/2) >= position.x - (size.x /2) && 
        this.position.x - (this.size.x/2) <= position.x + (size.x/2) 
    && this.position.y - (this.size.y/2) <= position.y - (size.y/2)
    && this.position.y + (this.size.y/2) >= position.y - size.y){
    return true;
    }
return false;
    }

    #topCollision(position,size,range) {
        if(this.position.x + (this.size.x/2) >= position.x - (size.x /2) && 
        this.position.x + (this.size.x/2) >= position.x - (size.x/2) &&
        this.position.y - (this.size.y/2) < position.y +(size.y/2)
        && this.position.y > position.y){
            return true;
        }
        return false;
    }

    #leftCollision(position,size) {
        if(this.position.x -(this.size.x/2) <= position.x + (size.x/2)&&
        this.position.x + (this.size.x/2) >= position.x + (size.x/2) &&
        this.position.y + (this.size.y/2) <= position.y + (size.y/2) &&
        this.position.y - (this.size.y/2) >= position.y -(size.y/2)){
            return true;
        }
        return false;
    }

    #rightCollision(position,size,range) {
        if (this.position.x + this.size.x/2 >= position.x - size.x/2 &&
            this.position.x + this.size.x/2 <= position.x - size.x/2 + range) {
            return true;
        } else return false;
    }


    GetPosition(){
        return this.position;
    }

    GetSprite(){
        return this.#sprite;
    }
    SetSprite(sprite){
        this.#originalSprite = sprite;
        this.#sprite = createImage(this.size.x,this.size.y);
        if(this.#originalSprite !== undefined){
        this.#sprite.copy(this.#originalSprite, 0,0, this.size.x, this.size.y, 0,0,this.size.x,this.size.y);
        }
    }
    GetSize(){
        return this.size;
    }
    Update(){
        if(!this.renderLayer){
            this.renderLayer = 12;
        }
        if(!this.setRenderLayer){
            this.ChangeRenderLayer(this.renderLayer);
        }
        renderer.AddSprite(this, this.renderLayer);
    }
}

function IsStatePlay(){
    if(state == "Play"){
        return true;
    }
    return false;
}