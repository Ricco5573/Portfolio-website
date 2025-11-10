class AnimationController{
    #parent;
    #currentAnimationNode;
    #currentUpperAnimationNode;
    #currentLowerAnimationNode;
    #animationNodes = [];
    #mirrored = false;
    constructor(parent){
        this.#parent = parent;
        this.#currentAnimationNode = null;
    }
    
    UpdateNodes(){
        this.#CheckTransitions();
        let position = this.#parent.GetPosition();
        if(this.#currentAnimationNode !== null){
            this.#currentAnimationNode.Mirror(this.#mirrored);
            this.#currentAnimationNode.SetPosition(position);
            this.#currentAnimationNode.UpdateAnimations();
        }
        else{
            this.#currentUpperAnimationNode.Mirror(this.#mirrored);
            this.#currentUpperAnimationNode.SetPosition(position);
            this.#currentUpperAnimationNode.UpdateAnimations();
            this.#currentLowerAnimationNode.Mirror(this.#mirrored);
            this.#currentLowerAnimationNode.SetPosition(position);
            this.#currentLowerAnimationNode.UpdateAnimations();
        }
    }
    Mirror(mirror){
        this.#mirrored = mirror;
    }
    SetAnimSpeed(speed){
        if(this.#currentAnimationNode!== null){
            this.#currentAnimationNode.SetAnimSpeed(speed);

        }
        else{
            this.#currentLowerAnimationNode.SetAnimSpeed(speed);
            this.#currentUpperAnimationNode.SetAnimSpeed(speed);
        }
    }
    #CheckTransitions(){
        let nextNode = null;
        if(this.#currentAnimationNode !== null){
             nextNode = this.#currentAnimationNode.CheckForTransitions(this.#parent);
            }
            else{
                nextNode = this.#currentUpperAnimationNode.CheckForTransitions(this.#parent);
            }
            if(nextNode !== null && nextNode != false){
                let sister = nextNode.GetSisterAnim();
                if(sister !== null && sister !== false){
                    if(nextNode.GetUpper()){
                        this.#currentUpperAnimationNode = nextNode;
                        this.#currentLowerAnimationNode = sister;
                    }
                    else if(!nextNode.GetUpper()){

                        this.#currentUpperAnimationNode = sister;
                        this.#currentLowerAnimationNode = nextNode;
                    }
                    this.#currentAnimationNode = null;
                }
                else{
                    this.#currentAnimationNode = nextNode;
                }
            }
    }
    /* This function should be used externally
    Usage: AddNode(node, startNode); node: reference to an AnimationNode;
    startNode: boolean, should node be used to start from.
    */
    AddNode(node, startNode){
        this.#animationNodes.push(node);
        if(startNode){
            if(node.GetSisterAnim() !== null){
                this.#currentUpperAnimationNode = node;
                this.#currentLowerAnimationNode = node.GetSisterAnim();
            }
            else{
                this.#currentAnimationNode = node;
            }
        }
    }
}
