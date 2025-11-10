class Restart {
    constructor() {}

    restart(posx,posy) {
        this.#removeEnemies();
        player = null;

        textSize(12);
        this.#createPlayer(posx,posy);
        this.#createEnemies();
    }

    #createPlayer(posx,posy) {
        posx = posx === undefined ? 60 : posx;
        posy = posy === undefined ? 0 : posy;

        player = new Player(createVector(posx,posy),createVector(20,20), 10);
    }

    #createEnemies() {
        enemies.push (new ChaseEnemy(createVector(1000,650), createVector(96,96),5));
        enemies.push (new ChaseEnemy(createVector(1800,650), createVector(96,96),5));
        enemies.push (new ChaseEnemy(createVector(1000,200), createVector(96,96), 5));
    }

    #removeEnemies() {
        for (let i = enemies.length;i >= 0; i--) {
            enemies.splice(i,1);
        }
    }
}