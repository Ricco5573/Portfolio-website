function PlayerSetup(){
    //Player variables
  player = null
  playerSpawnPos = createVector(canvasSize.x / 2,canvasSize.y /2);
  playerpos = createVector(0,0);
  playerSize= createVector(50, 50);


}

class Upgrade{
    constructor(name, description, func, index, path){
        this.name = name;
        this.description = description;
        this.func = func;
        this.index = index;
        this.path = path;
    }

    Trigger(){
        if(this.path != null){
            this.path.index = 0;
            upgradesList.push(this.path);
        }
        let ind = upgradesList.indexOf(this);
        upgradesList.splice(ind, 1);
        this.func();


    }
}

class Player{
    health = 3;
    moving = false;
    inVulTimer = 1;
    inVulTime = 60;
    inVul = false;
    shotCooldown = 25;
    range = 90;
    shootUpg = 0;
    shotsUpg = 0;
    damageUpg = 0;
    shotTimer = 0;
    canUp = true;
    canDown = true;
    canRight = true;
    canLeft = true;
    shots = 1;
    currentShots = 0;
    damage = 1;
    currentDamage = 0;
    upG = 0;
    turret = false;
    turret2 = false;
    turret3 = false;
    pierce = false;
    glassCannon = false;
    glass2 = false;
    glass3 = false;
    tank = false;
    momentum = false;
    momentum2 = false;
    smartBullets = false;
    splitting = false;

    killsAtLastHit = 0;
    killsSinceLastHit = 0;
    speed = 3;
    
