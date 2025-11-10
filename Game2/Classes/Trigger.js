class Trigger extends CollisionObject{
    func;
    triggered = false;
    reusable;
    constructor(position, size, renderLayer, functionTrigger, reusable){
        super(position, size, renderLayer, null, -1);
        this.func = functionTrigger;
        this.reusable = reusable   
    }
    Update(){
        //overwriting the rendering of this object.
        if(!editing){
        if(this.triggered){
            this.func();
        }
       let distance = dist(this.position.x, this.position.y, player.position.x, player.position.y);
       if(distance <= 50000 + this.size.x + this.size.y){
        if(this.checkCollision(player.position, player.GetSize())){
            this.triggered = true;
        }
        else if(this.reusable){
            this.triggered = false;
        }
       }
    }
    else{
        let c = color("Green");
        c.setAlpha(175);
        fill(c);
        rectMode(CENTER);
        rect(this.position.x*cam.GetZoom(),this.position.y*cam.GetZoom(), this.size.x*cam.GetZoom(), this.size.y*cam.GetZoom())
    }
}


}

class TitleTrigger extends Trigger{
    #timer = 0;
    #time = 0;
    title;
    playing = false;
    constructor(position,size, renderLayer, title, time){
        super(position,size, renderLayer, null, true)
        this.func = this.Title;
        this.#time = time;
        this.title = title;
        this.description = "A trigger that displays a title."
    }
    Update(){
        if(!this.triggered){
            this.#timer = 0;
            this.playing = false;
        }
        else if(!this.playing){
            PlaySound(8);
            this.playing = true;
        }
        print(this.triggered);
        super.Update();
    }
    Title(){
        if(this.triggered){
            this.#timer += deltaTime;
            if(this.#timer < this.#time){   
                push(); 
                textSize(50)
                textFont(titleFont);
                let c = color(255, 255, 255);
                if(this.#timer < this.#time /2){
                c.setAlpha(this.#timer);
                }
                else{
                c.setAlpha(this.#time - this.#timer);
                }
                fill(c);
                text(this.title, adjusted0Pos.x + canvasSize.x/2, adjusted0Pos.y + canvasSize.y * 0.1);
                pop();
            }
        }
        else{
            this.#timer = 0;
        }
    }
}