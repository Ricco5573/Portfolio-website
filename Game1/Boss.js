class Boss extends HittableObject{
    started = false;
    percentageHealth = 0;
    shotCooldown = 20;
    shotTimer = 0;
    phase = 0;
    roar = false;
    shots = 6;
    constructor(position, size, points, speed, health, sprite){
        super(position, size, points, speed, health);
        this.sprite = sprite;
        this.maxHealth = health;
    }

    GetPercentageHealth(){
        return this.percentageHealth;
    }
    Update(){
        if(!this.started){
            this.StartUp();
        }
        strokeWeight(2);
        drawingContext.setLineDash([5,25,5,25]);
        let fillTo = lerp(50, canvasSize.x - 50, this.percentageHealth/100);
        let offset = createVector((player.GetPosition().x - canvasSize.x/2) + shake.x, (player.GetPosition().y - canvasSize.y/2) + shake.y);
        line(this.position.x + this.size/2, this.position.y + this.size/2, player.GetPosition().x + player.GetSize().x/2, player.GetPosition().y + player.GetSize().y/2);
        
        stroke('Red');
        strokeWeight(15);
        drawingContext.setLineDash([0,0]);
        image(this.sprite, this.position.x + shake.x, this.position.y + shake.y);
        line( offset.x + 100 ,offset.y  + 10, offset.x + fillTo, offset.y + 10);
        stroke('Red');
        strokeWeight(1);
        fill("White");
        text("The destroyer", offset.x +canvasSize.y, offset.y + 50);

        if(this.phase == 1 && this.started){
            this.Phase1();

        }
        else if (this.phase == 2){
            this.Phase2();

        }
        else if (this.phase >= 3){
            this.Phase3();

        }
        if(!bossBeat){

        }
        stroke("Black");
        strokeWeight(5);
        if(player != null){
            let vel = createVector(player.GetPosition().x - (this.size/2), (player.GetPosition.y - canvasSize.y/2) - this.size/2);
            vel.sub(this.position);
            vel.normalize();
            this.position.x += this.speed * vel.x;
            this.position.y += this.speed * vel.y;
            if(this.invul){
                this.invulTimer +=1;
                if(this.invulTimer>= this.invulTime){
                    this.invul = false;
                    this.invulTimer = 0;
                }
            }
        }
    }

    Shoot(){
        if(this.shotTimer >= this.shotCooldown){
        for(let i = 0; i <= this.shots; i+=1){
            let shot = new Projectile(cachePos, 4, false, "EnemyShot.png", createVector(20,20), 400);
            shot.SetPosition(createVector(this.position.x + this.size/2, this.position.y + this.size/2));
            shot.Enable(true);
            let vel = createVector(cos(frameCount *i), sin(frameCount * i )
        );
            vel.normalize();
            shot.SetVelocity(vel);
            activeEnemyShots.push(shot);
        }
        this.shotTimer = 0;
    }
    this.shotTimer +=1;
    }
    Phase1(){
        this.percentageHealth = (this.health / this.maxHealth) * 100;
        this.Shoot();
        print(this.health + " " +  this.maxHealth * 0.75);
        if(this.health < this.maxHealth * 0.75){
            this.phase +=1;
            print("Phase transition");
            this.roar = false;
        }

    }
    Phase2(){
        if(!this.roar && !bossBeat){

            StartShake(5, 120);
            this.roar = true;
        }
        this.percentageHealth = (this.health / this.maxHealth) * 100;
        this.Shoot();
        this.shotCooldown = 15;
        if(this.health <= this.maxHealth * 0.5){
            this.phase +=1;
            this.roar = false;
        }
    }
    Phase3(){
        if(!this.roar&& !bossBeat){
            StartShake(5, 180);
            this.roar = true;
        }
        this.percentageHealth = (this.health / this.maxHealth) * 100;
        this.Shoot();
        this.shots = 12;
        if(this.health <= this.maxHealth * 0.25){
            this.phase +=1;
        }

    }
    Phase4(){
        if(!this.roar && !bossBeat){
            StartShake(5, 180);
            this.roar = true;
        }
        this.percentageHealth = (this.health / this.maxHealth) * 100;
        this.Shoot();
        this.shots = 18;
        if(this.health <= this.maxHealth * 0.25){
            this.phase +=1;
        }
        text("The destroyer, phase 4", offset.x +canvasSize.y/2, offset.y + 50);

    }
    StartUp(){
        //start boss fight.
        if(this.percentageHealth < (this.health / this.maxHealth) * 100){
            this.percentageHealth +=1;
        }
        else{
            this.started = true;
            this.phase = 1;
            if(!bossBeat){
            StartShake(5, 120);
            bossActive = true;
            StartBossMusic();
            }
            this.roar = true;
        }

    }
    CheckCollision(position, size, damage){
       let hit = super.CheckCollision(position, size, damage);
        if(hit){
            StartShake(random(1,2), random(3,6));
            let particlePos = createVector(this.position.x + (this.size /2), this.position.y + (this.size/2));
            SpawnParticles(particlePos, random(2,5), color(255, 51, 51));
            if(this.health <= 1){
                bossActive = false;
                if(!bossBeat){
                    GameWin();
                }
                bossBeat = true;
            }
            return true;
        }
    }

}