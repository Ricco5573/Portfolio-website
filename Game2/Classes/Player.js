const SHOOTING_COOLDOWN = 20;
const MELEE_COOLDOWN = 10;
const DASH_COOLDOWN = 30;
const INVULNERABILITY_COOLDOWN = 25;
class Player extends CollisionObject{
    #walkAnimBottom; //
    #walkAnimTop;
    #idleAnimBottom;
    #idleAnimTop;
    #jumpStartAnim;
    #jumpLoopAnim;
    #jumpStopAnim;
    #wallSlideAnim;
    #shootAnimTop;
    #animController;
    #reloadAnimTop;
    #jumping = false;
    #animsInitialized = false;

    #dashCooldown;

    #shootingCost;
    #shots;

    #shootingCooldown;
    #meleeCooldown;
    #invulnerabilityCooldown;
    #footstepDelay = 2000;
    #timer = 0;
    #leftFoot = false;
    #dead

    constructor (position, size, renderLayer,gravity) {
        super(position,size, renderLayer, null);
        this.velocity = createVector(0,0);
        this.acceleration = createVector(0,0);
        this.grounded = false;
        this.coyoteGrounded = 3; // Adjust for coyote time (also in collisionUpdate)
        this.checkPointCoordinates = createVector(this.position.x,this.position.y);
        this.health = 10;
        this.knockBack = createVector(15,3);
        // Jumping variables
        this.jumps = 1;
        this.jumping = false;
        this.jumpCost = 1;
        // Dashing variables
        this.dashes = 1;
        this.dashPower = createVector(10,0);
        this.dashVel = createVector(0,0);
        this.dashCost = 2;
        //Steam variables 
        this.maxSteam = 100;
        this.steam = this.maxSteam;
        

        // Cooldowns
        this.#dashCooldown = DASH_COOLDOWN;
        this.#invulnerabilityCooldown = INVULNERABILITY_COOLDOWN;
        this.#shootingCooldown = SHOOTING_COOLDOWN;
        this.#meleeCooldown = MELEE_COOLDOWN;

        //Shooting variables
        this.shooting = false;
        this.#shots = 6;
        this.#shootingCost = 2;

        // Melee Variables

        // Death
        this.#dead = false;
    }
    
    Update() {
            this.UpdateAnims();
            if(!pauzed){
            this.#collisionUpdate();
            this.#checkPointUpdate();
            this.#movementUpdate();
          //  this.#debug();
            this.#cooldownsUpdate();
            this.#coyoteUpdate();
            this.#restart();
            this.#shoot();
            this.#melee();
            }
            super.Update();
    }

