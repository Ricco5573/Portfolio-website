class StaticDecor extends CollisionObject{
    constructor(position, size, renderLayer,sprite, type,spriteIndex){
        super(position,size, renderLayer, sprite, spriteIndex);
        this.type = type;
                this.description = "A decorative object, does not have collisions."
    }

    Update() {
        super.Update();
    }
    
}

class Interactable extends StaticDecor{
    active;
    constructor(position,size,renderLayer,sprite,type, spriteIndex) {
        super(position,size,renderLayer,sprite,type, spriteIndex);
        this.active = false;

    }

    Update() {
        super.Update();
    }

    interact() {
        if(player != null){
            let distance = dist(this.position.x, this.position.y, player.position.x, player.position.y);
            if(distance <= 100){
                this.active = true;
            }
            else{
                this.active = false;
            }
        }

        this.prompt.SetActive(this.active);
        this.prompt.Update();
    }

}
class SteamRelay extends Interactable{
        constructor(position, size, renderLayer,sprite){
            super(position, size, renderLayer,sprites[7],"SteamRelay");
            this.active = false;
            this.promptPosition = createVector(this.position.x +25, this.position.y -30);
            this.prompt = new ButtonPrompt(this.promptPosition, this.renderLayer, loadImage('./assets/Sprites/ButtonPrompts/E-Prompt.png'));
            this.description = "A steam relay, can be used by the player to refill their steam reserves.";
        }

        Update(){
            if(player !== null){

            let playerPos = player.GetPosition();
            if(dist(playerPos.x, playerPos.y, this.position.x, this.position.y) <= 150){
                this.active = true;
                this.promptPosition = createVector(this.position.x +25, this.position.y -30);
                this.prompt.position = this.promptPosition;

            }
            else{
                this.active = false;
            }
            super.Update();
            super.interact();
        }
        }

}

class bulletPickup extends Interactable{
    constructor(position,size,renderLayer,sprite,type) {
        super(position,size,renderLayer,sprite,type);
    }

    Update() {
        super.Update();
    }
}

class ButtonPrompt{
    constructor(position, renderLayer, img){
        this.position = position;
        this.renderLayer = renderLayer;
        this.img = img;
        this.active = false;
    }
    GetPosition(){
        return this.position;
    }
    GetSprite(){
        return this.img;
    }
    SetActive(active){
        this.active = active;
    }
    Update(){
        if(this.active){
            renderer.AddSprite(this,this.renderLayer);
        }
    }
}