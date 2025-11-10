class Enemy extends CollisionObject{
    moveDir = 1; //1, moves to the right, -1 moves to the left.
    moveSpeed = 0.5;
    state = 1; //state has a couple states. 1 being idle, 2 patrolling, 3 chasing.
    stateTime = 1000;
    stateTimer = 0;
    steamValue = 10;
    health = 5;
    invulFrames = 100; //the amount of time the enemy spends invulnerable to damage.
    invulTimer;
    invul = false;
    active = true;
    activeDist = canvasSize.x/2 + canvasSize.y/4;
    attackDist = 200;
    animController;
    dead;
    constructor(position, size, renderlayer){
        super(position, size, renderlayer);
        this.dead = false;
        this.description = "Basic enemy, moves left and right on platforms. will chase the player when they come in range."
    }

    Update(){
    //    print(this.dead);
    if(!pauzed){
        this.CheckActive();
        if(this.active){
            if(this.invul){
                UpdateInvul();
            }
            if(!this.dead){
      
            this.Movement();
            }
            this.Draw();
            this.UpdateState();
        }
    }
    else{
        this.Draw();
    }
        super.Update();

    }
    GetDead(){
        return this.dead;
    }
    UpdateInvul(){
        invulTimer += deltaTime;
        if(invulTimer >= invulFrames){
            invul = false;
            invulTimer = 0;
        }
    }

    UpdateState(){
        this.stateTimer += deltaTime;
        let changeDir = true;
        let playerPos = createVector(0,0);

        if(player != null){
            playerPos = player.GetPosition()
        }

        let distance = dist(this.position.x, this.position.y, playerPos.x, playerPos.y);
        if(distance <= this.attackDist){
            this.state = 3;
        }
        else if (this.state ==3){
        this.state = 1;
        }
        if(this.state != 3){
            if (this.stateTimer>= this.stateTime && this.state != 3){
                this.state = 1;
                if(this.state == 2){
                    changeDir = false;
                }
                this.state = round(random(1,2));
                if(this.state == 2 && changeDir == true){
                    let rand = round(random(0,3));
                    if(rand = 0){
                        this.moveDir *= -1;
                    }
                }
                this.stateTimer = 0;
            }
        }
    }

    CheckActive(){
        if(player != null){
            let playerPos = player.GetPosition();
        let distance = dist(this.position.x, this.position.y, playerPos.x, playerPos.y);
        if(distance <= this.activeDist && !this.active){
            this.active = true;
        }
        else if(distance > this.activeDist && this.active){
            this.active = false;
        }
    }
    }

    /*This is a function that should be externally used
        Usage: Damage(damage, melee); with damage being a number of HP they lose
        and melee being a boolean to indicate whether or not the player should receive steam from its death.
    */
    Damage(damage, melee){
        if(!this.invul){
            this.health -= damage;
            let giveSteam = false;

            if(melee){
                giveSteam = true;
            }

            if(this.health <= 0){
                this.Death(giveSteam);
            }
        }
    }

    //To be expanded upon later, after the steam mechanic is added.
    Death(giveSteam){
        if(!this.dead){
         if(giveSteam){
            //give player steam back
        }
        //death
        uiManager.AddParticles(50, createVector(this.position.x, this.position.y), color("Red"), null);
        let index = enemies.indexOf(this);
     //   print(index);
        mapObjects.push(new bulletPickup(createVector(this.position.x,this.position.y), createVector(32,64),5, sprites[8],"AmmoPickup"));
        this.dead = true;
        enemies.splice(index,0);    
    }
    }


    Draw(){
        this.animController.Mirror(this.moveDir!=1);
        this.animController.UpdateNodes()
    }
    //Handles movement
    Movement(){
        let platform = this.CheckPlatform();

        if(this.state == 2){
            if(!platform){
                this.moveDir *= -1;
            }
            this.position.x += this.moveSpeed * this.moveDir;

        }
        else if(this.state == 3 && player != null){
            let playerPos = player.GetPosition();
            if(playerPos.x <= this.position.x){
                this.moveDir = -1;
            }
            else{
                this.moveDir = 1;
            }
            if(platform){
                this.position.x += (this.moveSpeed *2.5) * this.moveDir;

            }

        }

    }

    //Checks for platforms. If no platforms are found, returns false;
    CheckPlatform(){
        let collisionPos = createVector(this.position.x + (((this.size.x/2) + 5) * this.moveDir), (this.position.y + 10) + this.size.y/2);
        let collision = false;
        for(let platform of plat.platforms){
            let hit = platform.checkCollision(collisionPos, createVector(5,5));
            if(hit){
                return true;
            }
        }
        return false;
    }

}

