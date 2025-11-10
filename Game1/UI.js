function UISetup(){
     //UI variables
  gameOver = false;
  MainMenuItems = [];
  mainMenu = true;
  startButtonPos = createVector(canvasSize.x/2, canvasSize.y/2);
  startButtonSize = createVector(200,100); 
  startButton = new StartButton(startButtonPos, startButtonSize, "StartButton.png");
  MainMenuItems.push(startButton);
  restartButtonPos = createVector(canvasSize.x/2, canvasSize.y/2 + 150);
  restartButtonSize = createVector(200,100);
  restartButton = new RestartButton(restartButtonPos, restartButtonSize, "RestartButton.png");
  scoreButtonPos = createVector(canvasSize.x/2 + 200, canvasSize.y/2 + 75);
  scoreButtonSize = createVector(100,50);
  scoreButton = new ScoreButton(scoreButtonPos, scoreButtonSize, 'Score.png');
  scoreBoardButtonPos = createVector(canvasSize.x/2, canvasSize.y/2 + 125);
  scoreBoardButtonSize = createVector(200,100); 
  scoreBoardButton = new ScoreBoardButton(scoreBoardButtonPos, scoreBoardButtonSize, "Scoreboard.png")
  mainMenuButtonPos = createVector(canvasSize.x/2, canvasSize.y/2 + 250);
  mainMenuButtonSize = createVector(200,100); 
  mainMenuButton = new MainMenuButton(mainMenuButtonPos, mainMenuButtonSize, "Mainmenu.png");
  upgrade1ButtonPos = createVector(300, canvasSize.y/2 - 100);
  upgrade1ButtonSize = createVector(100,50);
  upgrade1Button = new UpgradeShotSpeedButton(upgrade1ButtonPos,upgrade1ButtonSize, "Shoot++.png");
  upgrade2ButtonPos = createVector(300, canvasSize.y/2);
  upgrade2ButtonSize = createVector(100,50);
  upgrade2Button = new UpgradeShotsButton(upgrade2ButtonPos,upgrade2ButtonSize,"Shots++.png");
  upgrade3ButtonPos = createVector(300, canvasSize.y/2 + 100);
  upgrade3ButtonSize = createVector(100,50);
  upgrade3Button = new UpgradeDamageButton(upgrade3ButtonPos, upgrade3ButtonSize, "Damage++.png");
  upgrade4ButtonPos = createVector(300, canvasSize.y/2 + 200);
  upgrade4ButtonSize = createVector(100,50);
  upgrade4Button = new HealButton(upgrade4ButtonPos, upgrade4ButtonSize, "Health++.png");

  shootUI = loadImage("ShootUI.png");
  shotsUI = loadImage("ShotsUI.png");
  damageUI = loadImage("DamageUI.png");
 upgradeButtons = [];
  nameInput = createInput('Player');
  nameInput.position(-canvasSize.x/2, -canvasSize.y/2);
  upgrades = false;

    //scoreboard
    playerName = '';
    gameID = 9242359342436;
    send = false;
    score = 0;
    scores = [];
    scoreboard = false;
    scorelist = []; 
    shake = createVector(0,0);
    startShake = 0;
    shakeTime = 0;
    shakeConstraint = 0;
    shaking = false; 
  
}




class Button{
    down = false;
    constructor (position, size, sprite){
        this.position = position;
        this.size = size;
        this.sprite = loadImage(sprite);
        this.position = createVector(this.position.x - (this.size.x /2), this.position.y - (this.size.y /2));
    }
    Update(){

        image(this.sprite, this.position.x, this.position.y);

        if(mouseIsPressed){
            this.down = true;

        }
        else if(this.down){
            this.down = false;
            let mousePos = createVector(mouseX, mouseY);
            if(this.CheckCollision(mousePos, 1)){
                PlaySound("click");
                this.Click();
            }
        }

    }
    Click(){
        // to be overridden by other buttons.
    }

    CheckCollision(position, size){
        let x = this.position.x;
        let y = this.position.y;
        
            if(x + this.size.x >= position.x &&
                x <= position.x + size &&
                y  <= position.y &&
                y  + this.size.y >= position.y
                ){
                return true;
        }
        else{
            return false;
        }
    }
}

