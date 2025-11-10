class Goal extends CollisionObject{

    constructor(position, size, renderLayer){
        super(position, size, renderLayer, loadImage("./assets/images/Goal.png"), -1);
        this.description = "Goal object, level is considered finished once the player touches it.";
    }
   
    
}