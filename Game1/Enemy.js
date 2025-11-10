function EnemySetup(){
    //enemy variables
  moveTimer = 0;
  moveDelay = 120; 
  enemyRight = true;
  enemyMoveSpeedX = 25;
  enemyMoveSpeedY = 50;
  enemySize = 20;
  enemies = [];
  enemyTypes = 3;
  enemyMove = createVector(0,0);
  spawnpos = createVector(canvasSize.x / 4, canvasSize.y / 30 );
  alienSpawnSize = createVector(3,5);
  ufo = null;
  enemy1 = loadImage("Enemy1.png");
  enemy2 = loadImage("Enemy2.png");
  enemy3 = loadImage("Enemy3.png");

  bossImg = loadImage("Boss.png");
  bossActive = false;
  bossBeat = false;
  spawnPoints = 0;
  dT = 0;
  spawnScale = 0;
  gameWin = false;


}

class HittableObject{

    invulTime = 25;
    invul = false;
    invulTimer = 0;
    treeLayer = [];
    constructor(position, size, points, speed, health){
        this.position = position;
        this.size = size;
        this.points = points;
        this.position = createVector(this.position.x - (this.size/2), this.position.y - (this.size/2));
        this.speed = speed;
        this.health = health;
    }
    CheckCollision(position, size, damage){
        let x = this.position.x;
        let y = this.position.y;
        
            if(x + this.size >= position.x &&
                x <= position.x + size.x &&
                y + this.size >= position.y &&
                y <= position.y + size.y && !this.invul
                ){
                    this.health -= damage;
                    if(this.health <= 1){
                    score += this.points;
                    kills +=1;
                    this.invul = true;
                }
                return true;
        }
        else{
            return false;
        }

            //collision for squares
    }
    SetTreeLayer(layer){
        this.treeLayer = layer;
    }
    GetHealth(){
        return this.health;
    }
    Update(){
        if(player != null){
        let playerdir = player.GetPosition();
        let avoidanceForce = createVector(0,0);
        for(let index in this.treeLayer){
            let enemy = this.treeLayer[index];
            if(enemy != this){ 
            let enemyPos = enemy.position;
            let distance = dist(this.position.x, this.position.y, enemyPos.x, enemyPos.y);
            if(distance <= this.size * 1.2){
                let vel = createVector(enemyPos.x, enemyPos.y);
                vel.sub(this.position);
                vel.normalize();
                avoidanceForce.add(vel.div(4));
            }
    }
        } 
        let vel = createVector(playerdir.x, playerdir.y);
        let rand = createVector(random(0,1), random(0,1 ));
        rand.normalize();
        vel.sub(this.position);
        vel.add(rand);
        vel.normalize();
        vel.sub(avoidanceForce);
        this.position.x += this.speed * vel.x;
        this.position.y += this.speed * vel.y;
        }
        if(this.invul){
            this.invulTimer +=1;
            if(this.invulTimer>= this.invulTime){
                this.invul = false;
                this.invulTimer = 0;
            }
        }
    }
    GetPosition(){
        return this.position;
    }
    SetPosition(position){
        this.position = position;
    }
    GetSize(){
        return this.size;
    }
}


class Enemy1 extends HittableObject {
    size = 25;
    constructor(position, score, sprite, speed, health){
        super(position, 25, score, speed, health);
        this.sprite = sprite;
        this.speed = speed;
        this.invulTime = 5;
    }

   //Update is called every frame.
    Update(){
        super.Update();
        if(player != null){
            let playerposition = player.GetPosition();
            if(this.position.x +shake.x < playerposition.x + canvasSize.x/2 + 15 && this.position.x +shake.x > playerposition.x - canvasSize.x/2 - 15 &&
            this.position.y + shake.y < playerposition.y + canvasSize.y/2 + 15 && this.position.y + shake.y > playerposition.y - canvasSize.y/2 -15){

            image(this.sprite, this.position.x + shake.x, this.position.y + shake.y);

            }
        }
    }
    CheckCollision(position, size, damage){
        let hit = super.CheckCollision(position, size, damage);
        if(hit){
            PlaySound("alienDeath");
            StartShake(random(1,2), random(3,6));
            let particlePos = createVector(this.position.x + (this.size /2), this.position.y + (this.size/2));
            SpawnParticles(particlePos, random(3,5), color(255, 51, 51));
            this.invul = true;
            return true;
        }
        else{
            return false;
        }

    }
}

class Enemy2 extends HittableObject{
    size = 25;
    constructor(position, score, sprite, speed,health){
        super(position, 25, score, speed,health);
        this.sprite = sprite;
        this.invulTime = 5;

    }
    Update(){
        super.Update();
        if(player != null){
            let playerposition = player.GetPosition();
            if(this.position.x +shake.x < playerposition.x + canvasSize.x/2 + 5 && this.position.x +shake.x > playerposition.x - canvasSize.x/2 - 5 &&
            this.position.y + shake.y < playerposition.y + canvasSize.y/2 + 5 && this.position.y + shake.y > playerposition.y - canvasSize.y/2 - 5){
            image(this.sprite, this.position.x + shake.x, this.position.y + shake.y);
            }
        }
    }   

