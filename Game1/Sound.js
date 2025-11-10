function SoundSetup(){
    //Sounds


    /*==
  playerDeath = new Audio("PlayerDeath.Wav");
  playerHit = new Audio("PlayerHit.wav");
  playerShoot = new Audio("PlayerShoot.wav");
  alienDeath = new Audio("AlienDeath.wav");
  alienDeath2 = new Audio("AlienDeath2.wav");
  alienDeath3 = new Audio("AlienDeath3.wav");
  alienShoot = new Audio("AlienShoot.wav");
  ufoDeath = new Audio("UFODeath.wav");
  click = new Audio("click.wav");
  win = new Audio("win.wav");
*/

    playerDeath = [];
    playerHit = [];
    playerShoot = [];
    alienDeath = [];
    alienDeath2 = [];
    alienDeath3 =[];
    alienShoot = [];
    ufoDeath = [];
    click = [];
    win = [];
    for(let i = 0; i <= 5; i +=1){
        pD1 = new Audio("PlayerDeath.Wav");
        playerDeath.push(pD1);
        pD1.onEnded = (event)=>{
            pD1.stop();
        };
        pH1 = new Audio("PlayerHit.wav");
        playerHit.push(pH1);
        pH1.onEnded = (event) =>{
            pH1.stop();
        };
        pS1 = new Audio("PlayerShoot.wav");
        playerShoot.push(pS1);
        pS1.onEnded = (event) =>{
            pS1.stop();
        };
        aD1 = new Audio("AlienDeath.wav");
        alienDeath.push(aD1);
        aD1.onEnded = (event) => {
            aD1.stop();
        };
        aD2 = new Audio("AlienDeath2.wav");
        alienDeath2.push(aD2);
        aD2.onEnded = (event) => {
            aD2.stop();
        };
        aD3 = new Audio("AlienDeath3.wav");
        alienDeath3.push(aD3);
        aD3.onEnded = (event) =>{
            aD3.stop();
        };
        aS1 =  new Audio("AlienShoot.wav");
        alienShoot.push(aS1);
        aS1.onEnded = (event) => {
            aS1.stop();
        };
        uD1 = new Audio("UFODeath.wav")
        ufoDeath.push(uD1);
        uD1.onEnded = (event) => {
            uD1.stop();
        };
        c1 = new Audio("click.wav");
        click.push(c1);
        c1.onEnded = (event) => {
            c1.stop();
        };
        w1 = new Audio("win.wav");
        win.push(w1);
        w1.onEnded = (event) => {
            w1.stop();
        };
    }

  tier1 = new Audio("Tier-1.mp3");
  tier1.onEnded = (event) => {
    Music();
  };

  tier2 = new Audio("Tier-2.mp3");
  tier2.onEnded = (event) => {
    Music();
  };
  tier3 = new Audio("Tier-3.mp3");
  tier3.onEnded = (event) => {
    Music();
  };
  tier1.volume = 0.3;
  tier2.volume = 0.3;
  tier3.volume = 0.3;

  bossBattle = new Audio("Boss-battle.mp3");
  bossBattle.onEnded = (event) =>{
    Music();
  };
  bossBattle.volume = 0.3;


  playerHits = 0;
  playerShoots = 0;
  alienDeaths = 0;
  alienShoots = 0;

  soundPlays = 0;

}



function PlaySound(sound){

    
    switch(sound){
        case "playerDeath": for(let index in playerDeath){ let audio = playerDeath[index]; if(audio.paused){ audio.play(); break;}};  break;
        case "playerHit": for(let index in playerHit){ let audio = playerHit[index]; if(audio.paused) {audio.play(); break;}} break;
        case "playerShoot":  for(let index in playerShoot){ let audio = playerShoot[index]; if(audio.paused) {  audio.play(); break;}} break;
        case "alienDeath": for(let index in alienDeath){ let audio = alienDeath[index]; if(audio.paused) {audio.play(); break;}} break;
        case "alienDeath2": for(let index in alienDeath2){ let audio = alienDeath2[index]; if(audio.paused) {audio.play(); break;}} break;
        case "alienDeath3":for(let index in alienDeath3){ let audio = alienDeath3[index]; if(audio.paused) {audio.play(); break;}} break;
        case "alienShoot": for(let index in alienShoot){ let audio = alienShoot[index]; if(audio.paused) {audio.play(); break;}} break;
        case "ufoDeath": for(let index in ufoDeath){ let audio = ufoDeath[index]; if(audio.paused) {audio.play(); break;}} break;
        case "click":  for(let index in click){ let audio = click[index];  if(audio.paused) {audio.play(); break;}} break;
        case "win": for(let index in win){ let audio = win[index]; if(audio.paused) {audio.play(); break;}} break;
    }
}


function PlayerHitEnd(){
  soundPlays += 1;
  playerHits -=1;
  playerDeath.stop();

    if(playerHits < 0){
        playerHits = 0;
    }
}

function PlayerShootEnd(){
  soundPlays += 1;
  playerShoots -=1;
  playerShoot.stop();

    if(playerShoots < 0){
        playerShoots = 0;
    }
}

function AlienDeathEnd(){
    alienDeaths -=1;
  soundPlays += 1;
  alienDeath.stop();
  alienDeath2.stop();
  alienDeath3.stop();
    if(alienDeaths < 0){
        alienDeaths = 0;
    }
}


function AlienShootsEnd(){
    alienShoots -=1;
  soundPlays += 1;
  alienShoot.stop();

    if(alienShoots < 0){
        alienShoots = 0;
    }
}

function Music(){
    tier1.stop();
    tier2.stop();
    tier3.stop();
    bossBattle.stop();
    if(score <= 2500){
        tier1.play();
    }
    else if(!bossBeat && !bossActive){
        tier2.play();
    }
    else if (bossActive){
        bossBattle.play();
    }
    else if(bossBeat){
        tier3.play();
    }
}

function StartBossMusic(){
        tier1.stop();
        tier2.stop();
        tier3.stop();
        bossBattle.play();
}


Audio.prototype.stop = function() {
    this.pause();
    this.currentTime = 0;
}