    #collisionUpdate() {
    //   this.platformCollisionCheck();
    this.#platcol();
    this.#EnemyCollisionCheck();
    this.#SteamRelayCollision();
    }

    #debug() {
        push();
        translate(canvasSize.x/2 - camPos.x, canvasSize.y/2 - camPos.y);
        fill("red");
        rect(player.position.x,player.position.y,player.size.x,player.size.y);
        pop();
    }

    #platcol() {
        let ground = false;
        for (let platform of plat.platforms) {
            if (super.checkCollision(platform.position,platform.size) && platform.type != "Phasing" && platform.renderLayer >10) {
                print(this.collisionSideCheck(platform.position,platform.size,15));
                switch(this.collisionSideCheck(platform.position,platform.size,15)) {
                    case "bottom":
                        this.coyoteGrounded = 3; // Adjust for coyote time
                        ground = true;
                        this.velocity.y = 0;
                        this.acceleration.y = 0;
                        this.position.y = platform.position.y - this.size.y/2 - platform.size.y/2;
                        break;
                    case "top":
                        this.position.y = platform.position.y + platform.size.y/2 + this.size.y/2;
                        this.velocity.y = 0;  
                        break;
                    case "left":
                        this.position.x = platform.position.x + platform.size.x/2 + this.size.x/2;
                        this.dashVel.x = 0;
                        break;
                    case "right":
                        this.position.x = platform.position.x - platform.size.x/2 - this.size.x/2;
                        this.dashVel.x = 0;
                        break;
                    default: break;
                }
            }
        }
        if(!this.grounded && ground){
            PlaySound(6)
        }
        this.grounded = ground;
    }

    #checkPointUpdate() {
        if (this.grounded) {
            let coord = this.checkPointCoordinates;
            coord.x = this.position.x;
            coord.y = this.position.y;
        }
    }

    #movementUpdate() {
        //reset jumps and dashes
        if(this.grounded){
            this.jumps = 1;
            if(!keyIsDown(16)){
                this.dashes = 1;
            }
            if(this.velocity.x <= -0.1 || this.velocity.x >= 0.1){
                this.#CheckFootstep()
            }
        }

        this.#horizontalMovement();
        this.#verticalMovement();
        this.#updateVelocity();
        this.#updateAcceleration();
        this.#moveX();
        this.#moveY();
    }
    #CheckFootstep(){
        this.#timer += deltaTime;
        let delay = this.velocity.x;
        delay = abs(delay)
        if(this.#timer >= this.#footstepDelay / delay){
            if(this.#leftFoot){
                PlaySound(3)
            this.#leftFoot = false;
            }
            else{
                PlaySound(4); 
                this.#leftFoot = true; 
            }
            this.#timer = 0;
        }
    }
    #coyoteUpdate() {
        this.coyoteGrounded = constrain(this.coyoteGrounded - 1,0,10);
    }

    #cooldownsUpdate() {
        this.#shootingCooldown = constrain(this.#shootingCooldown - 1,0, SHOOTING_COOLDOWN);
        this.#meleeCooldown = constrain(this.#meleeCooldown - 1,0, MELEE_COOLDOWN);
        this.#dashCooldown = constrain(this.#dashCooldown - 1,0, DASH_COOLDOWN);
        this.#invulnerabilityCooldown = constrain(this.#invulnerabilityCooldown - 1,0, INVULNERABILITY_COOLDOWN);
    }

    #restart() {
        if(this.position.y > this.checkPointCoordinates.y +(canvasSize.y * 1.5)) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.acceleration.x = 0;
            this.acceleration.y = 0;
            this.position.x = this.checkPointCoordinates.x;
            this.position.y = this.checkPointCoordinates.y; 
            this.RemoveSteam(50);
            if(this.steam <= 0){
                this.#Death();
            }
        }
    }

    /*
    Both functions can be used externally
    Usage: Add/RemoveSteam(steam); Steam: int, however much steam you want to add or remove from the player.
    */
    RemoveSteam(steam){
        this.steam = constrain(this.steam - steam, 0,100);
        let textPos = createVector(this.position.x, this.position.y - 10);
        uiManager.AddFloatingText(textPos, -steam, color('Red'));
    }

    AddSteam(steam){
        this.steam = constrain(this.steam + steam, 0, 100);
        let textPos = createVector(this.position.x, this.position.y - 10);
        uiManager.AddFloatingText(textPos, "+" + steam, color('Green'));
    }

    GetSteam(){
        return this.steam;
    }

    #SteamRelayCollision(){
        for (let relay of mapObjects){
            if(relay.type == "SteamRelay"){
                if(relay.active && keyIsDown(69) && this.steam < 100){
                    this.AddSteam(this.maxSteam);
                }
            } else if (relay.type == "AmmoPickup" && this.#shots < 6) {
                if (this.checkCollision(relay.position,relay.size)) {
                    this.#shots = constrain(this.#shots + 2,0,6);
                    let index = mapObjects.indexOf(relay);
                    mapObjects.splice(index,1);
                }
            }
        }
    }
    #Death(){
        uiManager.AddParticles(50, createVector(this.position.x, this.position.y), color("Red"), null);   

        if(!editMode){
        // player = null;
        gameOver = true; 
         uiManager.TogglePauzeMenu()
         //SaveDeathLocations(this.position.x,this.position.y);
         this.#dead = true;
         let index = mapObjects.indexOf(this);
         mapObjects.splice(index, 1);
        }
        else{
            this.AddSteam(100);
        }
    }
    //Checks for enemy collisions. And gives the player knockback away from the enemy.
    #EnemyCollisionCheck(){
        for(let enemy of mapObjects){
            if(enemy instanceof Enemy){
            if(this.checkCollision(enemy.GetPosition(), enemy.GetSize()) && !enemy.GetDead() && this.#invulnerabilityCooldown <= 0){
                this.#invulnerabilityCooldown = INVULNERABILITY_COOLDOWN;
                //damage ig
                if(this.steam > 0){
                    let steamCost = constrain(round(random(1, 5)), 0, this.steam);
                    this.RemoveSteam(steamCost);
                } else{
                   this.#Death();
                }

                let enemyPos = enemy.GetPosition();
                this.velocity.y = -this.knockBack.y;
                this.coyoteGrounded = 0;
                this.grounded = false;

                if(this.position.x >= enemyPos.x){
                    this.velocity.x = this.knockBack.x;
                } else{
                    this.velocity.x = -this.knockBack.x;
                }
            }
        }
        else if(enemy instanceof Goal){
            //win lmao.
            if(this.checkCollision(enemy.GetPosition(), enemy.GetSize())){
            gameWon = true;
            uiManager.TogglePauzeMenu()
            }
        }
        }
    }

    #updateVelocity() {
        this.velocity.x += this.acceleration.x;
        this.velocity.y = constrain(this.velocity.y + this.acceleration.y,-50,15);
        //Lower dashVelocity
        if(this.dashVel.x != 0){
            this.dashVel.x = lerp(this.dashVel.x, 0, 0.10);
        }
    }

    #updateAcceleration() {
        this.acceleration.x = 0;

        if (!this.grounded && this.coyoteGrounded <= 0) {
            this.acceleration.y = constrain(this.acceleration.y + this.gravity,0,5);
        } else {
            this.acceleration.y = 0;
        }
    }

    UpdateAnims(){
        if(!this.#animsInitialized){
         this.#InitializeAnimationController();
        }
        if(this.#animController !== undefined){
        this.#animController.UpdateNodes();
        if(this.velocity.x <= -.5 ){
            this.#animController.Mirror(true);
            this.#animController.SetAnimSpeed(constrain(abs(this.velocity.x)/6 + abs(this.dashVel.x/4), 0.5, 4));
        }
        else if(this.velocity.x >= .5){
            this.#animController.Mirror(false);
            this.#animController.SetAnimSpeed(constrain(abs(this.velocity.x)/6 + abs(this.dashVel.x/4), 0.5, 4));

        }
        }
    }

    #moveX() {
        this.position.x += this.velocity.x + this.dashVel.x;
    }

    #moveY() {
        this.position.y += this.velocity.y;
    }

    #horizontalMovement() {
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            if (this.velocity.x > 0 && this.velocity.x < -0.1) {
                this.velocity.x *= 0.00001;
            }
            else if (this.velocity.x >= -0.1){
                this.velocity.x *= 0.95;
            }

            this.velocity.x = constrain(this.velocity.x - 0.3,-11,11)
        } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            if (this.velocity.x < 0 && this.velocity.x > 0.1) {
                this.velocity.x *= 0.00001;
            }
            else if(this.velocity.x <= 0.1){
                this.velocity.x *= 0.95;
            }


            this.velocity.x = constrain(this.velocity.x + 0.3,-11,11);
        } else {
            if (this.velocity.x < 0.001 && this.velocity.x > -0.001) {
                this.velocity.x = 0;
            }
            this.velocity.x *= 0.95

        }
        //Dashing logic.
        if(keyIsDown(16) && this.dashes > 0 && this.steam >= this.dashCost && this.#dashCooldown <= 0){
            if(this.velocity.y > 0){
                this.velocity.y = 0;
            }

            if(this.velocity.x < 0){
                this.dashVel.x += -this.dashPower.x
            }

            else {
                this.dashVel.x += this.dashPower.x
            }

            this.#dashCooldown = DASH_COOLDOWN;
            this.dashes -= 1;
            PlaySound(7);
            this.RemoveSteam(this.dashCost);
        }
        else if(this.steam < this.dashCost && keyIsDown(16) && this.dashes > 0 && this.#dashCooldown <= 0){
            this.#dashCooldown = DASH_COOLDOWN;
            let textPos = createVector(this.position.x, this.position.y - 10);
            uiManager.AddFloatingText(textPos, "NOT ENOUGH STEAM!", color("Red"));
            this.dashes -= 1;
        }
    }

    #verticalMovement() {
        if (keyIsDown(32) && this.coyoteGrounded > 0 && !this.#jumping|| keyIsDown(32) && this.jumps >=1 && !this.#jumping) {
            if(!this.grounded && this.steam >= this.jumpCost){
                //if not on the ground, use a jump, and reset the y velocity.
                if(this.velocity.y > 0){
                    this.velocity.y = 0;
                }
                this.jumps -=1;
                PlaySound(7);
                this.velocity.y -= 8;
                this.velocity.y = constrain(this.velocity.y, -8,0);
                //reset gravity acceleration.
                this.acceleration.y = 0;
                this.velocity.y = constrain(this.velocity.y, -8,0)
                this.RemoveSteam(this.jumpCost);
            }
            else if(this.grounded){
                this.velocity.y -= 8;
                this.grounded = !this.grounded;
                this.coyoteGrounded = 0;
                PlaySound(5);
            }
            else if(this.steam < this.jumpCost){
                let textPos = createVector(this.position.x, this.position.y - 10);
                uiManager.AddFloatingText(textPos, "NOT ENOUGH STEAM!", color("Red"));
            }
                
            //Avoid velocity stacking, and jumping extremely high.
            this.#jumping = true;
        }
        else if (!keyIsDown(32)){
            //wait for the player to release the jump button, before being able to jump again.
            this.#jumping = false;
        }
    }

    /* For use inside this class only
     * Shoots a bullet whenever the mouse button is pressed. */
    #shoot() {
        if (mouseIsPressed && !this.shooting && this.#shootingCooldown <= 0) {
            this.#shootingCooldown = SHOOTING_COOLDOWN;

            if (this.#shots > 0) {
                if (this.steam < this.#shootingCost) {
                    let textPos = createVector(this.position.x, this.position.y - 10);
                    uiManager.AddFloatingText(textPos, "NOT ENOUGH STEAM!", color("Red"));
                    PlaySound(10);

                } else if (this.steam >= this.#shootingCost) {
                    this.shooting = true;
                    PlaySound(9);
                    this.RemoveSteam(this.#shootingCost);
                    let pos = createVector(this.position.x, this.position.y)
                    projectiles.createProjectile(pos,createVector(mouseX,mouseY),"Bullet");
                    this.#shots = constrain(this.#shots - 1,0,6);
                }
            } else {
                let textPos = createVector(this.position.x, this.position.y - 10);
                uiManager.AddFloatingText(textPos, "NOT ENOUGH BULLETS!", color("Red"));
                PlaySound(10);

            }
        } else if (!mouseIsPressed) {
            this.shooting = false;
        }
    }

    /* For use inside this class only
     * Melee's an enemy if the distance is smaller than a certain amount.
     * Returns steam if the enemy is hit. */
    #melee() {
        if (player.#dead != true) {
            for (let enemy of mapObjects) {
                if (enemy instanceof Enemy) {
                    if (dist(player.position.x,player.position.y,enemy.position.x,enemy.position.y) < 100 && keyIsDown(69) && enemy.health > 0 && this.#meleeCooldown <= 0) {
                        this.#meleeCooldown = MELEE_COOLDOWN;
                        enemy.Damage(enemy.health);
                        this.AddSteam(10);
                    }
                }
            }
        }
    }
    
    GetDeadState() {
        return this.#dead;
    }

    GetAmmo() {
        return this.#shots;
    }

    //functions used for the animation controller.
    JumpStartTransition(){
        if(this.#jumping && !this.grounded){
            return true; 
        }
        return false;
    }

    JumpLoopTransition(){
        if(!this.#jumping && !this.grounded){
            return true;
        }
        
        return false;
    }

    JumpEndTransition(){
        if(this.grounded){
            return true;
        }
    }

    WalkTransition(){
        if(abs(this.velocity.x) >= 1 && this.grounded){
            return true; 
        }
        return false;
    }

    IdleTransition(){
        if(abs(this.velocity.x) <= 1 && this.grounded){
            return true; 
        } 
        return false;
    }

