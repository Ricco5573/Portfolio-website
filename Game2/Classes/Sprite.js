class Sprite{
    #position;
    #sprite;
    #renderLayer
    #flipped;
    constructor(position, sprite, renderLayer){
        this.#position = position;
        this.#sprite = sprite;
        this.#renderLayer = renderLayer;
        this.#flipped = false;
    }

    Resize(size){
        this.#sprite.resize(size.x, size.y);
    }
    GetPosition(){
        return this.#position;
    }
    SetPosition(pos){
        this.#position = pos;
    }
    GetSprite(){
        return this.#sprite;
    }
    GetFlipped(){
        return this.#flipped;
    }
    Flip(flip){
        this.#flipped = flip
    }
    Update(){
        renderer.AddSprite(this, this.#renderLayer);
    }
}