class ChaseEnemy extends Enemy{
    #idleAnim;
    #walkAnim;
    #attackAnim;
    #deathAnim;
    #hurtAnim;
    #deadAnim;
    #currentHealth;
constructor(position, size, renderlayer){
    super(position, size, renderlayer)
    this.#idleAnim = loadImage('./assets/Sprites/Enemies/Spider_Idle.gif');
    this.#hurtAnim = loadImage('./assets/Sprites/Enemies/Spider_Hurt.gif');
    this.#walkAnim = loadImage('./assets/Sprites/Enemies/Spider_Walk.gif');
    this.#attackAnim = loadImage('./assets/Sprites/Enemies/Spider_Attack.gif');
    this.#deathAnim = loadImage('./assets/Sprites/Enemies/Spider_Death.gif');
    this.#deadAnim = loadImage('./assets/Sprites/Enemies/Spider_Dead.gif');
    this.InitializeAnimationController();
    this.#currentHealth = this.health;
}

    //Partial override, Chases player upon entering the 3rd state.
    Movement(){
        super.Movement();
        
     if(this.state == 3 && player != null){
        let platform = this.CheckPlatform();
            let playerPos = player.GetPosition();
            if(playerPos.x <= this.position.x){
                this.moveDir = -1;
            }
            else{
                this.moveDir = 1;
            }
            if(platform){
                this.position.x += this.moveSpeed * this.moveDir;

            }

        }
    }
    IdleTransition(){
        if(this.state == 1){
            return true;
        }
        return false;
    }
    WalkTransition(){
        if(this.state == 2 || this.state == 3){
            return true;
        }
        return false;
    }
    AttackTransition(){
       if(player !== null){ let playerPos = player.GetPosition();
        let distance = dist(this.position.x, this.position.y, playerPos.x, playerPos.y);
        if(this.state == 3 && dist <= this.size.x * 1.5){
            return true;
        }
    }
        return false;
    }
    DeathTransition(){
        if(this.health <= 0){
            return true;
        }
        return false;
    }
    HurtTransition(){
        if(this.#currentHealth != this.health){
            this.#currentHealth = this.health;
            return true;
        }
        return false;
    }
    DeadTransition(){
        this.dead = true; 
    //    print("DEAD");
        return true 
    }
    InitializeAnimationController(){
        let idleAnim = new Anim(this.position, this.#idleAnim, 9, 1, null);
        let idleAnimNode = new AnimationNode(idleAnim, false, false, null);
        let hurtAnim = new Anim(this.position, this.#hurtAnim, 9, 1, null);
        let hurtAnimNode = new AnimationNode(hurtAnim, false, false, null);
        let attackAnim = new Anim(this.position, this.#attackAnim, 9, 1, null);
        let attackAnimNode = new AnimationNode(attackAnim, false, false, null);
        let walkAnim = new Anim(this.position, this.#walkAnim, 9, 1, null);
        let walkAnimNode = new AnimationNode(walkAnim, false, false, null);
        let deathAnim = new Anim(this.position, this.#deathAnim, 9, 1, null);
        let deathAnimNode = new AnimationNode(deathAnim, false, false, null);
        let deadAnim = new Anim(this.position, this.#deadAnim, 9, 1, null);
        let deadAnimNode = new AnimationNode(deadAnim, false, false, null)

        idleAnimNode.AddTransition(walkAnimNode, this.WalkTransition);
        idleAnimNode.AddTransition(deathAnimNode, this.DeathTransition);
        idleAnimNode.AddTransition(hurtAnimNode, this.HurtTransition);
        hurtAnimNode.TransitionOnEnd(true);
        hurtAnimNode.AddTransition(idleAnimNode, this.IdleTransition);
        hurtAnimNode.AddTransition(walkAnimNode, this.WalkTransition);
        hurtAnimNode.AddTransition(deathAnimNode, this.DeathTransition);
        attackAnimNode.TransitionOnEnd(true);
        attackAnimNode.AddTransition(idleAnimNode, this.IdleTransition);
        attackAnimNode.AddTransition(hurtAnimNode, this.HurtTransition);
        attackAnimNode.AddTransition(walkAnimNode, this.WalkTransition);
        attackAnimNode.AddTransition(deathAnimNode, this.DeathTransition);
        walkAnimNode.AddTransition(idleAnimNode, this.IdleTransition);
        walkAnimNode.AddTransition(hurtAnimNode, this.HurtTransition);
        walkAnimNode.AddTransition(attackAnimNode, this.AttackTransition);
        walkAnimNode.AddTransition(deathAnimNode, this.DeathTransition);
        deathAnimNode.TransitionOnEnd(true);
        deathAnimNode.AddTransition(deadAnimNode, this.DeadTransition);

        this.animController = new AnimationController(this);
        this.animController.AddNode(idleAnimNode, true);
        this.animController.AddNode(hurtAnimNode, false);
        this.animController.AddNode(attackAnimNode, false);
        this.animController.AddNode(walkAnimNode, false);
        this.animController.AddNode(deathAnimNode, false);

    }
}