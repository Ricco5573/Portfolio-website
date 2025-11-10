let backgroundImage;
let platform1;
let platform2;
let canvasSize;
let player;
let spriteSheet;
let spriteSheetDimensions;
let spriteSize;
const sprites = [];
let uiManager;
let camPos ;
let camWantedPos;
let projectiles;
const mapObjects = [];
let baseMapLoaded = false;
const platforms = [];
let plat;
let cam;
let adjusted0Pos;
const enemies = [];

let game;
let menuSystem;

let pauseBackground;

const staticDecor = [];
let renderer;

let playerID;
let lastDeathLocation;

const CONFIG_URL = "https://api.hbo-ict.cloud";
const CONFIG_APIKEY = "pb2gdg2425_ruucoozaavii41.CmpTkdBXNA4P9t7G";
const CONFIG_DATABASE = "pb2gdg2425_ruucoozaavii41_live";

let editMode;
let editing;
let gameOver = false;
let gameWon = false;
let pauzed = false;
let editeableObjects = [];  
let loadedLevels = [];
let selectedObject = null; 
let mapIndex = 0;
let state;
let titleFont;
let mouseDown;
let mouseDragPos;
function preload() {
    //backgroundImage = loadImage('./assets/images/background.png');
    let configuration = {url:CONFIG_URL, apiKey:CONFIG_APIKEY, database:CONFIG_DATABASE};
    HICCloud.API.configure(configuration);
    InitializeSounds();
    spriteSheet = loadImage('./assets/images/spriteSheet1.png');
    canvasSize = createVector(windowWidth, windowHeight);
    state = "Main Menu";
    editMode = false;
    editing = editMode;
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

async function LoadSpriteSheet(){
    spriteSheetDimensions = createVector(20,14);
    spriteSize = createVector(32,32);
    for(let y = 0; y <= spriteSheetDimensions.y; y++){
        for(let x = 0; x <= spriteSheetDimensions.x; x++){
            let sprite = createImage(32,32)
            if(y == 0){
                sprite.resize(32,64)
             sprite.copy(spriteSheet, spriteSize.x * x, spriteSize.y * y, spriteSize.x, spriteSize.y * 2, 0, 0 , spriteSize.x, spriteSize.y * 2);
            }
            else{
                sprite.copy(spriteSheet, spriteSize.x * x, spriteSize.y * (y+1), spriteSize.x, spriteSize.y , 0, 0 , spriteSize.x, spriteSize.y);
            }
            sprites.push(sprite);
        }
    }
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function setup() {
    plat = new Platforms();

    LoadMapFromJSON(1);

    titleFont = loadFont('./assets/Title.ttf');
    document.addEventListener('contextmenu', event => event.preventDefault());
    LoadSpriteSheet()   
    renderer = new Renderer();
    uiManager = new UIManager();
    restart = new Restart();
    projectiles = new ProjectileEntities();
    rectMode(CENTER);
    camPos = createVector(0,0);
    camWantedPos  = createVector(0,0);
    createCanvas(canvasSize.x, canvasSize.y);
    restart.restart();
    game = new GameState();
    menuSystem = new MenuSystem();
    InitializeEditableObjects();
}

function draw() {
    fill("Black");
    background(backgroundImage, width, height);

    if(state == "Play" && cam !== undefined && cam !== null){
    cam.Update();
    UpdateObjects();
    updateProjectiles();
    imageMode(CORNERS);
    fill("white");
    // Object renderer
    renderer.Render();
    let camPos = cam.GetPosition();
    if(camPos){
    adjusted0Pos = createVector(camPos.x - canvasSize.x/2, camPos.y - canvasSize.y/2)
    }
    //UI is rendered on top of everything else. And independently of the moving camera
  //  console.log(staticDecor);
    if(!editing){
        uiManager.UpdateUI();
    }
    else{
        UpdateEditerMode();
    }
    }

    else if(state == "Main Menu"){
        uiManager.UpdateMainMenu();
    }
}

function UpdateObjects(){
    for(let object of mapObjects){
        if(object !== null && object !== undefined){
        object.Update();
        }
    }
}

function StartMainGame(){
    state = "Play";
    LoadMapFromJSON(1);
}

function updateProjectiles() {
    for (let projectile of projectiles.projectiles) {
        projectile.Update();
    }
}

async function LoadEditLevels(){
    editMode = true;
    console.log(editMode);
    await LoadLevels();
    uiManager.ChangeUIState("Edit LevelSelect");
}

async function LoadLevelCaller(){
    await LoadLevels();
    editMode = false;
    uiManager.ChangeUIState("LevelSelect");
}

function CreateEmptyLevel(){
    state = "Play";
    mapObjects.length = 0;
    plat.platforms.length = 0;
    mapIndex = 0;
    mapObjects.push(plat);
    player = new Player(createVector(0,0),createVector(22,31), 10, 10);
    mapObjects.push(player);
    cam = new Camera(true);
}

async function LoadLevels(){
    loadedLevels.length = 0;
    let query = "SELECT MapId, MapName from Maps";
    let levels = await HICCloud.API.queryDatabase(query);
    for(let level of levels){
        loadedLevels.push(level);
    }
}

function keyPressed() {
    if (key === "r" && player === null) {
        restart.restart();
    } else if (key === "p") {
        restart.restart();
    }
}

async function SaveMapToJSON(name, id){
    let json = [];
    let query = `INSERT INTO Maps (MapId, MapName, MapData) VALUES (${id}, "${name}",?);`
    for(let object of mapObjects){
        let objectIndex;
        let data = [];
        if(object != plat){
            //print(object.constructor.name);
        switch(object.constructor.name){
            case "StaticDecor": objectIndex = 3; break;
            case "SteamRelay": objectIndex = 4; break;
            case "ChaseEnemy": objectIndex = 5;break;
            case "Player": objectIndex = 6; break;
            case "TitleTrigger": objectIndex = 7; break;
            case "Goal": objectIndex = 8; break; 
        }
        if(objectIndex != 7){
        data = { objIndex: objectIndex, pos: object.GetPosition(),size: object.GetSize(),
        layer: object.renderLayer,spriteIndex: object.spriteIndex};
        }
        else{
        data = { objIndex: objectIndex, pos: object.GetPosition(),size: object.GetSize(),
            layer: object.renderLayer, title: object.title, time: 5000}
        }
        print(object.spriteIndex)
        json.push(data);        
    }

    else{
        for(let platform of plat.platforms){
            let pos;
            if(platform.constructor.name == "MovingPlatform"){
                objectIndex = 2;
                pos = platform.firstPosition;
                data = {objIndex: objectIndex, pos: pos, movePos: platform.secondPosition, size: platform.GetSize(), 
                    layer: platform.renderLayer, spriteIndex: platform.spriteIndex}
            }
            else if(platform.constructor.name == "Platform"){
                objectIndex = 1;
                pos = platform.GetPosition();
                data = {objIndex: objectIndex, pos: pos, size: platform.GetSize(), 
                    layer: platform.renderLayer, spriteIndex: platform.spriteIndex}
            }
            json.push(data);
        }
    }
    }
    let file = JSON.stringify(json);
    if(id !== 0){
        let check = "SELECT * from Maps Where MapId = ?";
        let data = await HICCloud.API.queryDatabase(check, id);
        if(data[0] !== undefined && data[0].MapName != null){
            query = `UPDATE Maps SET MapData = ?, MapName = "${name}" WHERE MapId = ${id}`;
            let queryargs = [file];
            HICCloud.API.queryDatabase(query, queryargs);
            return;
       }
    }
    else{
    let queryargs = [file];
    await HICCloud.API.queryDatabase(query,queryargs);
    }
}

async function LoadMapFromJSON(mapID){

    let query = "SELECT MapData from Maps WHERE MapId = ?";
    let map = await HICCloud.API.queryDatabase(query, mapID);
    mapIndex = mapID;
    let play;
    map = JSON.parse(map[0].MapData);
    if(mapID != 1 || !baseMapLoaded){
    plat.platforms.length = 0;
    mapObjects.splice(0, mapObjects.length);
    for(let object of map){
        let mapobj;
        let frames = frameRate();
        if(frames <= 20){
            await sleep(10);
        }
        switch(object.objIndex){
            case 1: mapobj = new Platform(object.pos, object.size, object.layer, "Normal",object.spriteIndex);
                mapobj.SetSprite(sprites[object.spriteIndex]);
              plat.platforms.push(mapobj);
                break;
            case 2: mapobj = new MovingPlatform(object.pos, object.size, object.layer, "Moving", object.movePos,object.spriteIndex);
                mapobj.SetSprite(sprites[object.spriteIndex]);
                 plat.platforms.push(mapobj);
                break;
            case 3: mapobj = new StaticDecor(object.pos, object.size, object.layer, sprites[object.spriteIndex], "Normal", object.spriteIndex);
                mapObjects.push(mapobj);
                 mapobj.SetSprite(sprites[object.spriteIndex])
                break;
            case 4: mapobj = new SteamRelay(object.pos, object.size, object.layer, sprites[object.spriteIndex],7);
                 mapObjects.push(mapobj);
                break;
            case 5: mapobj = new ChaseEnemy(object.pos, object.size, object.layer);
                 mapObjects.push(mapobj);
                break;
            case 6: mapobj = new Player(object.pos, object.size, object.layer,10);
                play = mapobj;
                break;
            case 7: mapobj = new TitleTrigger(object.pos, object.size, object.layer, object.title, object.time);
                 mapObjects.push(mapobj);
                break;
            case 8: mapobj = new Goal(object.pos, object.size, object.layer);
                mapObjects.push(mapobj);
                break;
        }   
    }
    mapObjects.push(plat);

    if(play === undefined || play === null){
        player = new Player(createVector(150,0),createVector(22,31), 10, 10);
        mapObjects.push(player);
    }
    else{
        player = play;
        mapObjects.push(player);
    }
    if(mapID == 1){
        baseMapLoaded = true;
    }
    else {
        baseMapLoaded = false;
    }

    cam = new Camera(editMode);
    mapObjects.push(plat);

    }
    await sleep(10);

    print("Done loading");

}

function DeleteMapFromDatabase(mapId){
    let query = "DELETE FROM Maps WHERE MapId = ?";
    HICCloud.API.queryDatabse(query, mapId);
}

function LoadMainMenu(){
    state = "Main Menu";
    cam = null;
    player = null;
    uiManager.ChangeUIState("Menu");
}

async function SaveCurrentMap(){
    let name = prompt("Map name");
    if(mapIndex != undefined){
    SaveMapToJSON(name, mapIndex);
    }
    else{
    SaveMapToJSON(name, random(0, 10000));
    }
}

function InitializeEditableObjects(){
    editeableObjects.push(Platform);
    editeableObjects.push(MovingPlatform);
    editeableObjects.push(StaticDecor);
    editeableObjects.push(SteamRelay);
    editeableObjects.push(ChaseEnemy);
    editeableObjects.push(TitleTrigger);
    editeableObjects.push(Goal);
}

function SavePlayerData() {
    let data = {positionx : player.position.x,
                positiony : player.position.y,
                steam : player.steam,
                bullets : player.GetAmmo()};

    let json = JSON.stringify(data);
    let query = "UPDATE player \
                 SET data = '?' \
                 WHERE player_id = ? \ ";
    console.log(json);
    HICCloud.API.queryDatabase(query,([json],playerID));
}

function SaveDeathLocations(posx,posy) {
    let query = "INSERT INTO ghost (positionx,positiony,Player_player_id) VALUES (?,?,?)"
 //   let json = JSON.stringify(lastDeathLocation);
    HICCloud.API.queryDatabase(query,posx,posy,playerID);
}

function NewGame() {
    let query = "INSERT INTO player (player_id,data,name) VALUES (?,'?','test')";
    HICCloud.API.queryDatabase(query,([playerID,'[{"positionx":7,"positiony":10,"steam":50,"bullets":5}]']));
}


function InitializeSounds(){
    InitializeSound("./assets/Audio/Sounds/click.wav");
    InitializeSound("./assets/Audio/Sounds/Place.wav");
    InitializeSound("./assets/Audio/Sounds/ModeSwitch.wav");
    InitializeSound("./assets/Audio/Sounds/Step1.wav");
    InitializeSound("./assets/Audio/Sounds/Step2.wav");
    InitializeSound("./assets/Audio/Sounds/Jump.wav");
    InitializeSound("./assets/Audio/Sounds/Land.wav");
    InitializeSound("./assets/Audio/Sounds/DoubleJump.wav");
    InitializeSound("./assets/Audio/Sounds/Title.wav");
    InitializeSound("./assets/Audio/Sounds/Shot.wav");
    InitializeSound("./assets/Audio/Sounds/ShotEmpty.wav");
}
//async function ChangePlayerID() {
   // let query;
   // let response = HICCloud.API.queryDatabase(query,)
//}
