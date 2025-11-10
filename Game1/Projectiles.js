//Projectile class and functions

function ProjectileSetup(){
   //player projectile variables
   playerShotCache = []
   cachePos = createVector(canvasSize.x*2, canvasSize.y*2);
   shotCacheSize = 15;
   for (let i = 0; i <= shotCacheSize; i +=1){
     let projectile = new Projectile(cachePos, 16, true, "Shot.png", createVector(20,20), 90, createVector(0,0));
     playerShotCache.push(projectile);
   } 
   activeShots = [];
   shields = [];
   shieldAmounts = 3;

   //enemy projectile variables
   enemyShotCache = [];
   for ( let i = 0; i <= shotCacheSize; i += 1){
     let projectile = new Projectile(cachePos, 6, false, "EnemyShot.png", createVector(20,20), 360, createVector(0,0));
     enemyShotCache.push(projectile);
   }
   activeEnemyShots = [];
   particles = []; 
}


class Projectile {
    targetsPlayer = true;
    playerPos = createVector(0,0);
    position = createVector(0,0);
    sprite = null;
    enabled = false;
    size = createVector(0,0);
    enableFrame = 0;
    currentLifeTime = 0;
    velocity = createVector(0,0);
    damage = 1;
    pierce = false;
    smart = false;
    splitting = false;
    constructor(position, speed, playerShot, sprite, size, lifeTime, velocity){
        this.position = position;
        this.speed = speed;
        this.targetsPlayer = !playerShot;
        if(sprite != null){
        this.sprite = loadImage(sprite);
        }
        this.size = size;
        this.lifeTime = lifeTime;
        this.velocity = velocity;
    }
    GetSize(){
        return this.size;
    }
    SetSplitting(split){
      this.splitting = split;
    }
    SetVelocity(vel){
        this.velocity = vel;
        this.sprite.resize(this.size.x , this.size.y);

    }
    SetPierce(pierce){
      this.pierce = pierce;
    }
    SetSmart(smart){
      this.smart = smart;
    }
    SetLifetime(time){
        this.lifeTime = time;
    }
    CheckLifeTime(){

        if(this.currentLifeTime >= this.lifeTime){
            this.enableFrame = 0;
            this.currentLifeTime = 0;
            return true; 
        }
        else{
            return false;
        }

    }

    SetDamage(damage){
        this.damage = damage; 
    }
    GetDamage(){
      return this.damage;
    }
    SetPlayerPos(playerPos){
        this.playerPos = playerPos;
    }
    SetPosition(position){
        this.position = position;
    }
    GetPosition(){
        return this.position;
    }
    Enable(set){
        this.enabled = set;
        this.enableFrame = 0;
        this.currentLifeTime = 0; 
    }
    Update(){
        if(this.enabled){
            if(this.enableFrame == 0){
                this.enableFrame = frameCount;
            }
            if(this.smart){
              let vel = createVector(mouseX,mouseY);
              let playerPos = createVector(player.GetPosition().x, player.GetPosition().y);
              let cSize = createVector(canvasSize.x, canvasSize.y);
              playerPos.sub(cSize.div(2));
              vel.sub(this.position);
              vel.add(playerPos)
              vel.normalize();
              this.velocity.add(vel);
              this.velocity.normalize();
              print(this.velocity);
            }
            this.currentLifeTime = frameCount - this.enableFrame;
            if(!this.smart){
            this.position.y -= this.speed * this.velocity.y;
            this.position.x -= this.speed * this.velocity.x;
            }
            else{
              this.position.y += this.speed * this.velocity.y;
              this.position.x += this.speed * this.velocity.x;
            }
            print(this.position);
            if(player != null){
              let playerposition = player.GetPosition();
            if(this.position.x +shake.x < playerposition.x + canvasSize.x/2 + 5 && this.position.x +shake.x > playerposition.x - canvasSize.x/2 - 5 &&
            this.position.y + shake.y < playerposition.y + canvasSize.y/2 + 5 && this.position.y + shake.y > playerposition.y - canvasSize.y/2 - 5){
            if(this.sprite == null){
                circle(this.position.x, this.position.y ,this.size.x);
            }
            else{
                image(this.sprite, this.position.x + shake.x , this.position.y + shake.y);
            }
          }
        }
        }
    }
}