    constructor(position, size, sprite){
        this.position = position;
        this.size = size;
        this.sprite = loadImage(sprite);
    }
    TankUpg(){
        player.upG +=1;
        player.health *=2;
        player.tank = true;
    }
    GlassUpg(){
        player.upG +=1;
        player.speed *=2;
        player.glassCannon = true;
        player.health = 1;
    }
    Glass2Upg(){
        player.upG +=1;
        player.shotCooldown /=2;
        player.glass2 = true;;
    }
    Glass3Upg(){
        player.upG +=1;
        player.shots *=2;
        player.glass3 = true;
    }
    Glass4Upg(){
        player.upG +=1;
        player.damage *=2;
    }
    shots2Upg(){
        player.upG +=1;
        player.shots +=2;
    }
    GunUpg(){
        player.upG +=1;
        player.damage *=10;
        player.speed /= 2;
    }
    TurretUpg(){
        player.upG +=1; 
        player.turret = true;
    }
    Turret2Upg(){
        player.upG +=1;
        player.turret2 = true;
        player.speed /= 2; 
    }
    Turret3Upg(){
        player.upG +=1;
        player.turret3 = true;
    }
    PierceUpg(){
        player.upG +=1;
        player.shotCooldown *=4;
        player.pierce = true;
    }
    MomentumUpg(){
        player.upG +=1;
        player.momentum = true;
    }
    Momentum2Upg(){
        player.upG +=1;
        player.momentum2 = true;
    }
    ShotgunUpg(){
        player.upG +=1;
        player.range = 20;
        player.shots += 4;
    }
    Shotgun2Upg(){
        player.upG +=1;
        player.speed /=2;
        player.damage *=2;
    }
    SniperUpg(){
        player.upG +=1;
        player.range *=2;
        player.shotCooldown *=2;
    }
    SplitUpg(){
        player.upG +=1;
        player.splitting = true;
    }
    SmartUpg(){
        player.upG+=1;
        player.smartBullets = true;
    }
    GetPosition(){
        return this.position;
    }
    GetShotUpg(){
        return this.shotsUpg;
    }
    GetShootUpg(){
        return this.shootUpg;
    }
    GetDamageUpg(){
        return this.damageUpg;
    }
    GetSize(){
        return this.size;
    }
    GetShotSpeed(){
        return this.shotCooldown;
    }
    Update(){
        this.currentDamage = this.damage;
        this.currentShots = this.shots;
        if(this.killsAtLastHit == 0){
            this.killsAtLastHit = kills;
        }
        this.killsSinceLastHit = kills - this.killsAtLastHit;
        if(this.momentum){
            this.currentDamage += floor(this.killsSinceLastHit/100);
            if(this.momentum2){
                this.currentShots += floor(this.killsSinceLastHit/200);
            }
        }
        if(!this.moving){
        if(this.turret2 ){
            this.currentShots *=2;
        }
        if(this.turret3 ){
            this.currentDamage *=2;
        }
    }
        if (this.inVul){
            this.inVulTimer += 1;
            if(this.inVulTimer >= this.inVulTime){
                this.inVul = false;
                this.inVulTimer = 0;
            }
        }
        else{
            for (let ind in enemies){
                let alien = enemies[ind];
 
                if(alien !== undefined){
                let alPos = alien.GetPosition();
                let alSize = alien.GetSize();
   

                if(this.CheckCollision(alPos,alSize)){
                    this.Death();
                }
            }
            }
        }

        for(let i = 0; i < this.health; i+=1){
        image(this.sprite, canvasSize.x - 75 + shake.x, 25 + (30 * i) + shake.y);
        }
        textAlign(TOP);
        fill("White");
        let nextUp = ((750 * pow(upG, scaleCoefficient)) - score) + 500;
        if(nextUp < 0){
            nextUp = 0;
        }
        text("Till next upgrade: " + floor(nextUp), 0 + shake.x, 75 + shake.y);
        image(damageUI, 0 + shake.x, 100 + shake.y);
        text(this.currentDamage, 25 + shake.x, 120 + shake.y);
        if(this.shotsUpg >= 4){
            fill("Purple");
        }
        image(shotsUI, 0 + shake.x, 125 + shake.y);
        text(this.currentShots, 25 + shake.x, 145 + shake.y);
        fill("White");
        if(this.shotCooldown <= 5){
            fill("Purple");
        }
        image(shootUI, 0+ shake.x, 150 + shake.y);
        text(round(player.shotCooldown / 60,2), 25 + shake.x, 170 + shake.y);
        stroke(200);
        strokeWeight(2);
        noFill();
        drawingContext.setLineDash([10,30, 20, 30]);
        let shotPosition = createVector(canvasSize.x/2 + this.size.x/2, canvasSize.y/2 + this.size.y/2);
        line(shotPosition.x, shotPosition.y, mouseX, mouseY);
        fill("black");
        drawingContext.setLineDash([0,0]);
        strokeWeight(1);
    translate(canvasSize.x /2 - this.position.x, canvasSize.y /2 - this.position.y);
    this.moving = false;
    let paraSpeed = this.speed/4;
    if(keyIsDown(65) && this.canLeft){
        this.position.x -= this.speed;
        backgroundOffset.x +=paraSpeed;
        this.moving = true;
    }
    if(keyIsDown(68) && this.canRight){
        this.position.x += this.speed;
        backgroundOffset.x -= paraSpeed;
        this.moving = true;
    }
    if(keyIsDown(87) && this.canUp){
        this.position.y -= this.speed;
        backgroundOffset.y +=paraSpeed;
        this.moving = true;
    }
    if(keyIsDown(83) && this.canDown){
        this.position.y += this.speed;
        backgroundOffset.y -=paraSpeed; 
        this.moving = true;
    }

    let shotTimer = this.shotTimer;
    if(this.tank && this.health < 3){
        shotTimer *= 1.5;
    }
    if(this.moving || !this.turret){
    //this.CheckWalls();
    if(mouseIsPressed && shotTimer > this.shotCooldown){

        for(let i = 0; i < this.shots; i+=1){
            if(player != null){
        let shotPosition = createVector(this.position.x + (this.size.x/2), this.position.y);
        let vel = null;
        if(this.shots == 1){
            vel = createVector(((canvasSize.x/2) + (this.size.x /2)) - mouseX, ((canvasSize.y/2) + (player.GetSize().y/2)) - mouseY);
        }
        else{
            vel = createVector(((canvasSize.x/2) + (this.size.x /2)) - (mouseX + (-15 * this.shots) + 50 * i) , ((canvasSize.y/2) + (player.GetSize().y/2)) - (mouseY + (-15 * this.shots) + 50 * i));
        }
        this.Shoot(shotPosition, vel, this.splitting);
    }
    }
    PlaySound("playerShoot");
    this.holdingShot = false;
    this.shotTimer = 0;
}
    }
    else if(!this.moving && this.turret){

        if(mouseIsPressed && (shotTimer*2) > this.shotCooldown){
            if(!this.turret2){
            for(let i = 0; i < this.currentShots; i+=1){
            if(player != null){
            let shotPosition = createVector(this.position.x + (this.size.x/2), this.position.y);
            let vel = null;
            if(this.shots == 1){
                vel = createVector(((canvasSize.x/2) + (this.size.x /2)) - mouseX, ((canvasSize.y/2) + (player.GetSize().y/2)) - mouseY);
            }
            else{
                vel = createVector(((canvasSize.x/2) + (this.size.x /2)) - (mouseX + (-15 * this.shots) + 50 * i) , ((canvasSize.y/2) + (player.GetSize().y/2)) - (mouseY + (-15 * this.shots) + 50 * i));
            }
            this.Shoot(shotPosition, vel, this.splitting);
        }
        }
    }
    else{
        for(let i = 0; i < this.currentShots; i+=1){
            if(player != null){
            let shotPosition = createVector(this.position.x + (this.size.x/2), this.position.y);
            let vel = null;
            if(this.shots * 2 == 1){
                vel = createVector(((canvasSize.x/2) + (this.size.x /2)) - mouseX, ((canvasSize.y/2) + (player.GetSize().y/2)) - mouseY);
            }
            else{
                vel = createVector(((canvasSize.x/2) + (this.size.x /2)) - (mouseX + (-15 * this.shots) + 50 * i) , ((canvasSize.y/2) + (player.GetSize().y/2)) - (mouseY + (-15 * this.shots) + 50 * i));
            }
            this.Shoot(shotPosition, vel, this.splitting);
        }
        }
    }
        PlaySound("playerShoot");
        this.holdingShot = false;
        this.shotTimer = 0;
    }
    }
    this.shotTimer += 1;
    image(this.sprite, this.position.x + shake.x, this.position.y + shake.y);
}

 