    CheckCollision(position, size, damage){
        let hit = super.CheckCollision(position, size, damage);
        if(hit){
            PlaySound("alienDeath2");
            StartShake(random(1,2), random(5,7));
            let particlePos = createVector(this.position.x + (this.size /2), this.position.y + (this.size/2));
            SpawnParticles(particlePos, random(5,10), color(24, 114, 184));
            this.invul = true;

            return true;
        }
        else{
            return false;
        }

    }
}
class Enemy3 extends HittableObject{
    size = 50;
    frameCounter = 0;
    shotDelay = 90;

    constructor(position,score, sprite, speed,health){
        super(position, 50, score, speed,health);
        this.sprite = sprite;

        this.invulTime = 5;
    }
    Update(){
        super.Update();
        if(player != null){
        let playerposition = player.GetPosition();
        if(this.position.x +shake.x < playerposition.x + canvasSize.x/2 + 5 && this.position.x +shake.x > playerposition.x - canvasSize.x/2 - 5 &&
        this.position.y + shake.y < playerposition.y + canvasSize.y/2 + 5 && this.position.y + shake.y > playerposition.y - canvasSize.y/2 - 5){
        image(this.sprite, this.position.x + shake.x, this.position.y + shake.y);
        }
    }
        this.Shoot();
    }

    Shoot(){

            this.frameCounter +=1;

            if( this.frameCounter >= this.shotDelay){
                this.startFrame = 0;
                this.frameCounter = 0;
                let shootPos = createVector(this.position.x + (this.size /2), this.position.y + 1);
                PlaySound()
                if(player != null ){
                EnemyShoot(shootPos);
                }   
        
        //random increasing chance to shoot between frames 120 and 250.
        //frame 121 has a 1% chance to shoot, and 250 a 100% chance.

        }

    }
    CheckCollision(position, size, damage){
        let hit = super.CheckCollision(position, size, damage);
        if(hit){
            if(this.health >= 1){
            PlaySound("alienDeath3");
            }
            else{
                PlaySound("ufoDeath");
            }

            StartShake(random(3,5), random(7,15));
            let particlePos = createVector(this.position.x + (this.size /2), this.position.y + (this.size/2));
            SpawnParticles(particlePos, random(10,15), color(24, 114, 184));
            this.invul = true;
            return true;
        }
        else{
            return false;
        }

    }
}


//update enemy positions
async function UpdateEnemies(){
    qt.Update();
    drawingContext.setLineDash([0,0]);
    dT += deltaTime;
    //for(let wall in walls){
   //   walls[wall].Update();
    //}
    await new Promise(resolve => {
    if(dT > 2000){
      if(!bossActive){
        if(!player.glass2){
      spawnPoints += 4 + (score/400);
        }
        else{
      spawnPoints += 4 + (score/200);
            
        }
      SpawnEnemies();

      }
      spawnScale += 1;
      dT = 0;   
    }
    //run through all the enemies, and render them. and check if they've hit the border.
      for(let alien of enemies){
        if(alien !== undefined){
        alien.Update();
        }
      }
      resolve(true);
    });
  }
  
  
  //Shoots an enemy projectile
  function EnemyShoot(position){
    if(enemyShotCache.length > 0){
      let shot = enemyShotCache[0];
      enemyShotCache.shift();
      shot.SetPosition(position);
      shot.Enable(true);
      let vel = createVector(position.x - player.GetPosition().x, position.y - player.GetPosition().y);
      vel.normalize();
      shot.SetVelocity(vel);
      activeEnemyShots.push(shot);
    }
    else{
      let shot = new Projectile(cachePos, 6, false, "EnemyShot.png", createVector(20,20), 360);
      shot.SetPosition(position);
      shot.Enable(true);
      let vel = createVector(position.x - player.GetPosition().x, position.y - player.GetPosition().y);
      vel.normalize();
      shot.SetVelocity(vel);
      activeEnemyShots.push(shot);
    }
  }