class UpgradeButton extends Button{
    constructor(position, size, sprite, upgrade){
        super(position, size, sprite)
        this.upgrade = upgrade;
    }
    Click(){
        this.upgrade.Trigger();
        EndUpgradeUI();
    }
    Update(){
        super.Update();
        textAlign(LEFT);
        fill("White");
        text(this.upgrade.name, this.position.x + 15, this.position.y + (this.size.y /2))
        let mousePos = createVector(mouseX, mouseY);
        if(this.CheckCollision(mousePos, 1)){
            fill("Grey");
            let indices = 0;
            for (let str of this.upgrade.description){
                if(str === "\n"){
                    indices += 1;
                }
            }
            rect(mousePos.x, mousePos.y, textWidth(this.upgrade.description) / (indices + 1),  35 * (indices +1));
            fill("Black");
            text(this.upgrade.description, mousePos.x, mousePos.y + 25);
        }
    }
}

class StartButton extends Button{
    constructor(position, size, sprite){
        super(position, size, sprite);
    }

    Click(){
        StartGame();
    }


}

class RestartButton extends Button{
constructor(position, size, color){
    super(position, size, color, 'Restart?'); 
}
    Click(){
        StartGame();
    }
}

class ScoreButton extends Button{

    constructor(position, size, color){
        super(position, size,color, 'Send score');
    }
   async Click(){
        await SendScore();
        nameInput.position(-canvasSize.x/2, -canvasSize.y/2);
        ScoreBoard();
    }
}

class ScoreBoardButton extends Button{

    constructor(position, size, color){
        super(position,size,color);
    }

    Click(){
        ScoreBoard();
    }
}

class MainMenuButton extends Button{
    constructor(position, size, color){
        super(position,size, color);
    }

    Click(){
        LoadMainMenu();
    }
}

class UpgradeShotSpeedButton extends Button{
    constructor(position, size, color){
        super(position,size, color);
    }

    Click(){
        player.UpgradeShotSpeed();
        EndUpgradeUI();

    }
    Update(){
        super.Update();
        let mousePos = createVector(mouseX, mouseY);
        if(this.CheckCollision(mousePos, 1)){
            fill("Grey");
            rect(mousePos.x, mousePos.y, 160, 40);
            fill("Black");
            text("Shoot faster", mousePos.x, mousePos.y + 25);
        }
    }
}
class UpgradeShotsButton extends Button{
    constructor(position, size, color){
        super(position,size, color);
    }

    Click(){
        player.UpgradeShots();
        EndUpgradeUI();

    }

    Update(){
        super.Update();
        let mousePos = createVector(mouseX, mouseY);
        if(this.CheckCollision(mousePos, 1)){
            fill("Grey");
            rect(mousePos.x, mousePos.y, 225, 40);
            fill("Black");
            text("Shoot more bullets, but slower", mousePos.x, mousePos.y + 25);
        }
    }
}

class UpgradeDamageButton extends Button{
    constructor(position, size, color){
        super(position,size, color);
    }
    Click(){
        player.UpgradeDamage();
        EndUpgradeUI();

    }

    Update(){
        super.Update();
        let mousePos = createVector(mouseX, mouseY);
        if(this.CheckCollision(mousePos, 1)){
            fill("Grey");
            rect(mousePos.x, mousePos.y, 200, 40);
            fill("Black");
            text("Do more damage", mousePos.x, mousePos.y + 25);
        }
    }
}

class HealButton extends Button{
    constructor(position, size, color){
        super(position,size, color);
    }

    Click(){
        player.Heal();
        EndUpgradeUI();
    }
    Update(){
        super.Update();
        let mousePos = createVector(mouseX, mouseY);
        if(this.CheckCollision(mousePos, 1)){
            fill("Grey");
            rect(mousePos.x, mousePos.y, 175, 40);
            fill("Black");
            text("Heal 1 hitpoint", mousePos.x, mousePos.y + 25);
        }
    }
}

 //UI Functions

function EndUpgradeUI(){
    upgrades = false;
    PlaySound("win");
}

