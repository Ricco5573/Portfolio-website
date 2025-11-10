class UIManager{
    #floatingText;
    #particles;
    #steamPos;
    #bulletsPos;
    #uiButtons = [];
    #mainMenuButtons = [];
    #levelButtons = [];
    #UIState = "Menu";
    #pauzeMenuButtons = [];
    constructor(){
        this.#floatingText = [];
        this.#particles = [];
        this.#steamPos = createVector(50,50);
        this.#bulletsPos = createVector(this.#steamPos.x + 25, this.#steamPos.y +25 );
    }

    UpdateUI(){
        this.#UpdateFloatingText();
        this.#UpdateParticles();
        pop();
        if(this.#UIState == "PauzeMenu" || this.#UIState == "GameOver"){
            this.#UpdatePauzeMenu();
        }
        this.#UpdateSteam()
        this.#UpdateBullets();
    }
    TogglePauzeMenu(){
        if(this.#pauzeMenuButtons.length == 0){
            let index = 0;
            let MainMenuButton = new TextButton(createVector(canvasSize.x/2, canvasSize.y * 0.2 + 100 * index), createVector(250, 90), 15, LoadMainMenu, "Main menu");
            index +=1;
            if(editMode){
                let SaveMap = new TextButton(createVector(canvasSize.x/2, canvasSize.y * 0.2 + 100 * index), createVector(250, 90), 15, SaveCurrentMap, "Save Map");
                this.#pauzeMenuButtons.push(SaveMap);
            }
            this.#pauzeMenuButtons.push(MainMenuButton);
        }
        if(this.#UIState == "PauzeMenu"){
            this.#UIState = "Edit LevelSelect";
        }
        else{
            this.#UIState = "PauzeMenu";
        }
        pauzed = !pauzed;

    }

    #DeathScreen(){
        this.#UpdatePauzeMenu();
    }
    #UpdatePauzeMenu(){
        let index = 0;
        for(let button of this.#pauzeMenuButtons){
            if(gameOver){
                push();
                textSize(50)
                textFont(titleFont);
                text("Game Over!", adjusted0Pos.x + canvasSize.x/2, adjusted0Pos.y + canvasSize.y * 0.1);
                index +=1;
                pop();
            }
            else if (gameWon && !editMode){
                push();
                textSize(50)
                textFont(titleFont);
                text("You win!", adjusted0Pos.x + canvasSize.x/2, adjusted0Pos.y + canvasSize.y * 0.1);
                index +=1;
                pop();
            }
            button.position = createVector(adjusted0Pos.x + canvasSize.x *0.5, adjusted0Pos.y + 50 + (150 *index))
            button.Update();
            button.checkCollision(createVector(mouseX + adjusted0Pos.x,mouseY + adjusted0Pos.y), createVector(1,1));
            index +=1;
        }
    }
    AddUIButton(button){
        this.#uiButtons.push(button);
    }
    RemoveUIButton(button){
        let index = this.#uiButtons.indexOf(button);
        this.#uiButtons.splice(index,1);
    }

    #UpdateSteam(){
        let steam = 0;
        let maxSteam = 0;
        let camPos = cam.GetPosition();
        if(player != null){
            steam = player.GetSteam();
            maxSteam = player.maxSteam;
        }
        fill("Grey");
        stroke("Black"); 
        text(steam + " / " + maxSteam, 50 +(camPos.x - canvasSize.x/2) ,50 +(camPos.y - canvasSize.y/2)); 
        fill("Grey");
        stroke(0);
    }

    #UpdateBullets() {
        let ammo = player.GetAmmo();
        let cameraPosition = cam.GetPosition();

        for (let i = 0; i < ammo; i++) {
            circle(10 + cameraPosition.x - canvasSize.x/2,200 + 25 * i + cameraPosition.y - canvasSize.y/2,10)
        }
    }

    #UpdateParticles(){
        for(let particle of this.#particles){
            particle.Update();
        }
    }
    #UpdateFloatingText(){
        for(let text of this.#floatingText){
            text.Update();
        }
    }
    ShowEditingUI(){
        if(this.#UIState == "Edit LevelSelect"){
        let camPos = cam.GetPosition();
        let zoom = cam.GetZoom();
        let startPos = createVector(-100000, -100000);
        let tileSize = createVector(32,32);
        let index = 0;
        textAlign(CORNERS);
        fill("White")


        if(this.#uiButtons.length <= 0){
            let img;
            for (let object of editeableObjects){
                switch(object){
                    case Platform: img = []; for (let i = 21; i <= sprites.length; i+=1){
                        img.push(sprites[i]);
                    } break;
                    case MovingPlatform: img = []; for (let i = 21; i <= sprites.length; i+=1){
                        img.push(sprites[i]);
                    } break;
                    case SteamRelay: img = sprites[7]; break;
                    case StaticDecor: img = []; for (let i = 0; i <= 20; i+=1){
                        img.push(sprites[i]);
                    }
                    break;
                    case ChaseEnemy: img = loadImage("./assets/Sprites/Enemies/Spider_Idle.gif"); break;
                }
                let button;
                if(object == Platform || object == MovingPlatform || object == StaticDecor){
                    button =  new BuildButton(createVector(canvasSize.x * 0.95 + (camPos.x - canvasSize.x/2), (64 *(index + 0.3)) + camPos.y - canvasSize.y/2), createVector(64,64), 20, null, SelectObject, object, img);
                }
                else{
                    button =  new BuildButton(createVector(canvasSize.x * 0.95 + (camPos.x - canvasSize.x/2), (64 *(index + 0.3)) + camPos.y - canvasSize.y/2), createVector(64,64), 20, img, SelectObject, object);
                }
                fill("Black");
                index +=1;
                this.#uiButtons.push(button);
             }
        }

        strokeWeight(1);
        stroke("Grey");
        for (let x = 0; x <= (-startPos.x *2) / tileSize.x; x +=1){
            line(startPos.x  + (tileSize.x/2) + (tileSize.x * x), 
            startPos.y,
            startPos.x  + (tileSize.x/2) + (tileSize.x * x),
            -startPos.y);
        }
        for (let y = 0; y <= (-startPos.y *2)/ tileSize.y; y+=1){
            line(startPos.x, 
                startPos.y + (tileSize.y/2)+ (tileSize.y * y),
                -startPos.x,
                startPos.y + (tileSize.y/2)+ (tileSize.y * y))
        }
        text()
        stroke("Green");
        strokeWeight(2);
        for (let platform of plat.platforms){
            if(platform instanceof MovingPlatform){
                line(platform.firstPosition.x, platform.firstPosition.y,
                    platform.secondPosition.x, platform.secondPosition.y
                );
            }
        }
        pop();
        text("move camera: WASD", adjusted0Pos.x + 90, adjusted0Pos.y + 15);
        text("Zoom: Mouswheel", adjusted0Pos.x + 90, adjusted0Pos.y +30)
        text("Toggle play mode: B", adjusted0Pos.x+90 , adjusted0Pos.y +45)
        text("Lower/higher renderLayer: Q/E", adjusted0Pos.x+105, adjusted0Pos.y + 60)
        text("Move player to camera: P", adjusted0Pos.x+90, adjusted0Pos.y + 75)
        text("Place object: LMB", adjusted0Pos.x+90, adjusted0Pos.y + 90)
        text("Remove object: R", adjusted0Pos.x+90, adjusted0Pos.y + 105)
        text("Drop object: RMB", adjusted0Pos.x+90, adjusted0Pos.y + 120)

        fill("Grey");
        square(canvasSize.x * 0.6 + camPos.x, 0 + camPos.y, canvasSize.y);
        index = 0;

        for(let button of this.#uiButtons){
        button.position = createVector(canvasSize.x * 0.95 + (camPos.x - canvasSize.x/2), (64 *(index + 0.75)) + camPos.y - canvasSize.y/2);
        button.checkCollision(createVector(mouseX + (camPos.x-canvasSize.x/2), mouseY + (camPos.y - canvasSize.y/2)), createVector(1,1));
        button.Update();
        index +=1;

        }

    }
    if(this.#UIState == "PauzeMenu"){
        this.#UpdatePauzeMenu();
    }
    }
    ClickUiButton(){
        for(let button of this.#uiButtons){
            button.Press();
        }
        if(state == "Main Menu"){
            if(this.#UIState == "Menu"){
            for(let button of this.#mainMenuButtons){
                button.Press();
            }
        }
        else if(this.#UIState === "LevelSelect" || this.#UIState ==="Edit LevelSelect"){
            for(let button of this.#levelButtons){
                button.Press();
            }
        }
        }
        if(state == "Play"){
            if(this.#UIState == "PauzeMenu"){
                for(let button of this.#pauzeMenuButtons){
                    button.Press();

                }
            }
        }
    }
    /* This function should be called externally
    usage: AddFloatingText(position, value, color); position: Vector2, position the text should be spawned in
        value: string, what the text should say. color: color, what color the text should be.
    */
    AddFloatingText(position, value, color){
        this.#floatingText.push(new FloatingText(position,value,color, 0.2));
    }
    /* this function should be called by the text to delete itself.
    usage: RemoveFloatingText(text); text: reference to the object that should be deleted.
    */
    RemoveFloatingText(text){
        let index = this.#floatingText.indexOf(text);
        this.#floatingText.splice(index,0);
    }
    /* this function should be called externally
    usage: AddParticles(amount, position, color, img); amount: int, how many particles should be spawned
    position: vector2, position of the particles. color(optional): color, what color the particle should be.
    img(optional): image, the sprite for the particle, should be left null if no sprite exists.
    */
    AddParticles(amount, position, color, img){
        for(let i = 0; i <= amount; i+=1){
            let spawnPos = createVector(position.x + random(-1,1), position.y + random(-1,1));

            this.#particles.push(new Particle(spawnPos, color, img));
        }
    }
    /*this function should be called by the particles to delete themselves.
    usage RemoveParticle(particle); particle: reference to the object that should be deleted.
    */
    RemoveParticle(particle){
        let index = this.#particles.indexOf(particle);
        this.#particles.splice(index,0)
    }
    ChangeUIState(state){
        this.#UIState = state;
        if(state == "Menu"){
            baseMapLoaded = false;
        }
    }
    UpdateMainMenu(){
        textAlign(CENTER);
        if(this.#UIState === "Menu"){
        if(this.#mainMenuButtons.length == 0){
            let startButton = new TextButton(createVector(canvasSize.x/2, canvasSize.y *0.2), createVector(150, 40), 15, StartMainGame, "Play");
            let loadButton = new TextButton(createVector(canvasSize.x/2, canvasSize.y *0.2 + 60), createVector(150, 40), 15, LoadLevelCaller, "Play Custom level");
            let editButton = new TextButton(createVector(canvasSize.x/2, canvasSize.y *0.2 + 120), createVector(150, 40, 15 ),15,LoadEditLevels, "Level Editor" );
            this.#mainMenuButtons.push(startButton);
            this.#mainMenuButtons.push(loadButton);
            this.#mainMenuButtons.push(editButton);
        }
        for(let button of this.#mainMenuButtons){
            button.Update();
            button.checkCollision(createVector(mouseX,mouseY), createVector(1,1));
        }
        this.#pauzeMenuButtons.length = 0;
        this.#levelButtons.length= 0
        pauzed = false;
        gameOver = false;
    }
    else if(this.#UIState === "LevelSelect" || this.#UIState === "Edit LevelSelect"){
        if(this.#levelButtons.length < loadedLevels.length || this.#levelButtons.length == 0){
            this.#levelButtons = [];
            let index = 0;
            editing = false;
            if(this.#UIState === "Edit LevelSelect"){
            editing = true;
            let button = new TextButton(createVector(canvasSize.x/2, canvasSize.y *0.2),createVector(150,40), 15, CreateEmptyLevel, "Create empty level");
            this.#levelButtons.push(button);
            index +=1;
            }

            for(let level of loadedLevels){
                if(level.MapId != 1){
                let button = new LevelButton(createVector(canvasSize.x/2, canvasSize.y *0.2 + 60*index), createVector(150, 40), 15, LoadMapFromJSON, level.MapName, level.MapId);
                this.#levelButtons.push(button);
                index +=1;
                }
            }
        }
        for(let button of this.#levelButtons){
            button.Update();
            button.checkCollision(createVector(mouseX,mouseY), createVector(1,1));
        }
    }
}
}

