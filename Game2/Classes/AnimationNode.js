class AnimationNode{
    #sprite;
    #transitions = [];
    #transitionConditions = [];
    #split = false;
    #upper;
    #sisterAnim;
    #transOnEnd;
    constructor(sprite, split, upper, sisterAnim){
        this.#sprite = sprite;
        this.#split = split;
        this.#upper = upper;
        this.#sisterAnim = sisterAnim;
    } 
    GetSisterAnim(){
        return this.#sisterAnim;
    }
    GetUpper(){
        return this.#upper;
    }
    Mirror(mirror){
        this.#sprite.Flip(mirror);
    }
    UpdateAnimations(){
        this.#sprite.Update();
    }
    SetPosition(pos){
        this.#sprite.SetPosition(pos)
    }
    SetAnimSpeed(speed){
        this.#sprite.SetAnimSpeed(speed);
    }
    CheckForTransitions(obj){
        if(this.#sprite.IsAnimFinished() && this.#transOnEnd || !this.#transOnEnd){
            let ind=0;
            for(let func of this.#transitionConditions){
                if(func.call(obj)){
                    this.#sprite.ResetAnim();
                    return this.#transitions[ind];
                }
                ind +=1;
            }
        }
        return null
    }
    /*This function should be used externally
    usage: TransitionOnEnd(transition); transition: bool, should this function only transition after ending its animation
    */
    TransitionOnEnd(transition){
        this.#transOnEnd = transition;
    }
    /* this function should be used externally
    Usage: AddTransition(transition, transitionCondition); transition: the node that it will transition into.
    transitionCondition: a function that should return true or false. If its true, the given transition will occur.
    */
    AddTransition(transition, transitionCondition){
        this.#transitions.push(transition);
        this.#transitionConditions.push(transitionCondition);
    }
}