function StartUpgradeUI(){
    upgrades = true; 
    upgradeButtons.length = 0;
    print(upgradesList.length);
    if(upgradesList.length != 0){
    for(let i = 0; i < 5; i+=1){
        let buttonPos = createVector(canvasSize.x/2, 100 + (125 * i));
        let ind = round(random(0, upgradesList.length-1));
        let upg = upgradesList[ind];
        let button = new UpgradeButton(buttonPos, createVector(200,100), "GenericUpg.jpg", upg);
        upgradeButtons.push(button);
    }
}
}

//starts and resets the game.
function GameOver(){
    fill('Grey');
    textSize(100);
    textAlign(CENTER);
    text("Game over!", canvasSize.x/2, canvasSize.y/2);
    restartButton.Update();
    ScoreUI();
    mainMenuButton.Update();
  }
  
  function UpgradeUI(){
    stroke("Black");
    strokeWeight(1);
    fill("White");
    let nextUp = ((750 * pow(player.GetUpgrades(), scaleCoefficient)) - score) + 500;
    text("Till next upgrade: " + floor(nextUp), 0, 75);
    image(damageUI, 0, 100);
    text(player.damage, 25, 120);
    if(this.shotsUpg >= 4){
        fill("Purple");
    }
    image(shotsUI, 0, 125);
    text(player.shots, 25, 145);
    fill("White");
    if(this.shotCooldown <= 5){
        fill("Purple");
    }
    image(shootUI, 0, 150);
    text(round(player.shotCooldown / 60,2), 25, 170);

    if(player.GetShotSpeed() >5){
    upgrade1Button.Update();
    }
    if(player.GetShots() <= 5){
    upgrade2Button.Update();
    }
    upgrade3Button.Update();
    if(!player.glass3){
    upgrade4Button.Update();
    }
    for(let index in upgradeButtons){
        upgradeButtons[index].Update();
    }

  }

  function ScoreUI(){
    textSize(25);
    stroke("Black");
    strokeWeight(1);
    fill('White');
    nameInput.position((canvasSize.x/2) - 75, canvasSize.y/2 + 15);
    text("Score: " + floor(score), canvasSize.x/2, canvasSize.y/2 + 75);
    if(!send){
    playerName = nameInput.value();
    scoreButton.Update();
    }
    else{
    nameInput.position(-canvasSize.x/2, -canvasSize.y/2);
    }
  }
  
  function ScoreBoard(){
    mainMenu = false;
    scoreboard = true;
    GetScores();
    mainMenuButton.Update();
  
  }
  
  function LoadMainMenu(){
    mainMenu = true;
    scoreboard = false;
    nameInput.position(-canvasSize.x/2, -canvasSize.y/2);
    scorelist.length = 0;
  }
  
  function SendScore(){
    url = 'https://oege.ie.hva.nl/gd/blok1/highscore/save.php?' + "game=" + gameID + "&name=" + playerName + "&score=" + floor(score);
    httpGet(url, "json", false, function(response){ print(response)});
    send = true;
  }
  
function GetScores(){
   scores = loadJSON('https://oege.ie.hva.nl/gd/blok1/highscore/load.php?game=' + gameID);
  
  }
  
  function GameWin(){
    fill('Green');
    textSize(100);
    textAlign(CENTER);
    text("You win!", canvasSize.x/2, canvasSize.y/2);
    restartButton.Update();
    ScoreUI();
    mainMenuButton.Update();
  
  }
  

function DrawScoreBoard(){
    textAlign(CENTER);
    fill("White");
    if(scorelist.length == 0){
      for(let data in scores){
        scorelist.push(data);
      }
    }
    for(let i = 0; i <= scorelist.length-2; i +=1){
        if(scores[scorelist[i]].score < scores[scorelist[i+1]].score){
          let temp = scorelist[i];
          scorelist[i] = scorelist[i+1];
          scorelist[i+1] = temp;
        }
          textSize(25);
          text(scores[scorelist[i]].name + ": " + scores[scorelist[i]].score, canvasSize.x/2, 35 + (25 * i));
    }
    mainMenuButton.Update();
  }
  
  function DrawMainMenu(){
      let textPos = createVector(canvasSize.x/2, canvasSize.y/4);
      fill('White');
      textSize(75); 
      textAlign(CENTER);
      text("ALIEN ABDUCTORS!", textPos.x, textPos.y);
      startButton.Update();
      scoreBoardButton.Update();
  }
  