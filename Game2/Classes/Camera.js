class Camera{
    #camPos;
    #playMode;
    #editMode;
    #zoom;
    #desiredZoom;
    #speed;
    #canChange;

    constructor(CanChangeMode){
        this.#camPos = createVector(0,0);
        this.#canChange = CanChangeMode;
        
        this.#playMode = !this.#canChange; 
        this.#editMode = this.#canChange;
        editMode = this.#canChange;
        editing = this.#canChange;
        this.#zoom = 1;
        this.#speed = 10;
        this.#desiredZoom = 1;
    }

    Update(){
        // print(editMode);
        this.#desiredZoom = constrain(this.#desiredZoom, 0.1, 4);
        this.#zoom = lerp(this.#zoom, this.#desiredZoom, 0.1);
        if(this.#playMode){
            this.#PlayModeCam();
        }
        else if(this.#editMode){
            this.#EditModeCam();
        }
        push();
        translate(canvasSize.x /2  - this.#camPos.x, canvasSize.y /2 - this.#camPos.y);
    }
    #PlayModeCam(){
        this.#desiredZoom = 1;
        if(player !== null){
            let camWantedPos = createVector(0,0);
            let position = player.GetPosition();
            camWantedPos.x = lerp(mouseX + position.x, position.x, 0.85);
            camWantedPos.y = lerp(mouseY + position.y, position.y, 0.85);
            this.#camPos.x = lerp(this.#camPos.x, camWantedPos.x, 0.1);
            this.#camPos.y = lerp(this.#camPos.y, camWantedPos.y, 0.1);
        }
    }
    GetPosition(){
        return this.#camPos;
    }
    GetZoom(){
        return this.#zoom;
    }
    #EditModeCam(){
        if(keyIsDown(LEFT_ARROW) || keyIsDown(65)){
            this.#camPos.x -= this.#speed - (this.#zoom/4);
        }
        if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
            this.#camPos.x += this.#speed - (this.#zoom/4);
        }
        if(keyIsDown(UP_ARROW) || keyIsDown(87)){
            this.#camPos.y -= this.#speed - (this.#zoom/4);
        }
        if(keyIsDown(DOWN_ARROW) || keyIsDown(83)){
            this.#camPos.y += this.#speed - (this.#zoom/4);
        }
    }
    changeZoom(amount){
        if(this.#editMode){
        this.#desiredZoom -= amount/1000;
        }
    }
    StartEditMode(){
        this.#playMode = false;
        this.#editMode = true;
        this.#desiredZoom = 0.75;
    }
    StartPlayMode(){
        this.#playMode = true;
        this.#editMode = false;
        this.#desiredZoom = 1;
    }
}

function mouseWheel(event){
    if(cam !== undefined && editing){
    cam.changeZoom(event.delta);
    }
}