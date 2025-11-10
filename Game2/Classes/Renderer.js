class Renderer{
    #layers = 21;
    #renderLayers = []
    #darkness;
    constructor(){
        this.#ResetRenderLayers();
        this.#darkness = new Sprite(createVector(canvasSize.x/2, canvasSize.y/2), loadImage('./Assets/images/Darkness.jpg'), 20);
    }

    //Clears the render layers. SHOULD NOT BE EXTERNALLY USED.
    #ResetRenderLayers(){
        this.#renderLayers = [];
        for(let i = 0;  i <= this.#layers; i += 1){
            this.#renderLayers.push([]);
        }
    }

    /*This is a function that should be externally used  
    
    Usage: Render(); nothing else required. Should only be used once per frame.

    Loops through all the layers, and renders them one by one.
    taking the position they were given as the center of the sprite.*/
    
   async Render(){
        //this.#darkness.Resize(createVector(canvasSize.x*2, canvasSize.y*2));
        //this.#darkness.Update();
        imageMode(CENTER);
        let zoom = cam.GetZoom();
        push();

        let index = 0;
        scale(zoom, zoom);
        for(let x = 0; x <= this.#renderLayers.length; x+=1){
            if(this.#renderLayers[x] !== undefined){
                for(let y = 0; y<= this.#renderLayers[x].length; y+=1 ){
                    let obj = this.#renderLayers[x][y];
                    if(obj !== undefined){
                        let pos = obj.GetPosition();
                        let sprite = obj.GetSprite();
                        if(obj.GetFlipped !== undefined){
                            if(obj.GetFlipped()){
                                push();
                                scale(-zoom,zoom);
                                image(sprite, -pos.x /zoom, pos.y / zoom);
                                pop(); 
                            }
                            else{
                                if(x < 20){
                                    image(sprite, pos.x, pos.y);
                                }
                                else if (x==20){
                                    
                                    clip(this.Darkness, {invert: true}); 
                                    image(sprite, player.position.x,player.position.y);
                                }
                            }
                        }
                        else if(x < 20){
                            image(sprite, pos.x, pos.y);
                        }
                        else if (x==20){
                            image(sprite, pos.x,pos.y);
                        }
                    }
                }
            }
        }
        this.#ResetRenderLayers();
    }

    //Handles the darkness clipping. Will be expanded upon later for user story #10.
    //Takes everything from layer 21, and subtracts it from the image on layer 20.
    //Creating holes in the layer 20 texture.
    Darkness(){
        let mousePos = createVector(mouseX, mouseY);
        let playerPos = player.GetPosition();
        
        mousePos.add(playerPos);
       //    triangle(playerPos.x+10, playerPos.y, playerPos.x+100, mousePos.y + 100, playerPos.x + 100, mousePos.y );
          triangle(playerPos.x, playerPos.y, playerPos.x+200, mousePos.y + 200, playerPos.x + 200, mousePos.y - 200);

        circle(playerPos.x, playerPos.y, 150);
        ellipse(playerPos.x + 200,  mousePos.y, 100, 390);


    }

    /*This is a function that should be externally used  

    usage: AddSprite(this, renderlayer); with this being a reference to the object that needs to be rendered.
    and renderlayer being the layer upon which its rendered. It being a number between 0-19.

    layer 10 is reserved for the player. layer 20 for the darkness, and layer 21 for lights. */

    AddSprite(sprite, layer){
        if(sprite !== undefined && layer !== undefined){
        this.#renderLayers[layer].push(sprite);
        }
    }
}