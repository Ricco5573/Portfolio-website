function setup() {
  backGround = [];
  for (let i = 0;  i <= 15; i+=1){
    for (let j = 0;  j <= 15; j+=1){
      backGround.push(new Background(createVector((-1920*4) + (1920 * j), (-1080 * 4) + (1080 * i)), bg));
    }
  }
  canvasSize = createVector(windowWidth, windowHeight);
  canvas = createCanvas(canvasSize.x, canvasSize.y);
  backgroundOffset = createVector(0,0);
  
  PlayerSetup();
  UISetup();
  EnemySetup();
  ProjectileSetup();
  //walls = [];
 // walls.push(new Wall(createVector(200,400), createVector(50,100)));
  //walls.push(new Wall(createVector(900,500), createVector(100,200)));
  bg.resize(canvasSize.x + canvasSize.x/4, canvasSize.y + canvasSize.y/4);
  
}


document.oncontextmenu = function() {
  return false;
}

function preload(){
  
  bg = loadImage('Background.jpg');
  SoundSetup();


  scaleCoefficient = 1.65;
}

function StartGame(){
  kills = 0;
  backgroundOffset = createVector(0,0);
  send = false;
  ufo = null;
  scorelist.length = 0;
  spawnPoints = 20;
  enemies.length = 0;
  spawnScale = 0;
  dT = 0;
  enemyRight = true; 
  wave = 0;
  gameWin = false;
  score = 0;
  let rt = new Rectangle(createVector(0,0), createVector(100000,100000));
  qt = new QuadTree(rt, 90);
  SpawnEnemies();
  bg.resize(canvasSize.x + canvasSize.x/4, canvasSize.y + canvasSize.y/4);
  //reset the shots in the air right now.
  for (let shot in activeShots){
    projectile = activeShots[shot];

    playerShotCache.push(projectile);
    projectile.Enable(false);
    projectile.SetPosition(cachePos);
  }
  activeShots.length = 0;
  for (let shot in activeEnemyShots){
    projectile = activeEnemyShots[shot];

    enemyShotCache.push(projectile);
    projectile.Enable(false);
    projectile.SetPosition(cachePos);
  }
  shields.length = 0;
  for(let i = 0;  i < shieldAmounts; i +=1){
    let spawnPos = createVector((canvasSize.x/4 *i + 150), canvasSize.y - 50);
    let shield = new Shield(spawnPos, 100, 0, 3, 0);
    shields.push(shield);
  }
  activeEnemyShots.length = 0;
  activeShots.length = 0;
  mainMenu = false;
  bossActive = false;
  scoreboard = false;
  gameOver = false;
  playerSpawnPos = createVector(canvasSize.x / 2,canvasSize.y /2);
  player = new Player(playerSpawnPos, playerSize, 'Ship.png');
  nameInput.position(-canvasSize.x/2, -canvasSize.y/2);
  SpawnEnemies();
  resetUpgrades();
  Music();

}

function resetUpgrades(){
  upgradesList = [];
  upgradesList.push(new Upgrade("Splitting bullets", "Bullets split in two upon hit", player.SplitUpg, 0, null));
  upgradesList.push(new Upgrade("Smart Bullets", "Bullets home in on mouse position", player.SmartUpg, 0, null));
  upgradesList.push(new Upgrade("Sniper", "Increase your range, but half \n your firerate", player.SniperUpg,0,null));
  let shotgun2 = new Upgrade("Shotgun 2", "Half your movement speed, but double your damage", player.Shotgun2Upg, 0, null);
  upgradesList.push(new Upgrade("Shotgun", "Lower your range, but add \n 4 extra projectiles", player.ShotgunUpg, 0 ,shotgun2));
  let turret3 = new Upgrade("Turret 3", "Double your damage when standing still", player.Turret3Upg, 0, null);
  let turret2 = new Upgrade("Turret 2", "Half your movement speed, but double your shotAmount \n when standing still", player.Turret2Upg, 0, turret3);
  upgradesList.push(new Upgrade("Turret", "Shoot 2x as fast when standing still",  player.TurretUpg, upgradesList.length, turret2 ));
  upgradesList.push(new Upgrade("Pierce", "quarter your current Firerate,\n but bullets pierce enemies", player.PierceUpg, upgradesList.length, null));
  upgradesList.push(new Upgrade("Big Gun", "Half your movement speed, \n But multiply your current damage \n by 10", player.GunUpg, upgradesList.length, null));
  let glass4 = new Upgrade("Glass Cannon 4", "Double your current damage", player.Glass4Upg, 0, null);
  let glass3 = new Upgrade("Glass Cannon 3", "Double your shot count, but cannot have more than 1HP", player.Glass3Upg, 0, glass4)
  let glass2 = new Upgrade("Glass Cannon 2","Double your firerate, but double enemy spawn rate.",player.Glass2Upg, 0, glass3);
  upgradesList.push(new Upgrade("Glass Cannon", "Double your current movement speed,\n but HP is reduced to 1", player.GlassUpg, upgradesList.length, glass2));
  upgradesList.push(new Upgrade("Guns", "+2 shots", player.shots2Upg, null));
  upgradesList.push(new Upgrade("Tank", "Double your current health and healing,\n but lower firerate  below 3hp", player.TankUpg, upgradesList.length, null));
  let momentum2 = new Upgrade("Momentum 2", "Gain +1 shots for each 200 kills without taking damage", player.Momentum2Upg, 0, null);
  upgradesList.push(new Upgrade("Momentum", "Gain +1 damage for each 100 kills without taking damage", player.MomentumUpg, 0, momentum2));
}

//Draw and Update functions


function draw() {
  background(51);


  for( let index in backGround){ 
    if(backGround[index] !== undefined){
      backGround[index].Update();
    }
  }

  if(!mainMenu && !scoreboard && !upgrades){
    nameInput.position(-canvasSize.x/2, -canvasSize.y/2);
    if(tier1.paused && tier2.paused && tier3.paused && bossBattle.paused){
      Music();
    }
    if(gameOver){
      GameOver();
    }
    else if(gameWin){
      GameWin();
    }
    fill("White");
    stroke("Black");
    strokeWeight(1);
    textAlign(LEFT);
    text("Score: " + floor(score), 0 + shake.x, 50 + shake.y);  
    UpdatePLayer(); 
    UpdateEnemies();
    UpdateProjectiles();
    textSize(25);

    UpdateParticles();

  }
  else if(scoreboard){
    DrawScoreBoard();
  }
  else if(upgrades){
    UpgradeUI();
  }
  else{
    DrawMainMenu();
  }
  if(shaking){
    Shake();
  }

}


function StartShake(maxShake, duration){
  shakeConstraint += maxShake;
  if(!bossActive){
  shakeConstraint = constrain(shakeConstraint, 0, 20);
  }
  else{
  shakeConstraint = constrain(shakeConstraint, 0, 5);
  }
  startShake = frameCount;
  shakeTime = duration;
  shaking = true;
}
  function Shake(){
    let shakedur = frameCount - startShake;
    if(shakedur >= shakeTime){
      shaking = false;
      startShake = 0;
      shakeConstraint = 0;
      shake.x = 0;
      shake.y = 0; 
    }
    else{
      shake.x = random(-shakeConstraint, shakeConstraint);
      shake.y = random(-shakeConstraint, shakeConstraint);
    }
  }
  class Background{

    constructor(position){
        this.position = position;
        this.img = loadImage('Background.jpg');
    }
    Update(){
        image(this.img, (this.position.x + backgroundOffset.x) -shake.x , (this.position.y + backgroundOffset.y) - shake.y);
    }
}