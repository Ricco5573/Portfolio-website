class Anim extends Sprite{
    #animSpeed;
    #followUpAnim;
    #finished;
    #flipped = false;
    constructor(position, sprite, renderLayer, animSpeed, followUpAnim){
        super(position,sprite,renderLayer);
        this.#animSpeed = animSpeed;
        this.#followUpAnim = followUpAnim;
        this.#finished = false;
    }
    Update(){
        let sprite = this.GetSprite();
        if(sprite.getCurrentFrame() == sprite.numFrames()-1){
            this.AnimFinished();
        }
        super.Update();
    }
    Flip(flip){
        this.#flipped = flip;
    }
    GetFlipped(){
        return this.#flipped;
    }
    /*
    This function should be used externally.
    Usage: SetAnimSpeed(speed); speed: a number between 0 and 1, signifying the speed. with 1 being full speed.
    */
    SetAnimSpeed(speed){
        this.#animSpeed = speed;
        this.GetSprite().delay(100/this.#animSpeed);
    }
    GetFollowUpAnim(){
        return this.#followUpAnim;
    }
    AnimFinished(){
        this.#finished = true;
    }
    ResetAnim(){
        this.#finished = false;
    }
    IsAnimFinished(){
        return this.#finished;
    }
}