//this is kinda a mess, so i'll get it out of the way of the constructor
async #InitializeAnimationController(){
        this.#animsInitialized = true;
        //Initializing each animation, and assigning them a node.
        this.#walkAnimBottom = new Anim(this.position, await loadImage('./assets/Sprites/Player/player_run_Lower.gif'), 10, 1, null);
        this.#walkAnimTop = new Anim(this.position, await loadImage('./assets/Sprites/Player/player_run_Upper.gif'), 10, 1, null);
        let walkAnimBottomNode = new AnimationNode(this.#walkAnimBottom, true, false, null);
        let walkAnimTopNode = new AnimationNode(this.#walkAnimTop, true, true, walkAnimBottomNode);
        this.#idleAnimBottom = new Anim(this.position, await loadImage('./assets/Sprites/Player/player_idle_Lower.gif'), 10, 1, null);
        this.#idleAnimTop = new Anim(this.position, await loadImage('./assets/Sprites/Player/player_idle_Upper.gif'), 10, 1, null);
        let idleAnimBottomNode = new AnimationNode(this.#idleAnimBottom,true, false, null);
        let idleAnimTopNode = new AnimationNode(this.#idleAnimTop, true, true, idleAnimBottomNode);
        this.#jumpStopAnim = new Anim(this.position, await loadImage('./assets/Sprites/Player/player_jump_end.gif'), 10, 1, null);
        let jumpStopAnimNode = new AnimationNode(this.#jumpStopAnim,false, false, null);
        this.#jumpLoopAnim = new Anim(this.position, await loadImage('./assets/Sprites/Player/player_jump_Loop.gif'), 10, 1, null);
        let jumpLoopAnimNode = new AnimationNode(this.#jumpLoopAnim, false, false, null);
        this.#jumpStartAnim = new Anim(this.position, await loadImage('./assets/Sprites/Player/player_Jump_Start.gif'), 10, 1,this.#jumpLoopAnim);
        let jumpStartAnimNode = new AnimationNode(this.#jumpStartAnim, false, false, null);
        this.#wallSlideAnim = new Anim(this.position, await loadImage('./assets/Sprites/Player/player_wall_slide.gif'), 10, 1, null);
        let wallSlideAnimNode = new AnimationNode(this.#wallSlideAnim,false,false,null);
        this.#shootAnimTop = new Anim(this.position, await loadImage('./assets/Sprites/Player/player_shoot_Upper.gif'), 10, 1, this.#idleAnimTop);
        let shootAnimTopNode = new AnimationNode(this.#shootAnimTop, true, true, null);
        this.#reloadAnimTop = new Anim(this.position, await loadImage('./assets/Sprites/Player/player_reload_Upper.gif'), 10, 1, this.#idleAnimTop);
        let reloadAnimTopNode = new AnimationNode(this.#reloadAnimTop, true, true, null);
        
        //Initialize the transitions for each animation;
        walkAnimTopNode.AddTransition(jumpStartAnimNode, this.JumpStartTransition);
        walkAnimTopNode.AddTransition(idleAnimTopNode, this.IdleTransition);
        walkAnimTopNode.AddTransition(jumpLoopAnimNode,this.JumpLoopTransition);
        idleAnimTopNode.AddTransition(walkAnimTopNode, this.WalkTransition);
        idleAnimTopNode.AddTransition(jumpStartAnimNode, this.JumpStartTransition);
        idleAnimTopNode.AddTransition(jumpLoopAnimNode,this.JumpLoopTransition);
        jumpStartAnimNode.AddTransition(jumpLoopAnimNode, this.JumpLoopTransition);
        jumpStartAnimNode.AddTransition(jumpStopAnimNode, this.JumpEndTransition);
        jumpLoopAnimNode.AddTransition(jumpStopAnimNode, this.JumpEndTransition);
        jumpStopAnimNode.AddTransition(idleAnimTopNode, this.IdleTransition);
        jumpStopAnimNode.AddTransition(walkAnimTopNode, this.WalkTransition);
        jumpStartAnimNode.AddTransition(jumpStartAnimNode, this.JumpStartTransition);

        //initialize the actual controller, and hand it each animation;
        this.#animController = new AnimationController(this);
        this.#animController.AddNode(walkAnimTopNode, false);
        this.#animController.AddNode(idleAnimTopNode, true);
        this.#animController.AddNode(jumpStartAnimNode, false);
        this.#animController.AddNode(jumpLoopAnimNode, false);
        this.#animController.AddNode(jumpStopAnimNode, false);
}
}
