class ProjectileEntities{
    constructor() {
        this.projectiles = [];
    }


    createProjectile(position,targetPosition,type) {
        switch (type) {
            case "Bullet" :
                this.projectiles.push (new Bullet(position,createVector(3,3),targetPosition,16));
        }
    }
}

class Projectile extends CollisionObject{
    #sprite;
    constructor(position,size,renderLayer) {
        super(position,size,renderLayer);
        this.#sprite = this.GetSprite();
    }

    Update() {
        this.#collisionCheck();
        this.#move();
        this.#show();
        super.Update();
    }

    #collisionCheck() {
        if (this.#platformCollision() || this.#enemyCollision()) {
            let index = projectiles.projectiles.indexOf(this);
            this.#remove(index);
        }
    }

    #platformCollision() {
        for (let platform of plat.platforms) {
            if (this.checkCollision(platform.position,platform.size)) {
                return true;
            }
        }
    }

    #enemyCollision() {
        for (let enemy of mapObjects) {
            if (enemy instanceof Enemy) {
                if (this.checkCollision(enemy.position,enemy.size)) {
                    enemy.Damage(this.damage,false);
                    return true;
                }
            }
        }
    }

    #show() {
        this.#sprite.loadPixels();

        for (let x = 0; x < this.#sprite.width; x += 1) {
          for (let y = 0; y < this.#sprite.height; y += 1) {
            this.#sprite.set(x, y,100);
          }
        }

        this.#sprite.updatePixels();
    }

    #move() {
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
    }

    #remove(index) {
        projectiles.projectiles.splice(index,1);
    }
}

class Bullet extends Projectile{
    constructor(position,size,targetPosition,renderLayer) {
        super(position,size,renderLayer);
        this.damage = 2;
        
        let targetx = lerp(targetPosition.x + position.x, position.x, 0.85);
        let targety = lerp(targetPosition.y + position.y, position.y, 0.85);
        let adjustedTargetPositionX = targetPosition.x - (canvasSize.x / 2 - targetx);
        let adjustedTargetPositionY = targetPosition.y - (canvasSize.y / 2 - targety);
        this.velocity = createVector(adjustedTargetPositionX - position.x, adjustedTargetPositionY - position.y).setMag(20);
    }

    Update() {
        super.Update();
    }

}