//updates projectiles on screen;
async function UpdateProjectiles(){
  await new Promise(resolve => {  
    for (let shot in activeShots){
      let projectile = activeShots[shot];
      projectile.Update();
      if(projectile.CheckLifeTime()){
          activeShots.splice(shot, 1);
          playerShotCache.push(projectile);
          projectile.Enable(false);
          projectile.SetPosition(cachePos);
      }
  
      if(ufo != null && ufo.CheckCollision(projectile.GetPosition(), projectile.GetSize())){
        ufo = null;
      }
  
      for(let alien of enemies){
        position = projectile.GetPosition();
        if(alien !== undefined){
        //On projectile hit. remove the alien, and remove the projectile from the activeshots
        //and send it back to the cache to be used again later.
        if(alien.CheckCollision(position, projectile.GetSize(), projectile.GetDamage())){
          if(projectile.splitting){
            let vel = createVector(random(-1,1), random(-1,1));
            player.Shoot(projectile.position, vel, false);
            let vel2 = createVector(random(-1,1), random(-1,1));
            player.Shoot(projectile.position, vel2, false);
          }
          if(alien.GetHealth() < 1){
          let index = enemies.indexOf(alien);  
          enemies.splice(index, 1);
          }
          if(!projectile.pierce){
          activeShots.splice(shot, 1);
          playerShotCache.push(projectile);
          projectile.Enable(false);
          projectile.SetPosition(cachePos);
          }

        }
      }
      }
   /*
      for(let obj in shields){
        let shield = shields[obj];
        if(shield.CheckCollision(projectile.GetPosition(), projectile.GetSize())){
          if(shield.Hit()){
            shields.splice(obj,1);
          }
          activeShots.splice(shot, 1);
          projectile.Enable(false);
          projectile.SetPosition(cachePos);
        }
      }
      */
    }

    for (let shot in activeEnemyShots){

      let projectile = activeEnemyShots[shot];
      lifeTimeOver = projectile.CheckLifeTime()
      projectile.Update();
      if(lifeTimeOver){
        activeEnemyShots.splice(shot, 1);
        enemyShotCache.push(projectile);
        projectile.Enable(false);
        projectile.SetPosition(cachePos);
      }
      if(player != null){
        if(player.CheckCollision(projectile.GetPosition(), projectile.GetSize())){
          activeShots.splice(shot, 1);
          projectile.Enable(false);
          projectile.SetPosition(cachePos);
          if(player.Death()){
            player = null;
            playerDeath.play();
            gameOver = true;
          }
        }

      }
  }
    resolve(true);

    });
  }
  
  

//Particles class and functions

class Particle{

    constructor(position, color){
        this.position = position;
        this.color = color;
        this.velocity = createVector(random(-2,2), random(-2,2));
        this.alpha = 255;
    }


    GetAlpha(){
        return this.alpha;
    }
    Update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.alpha -=2;
        noStroke();
        if(player != null){
          let playerposition = player.GetPosition();
          if(this.position.x +shake.x < playerposition.x + canvasSize.x/2 + 5 && this.position.x +shake.x > playerposition.x - canvasSize.x/2 - 5 &&
          this.position.y + shake.y < playerposition.y + canvasSize.y/2 + 5 && this.position.y + shake.y > playerposition.y - canvasSize.y/2 - 5){
          this.color.setAlpha(this.alpha);
          fill(this.color);       
          circle(this.position.x + shake.x, this.position.y + shake.y, 5);
        }
      }
    }
}


function UpdateParticles(){
    for(particle in particles){
      obj = particles[particle];
      obj.Update();
      let alpha = obj.GetAlpha();
      if(alpha <= 0){
        particles.splice(particle,1);
      }
    }
  }


function SpawnParticles(position, amount, color){
  for(let i = 0; i <= amount; i+=1){
    particlePos = createVector(position.x, position.y);
    let particle = new Particle(particlePos, color);
    particles.push(particle);
  }

}