  Death(){  
    if(!this.inVul){
        PlaySound("playerHit");
        this.killsAtLastHit = kills;
        this.health -= 1;
        StartShake(10, 10);
        let pos = createVector(this.position.x +(this.size.x/2), this.position.y + (this.size.y /2));
        SpawnParticles(pos, random(15,25), color(99, 255, 56));

        if(this.health <= 0){
            SpawnParticles(pos, random(50,60), color(99, 255, 56));
            StartShake(15, 20);
            player = null;
            PlaySound("playerDeath");
            gameOver = true;

            delete this;
            return true;

        }
        else{
            this.inVul = true;
            return false;
            //lmao you got hit.
        }
    }
  }
  Heal(){
    if(!this.glass3){
        if(!this.tank){
            this.health +=1;
        }
        else{
            this.health +=2;
        }
    }
    this.upG +=1;
}
GetShots(){
    return this.shots;
}
  UpgradeShots(){
    this.shots +=1;
    this.shotCooldown  *=2;
    this.shotsUpg +=1;
    this.upG +=1;
  }
  UpgradeShotSpeed(){
    this.shotCooldown -= this.shotCooldown / 4;
    this.shootUpg +=1; 
    this.upG +=1; 
  }
  UpgradeDamage(){
    this.damage += 1;
    this.damageUpg +=1;
    this.upG +=1;
  }
  GetUpgrades(){
    return this.upG;
  }

 /* CheckWalls(){
    let collision = false;
        for(let ind in walls){
            let wall = walls[ind];
            let pos = wall.GetPosition();
            let wallSize = wall.GetSize();
            let x = this.position.x;
            let y = this.position.y;

            if(x + this.size.x >= pos.x && x <= pos.x + wallSize.x && 
                y <= pos.y + wallSize.y && y + this.size.y >= pos.y
            ){
                collision = true;
                if(pos.x > x){
                    this.canRight = false;
                }
                else{
                    this.canRight = true; 
                }
                if(pos.x < x){
                    this.canLeft = false;
                }
                else{
                    this.canLeft = true;
                }
                if(pos.y > y){
                    this.canDown = false
                }
                else{
                    this.canDown = true;
                }
                if(pos.y < y){
                    this.canUp = false;
                }
                else{
                    this.canUp = true;
                }

            }

        }
        if(!collision){
            this.canUp = true;
            this.canDown = true;
            this.canRight = true;
            this.canLeft = true;
        }

  } */

    CheckCollision(position, size){
        if(size.x === undefined){
            size = createVector(size, size );
        }
        let x = this.position.x;
        let y = this.position.y;
        
            if(x + this.size.x >= position.x &&
                x <= position.x + size.x &&
                y  <= position.y  + size.y &&
                y  + this.size.y >= position.y
                ){
                return true;
        }
        else{
            return false;
        }
    }
    Shoot(position, vel, splitting){
        if(playerShotCache.length > 0){
          let shot = playerShotCache[0];
          playerShotCache.shift();
          shot.SetPosition(createVector(position.x - (shot.GetSize().x/2) , position.y + 10));
          shot.SetPierce(this.pierce);
          shot.Enable(true);
          vel.normalize();
          shot.SetVelocity(vel);
          shot.SetSplitting(splitting);
          shot.SetLifetime(this.range);
          shot.SetDamage( this.currentDamage);
          shot.SetSmart(this.smartBullets);
          activeShots.push(shot);
        }
        else{
          let shot = new Projectile(cachePos, 16, true, "Shot.png", createVector(20,20), 90, createVector(0,0));
          shot.SetPosition(createVector(position.x, position.y + 10));
          shot.Enable(true);
          vel.normalize();
          shot.SetVelocity(vel);
          shot.SetLifetime(this.range);
          shot.SetDamage(this.currentDamage);
          activeShots.push(shot);
        }
    }
}

//update player positions.
async function UpdatePLayer(){
    await new Promise(resolve => {
    if(player != null){
    upG = player.GetUpgrades();
    if(score >= (750 * pow(upG, scaleCoefficient)) + 500){
        upG += 1;   
        StartUpgradeUI();
    }
    player.Update();

    }
/*
    for(let shield in shields){
      obj = shields[shield]
      obj.Update();
    }
 */
    resolve(true);
})
  }