class FloatingText{
    constructor(position, value, color, speed){
        this.position = position;
        this.value = value;
        this.color = color;
        this.speed = speed;
        this.duration = 5000;
        this.time = 0;
        this.fadeSpeed = 2.5;
        this.fade = 255;
    }

    Update(){
        this.position.y -= this.speed
        this.color.setAlpha(this.fade);
        noStroke();
        fill(this.color);
        this.fade -= this.fadeSpeed;
        text(this.value, this.position.x, this.position.y);
        this.time += deltaTime;
        if(this.time >= this.duration){
            uiManager.RemoveFloatingText(this);
        }
    }
}

class Particle{
    constructor(position, color, img){
        this.position = position;
        this.color = color;
        this.img = img;
        this.velocity = createVector(random(-1,1), random(-1,1));
        this.alpha = 255;
        this.fade = 2;
        this.duration = 4000;
        this.time = 0;
    }

    Update(){
        this.time += deltaTime;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.color.setAlpha(this.alpha);
        this.alpha -= this.fade;
        fill(this.color);   
        if(this.img == null){
            circle(this.position.x, this.position.y, 5);
        }
        else{
            image(this.img, this.position.x, this.position.y);
        }
        if(this.time >= this.duration){
            uiManager.RemoveParticle(this);
        }
    }
}