//spawn enemies
function SpawnEnemies(){
    let spawning = true;
    if(enemies.length > 300){
        spawning = false; 
    }
    let spawn;
    if(score <= 500){
        spawn = 1;
    }
    else if(score <= 2000){
        spawn = random(1,2);
    }
    else{
        spawn = random(1,6);
    }
    spawn = round(spawn);
    while(spawnPoints >= 3 && player !== undefined && player != null && spawning && !gameOver){
      let alien;
      let dir = random(1,4);
      dir = floor(dir);
      if(isNaN(dir)){
        dir = 2;
      }
      let tempSpawnPos;
      let playerPos = player.GetPosition();
      switch(dir){
        case 1: tempSpawnPos = createVector(random(-playerPos.x*2, playerPos.x *2), playerPos.y - random(canvasSize.y/2 + 50, canvasSize.y/2 + 500)); break;
        case 2: tempSpawnPos = createVector(playerPos.x + random(canvasSize.x/2 + 50, canvasSize.x/2 + 500), playerPos.y + random(-canvasSize.y*2, canvasSize.y *2)); break;
        case 3: tempSpawnPos = createVector(random(-playerPos.x*2, playerPos.x *2), playerPos.y + random(canvasSize.y/2 + 50, canvasSize.y/2 + 500)); break;
        case 4: tempSpawnPos = createVector(playerPos.x - random(canvasSize.x/2 + 50, canvasSize.x/2 + 500), playerPos.y - random(-canvasSize.y * 2, canvasSize.y *2)); break;
         default: tempSpawnPos = createVector(random(-playerPos.x *2, playerPos.x *2), playerPos.y - random(canvasSize.y/2 + 50, canvasSize.y/2  + 500)); break;
      }
      if(score < 10000 && !bossBeat || bossActive && !bossBeat){
      switch(spawn){
        case 1:  if (spawnPoints >= 5) {alien = new Enemy1(tempSpawnPos, 25, enemy1, random(2 + spawnScale /100,3 + spawnScale /100), 1+score/2000); spawnPoints -= 2;} else spawning = false;break;
        case 2: if( spawnPoints >= 30) {alien =  new Enemy2(tempSpawnPos, 50, enemy2, random(3 + spawnScale/100,4 + spawnScale/100), 2+score/3000); spawnPoints -=30}else spawning = false;break; 
        case 3: if(spawnPoints >= 40) { alien = new Enemy3(tempSpawnPos, 90, enemy3, random(1 + spawnScale/100 ,2 + spawnScale/100), 4+score/4000); spawnPoints -= 40;} else spawning = false;break;
        default: spawning = false; break;
      }
    }
    else if(bossBeat){
        switch(spawn){
            case 1:  if (spawnPoints >= 1) {alien = new Enemy1(tempSpawnPos, 25, enemy1, 4, 1+score/1000); spawnPoints -= 2;} else spawning = false;break;
            case 2: if( spawnPoints >= 4) {alien =  new Enemy2(tempSpawnPos, 50, enemy2, 4, 2+score/1500); spawnPoints -=30}else spawning = false;break; 
            case 3: if(spawnPoints >= 10) { alien = new Enemy3(tempSpawnPos, 90, enemy3, 2, 4+score/2000); spawnPoints -= 40;} else spawning = false;break;
            case 4: if(spawnPoints >= 5000) {alien = new Boss(tempSpawnPos, 250, 20000, 0.5, 2000 + score/1000, bossImg);spawnPoints -= 500; spawning = false;} else spawning = false; break;
            default: spawning = false; break;
          }  
    }
    else if (!bossActive && !bossBeat){
       alien = new Boss(tempSpawnPos, 250, 10000, 0.5, 3500, bossImg);
       bossActive = true;
    }
      enemies.push(alien);
      qt.insert(alien);

    }
  }


class UFO extends HittableObject{

    startFrame = 0;
    frameCounter = 0;
    moving = false;
    rot = 0;
    sprite = loadImage("UFO.gif");

    constructor(position, size, score, speed){
        super(position, size, score, speed);
        this.speed = speed;
    }

    Update(){
        super.Update();
        if(this.startFrame = 0){
            this.startFrame = frameCount;
        }
        this.frameCounter = frameCount - this.startFrame;
        let roll = random(0,1);
        let chance = (this.frameCounter - 500) / 400;
        if(roll <= chance){
            this.moving = true; 
            //move across the screen;
        }
        if(this.moving){
            this.position.x += this.speed;
            this.position.y = 300 * sin(this.frameCounter*0.02) + 35;
            image(this.sprite, this.position.x + shake.x,this.position.y + shake.y);
            if(this.position.x > canvasSize.x + this.size){
                this.moving = false;
                this.startFrame = 0;
                this.frameCounter = 0;
                this.position = createVector(-20,0);
            }
        }

    }
    CheckCollision(position, size){
        let hit = super.CheckCollision(position, size);
        if(hit){
            ufoDeath.play();
            StartShake(random(7,10), random(3,5));
            let particlePos = createVector(this.position.x + (this.size /2), this.position.y + (this.size/2));
            SpawnParticles(particlePos, random(10,15), color(138, 131, 131));
            return true;
        }
        else{
            return false;
        }

    }

}

class Shield extends HittableObject{

    shield1 = loadImage("Shield1.png");
    shield2 = loadImage("Shield2.png");
    shield3 = loadImage("Shield3.png");
    constructor(position, size, points, health, speed){
        super(position, size, points, speed);
        this.health = health;
        this.position.y -= this.size / 2;
    }
    Hit(){
        this.health -= 1;
        if(this.health <= 0){
            return true;
        }
        else{
            return false;
        }

    }
    Update()
    {
        let img = 0;
        switch(this.health){
           case 3: img = this.shield1; break;
           case 2: img = this.shield2; break;
           case 1: img = this.shield3; break;
           default: img = this.shield1; break;
        }
        image(img, this.position.x, this.position.y)
    }
}

class Wall{

    constructor(position, size){
        this.position = position;
        this.size = size;
    }

    GetPosition(){
        return this.position;
    }
    GetSize(){
        return this.size;
    }
    Update(){
        fill("Grey");
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}
