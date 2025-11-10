let SelectingPosition = false;
let copiedObject;
function SelectObject(object){

    selectedObject = object; 
}

function UpdateEditerMode(){
        EditingUI();
        UpdateSelectedObject();
}

function EditingUI(){
    pauzed = editing;
    if(editing){
    uiManager.ShowEditingUI();
    if(mouseX < canvasSize.x * 0.9){
        if(selectedObject !== null && mouseButton === LEFT && mouseIsPressed === true){
            SpawnObject();
        }  
    }
    if(keyIsDown(82)){
        ErasorTool();
    }
    }
}

function UpdateSelectedObject(){
    let camPos = cam.GetPosition();
    let zoom = cam.GetZoom();
    if(mouseDown && mouseDragPos != null){
        push()
        let mousePos = createVector(Math.round(((mouseX + camPos.x - canvasSize.x/2)/zoom)/32)*32, Math.round(((mouseY + camPos.y-canvasSize.y/2)/zoom)/32)*32);
        rectMode(CORNERS);
        stroke("Green");
        strokeWeight(2);
        noFill();
        rect(mouseDragPos.x*zoom, mouseDragPos.y*zoom, mousePos.x*zoom, mousePos.y*zoom);
        pop();
    }
    if(selectedObject !== null && selectedObject !== undefined && !SelectingPosition){
        let size = selectedObject.GetSize();
        pop();
        fill("White");
        textSize(15);
        textAlign(CENTER);  
        text(`Renderlayer: ${selectedObject.renderLayer}` , canvasSize.x * 0.92, canvasSize.y *  0.75);
        text(" Q: -,  E: +", canvasSize.x * 0.92, canvasSize.y * 0.78)
        fill("Red");
        push()
        rectMode(CORNERS)
        text(selectedObject.description, canvasSize.x * 0.875, canvasSize.y *  0.8, canvasSize.x * 0.1, canvasSize.y * 0.25);
        pop();
        if (size.y == 64){
        selectedObject.position = createVector(Math.round(((mouseX + camPos.x - canvasSize.x/2)/zoom)/size.x)*size.x, Math.round(((mouseY + camPos.y-canvasSize.y/2)/zoom)/size.y)*size.y +16);
        }
        else{
        selectedObject.position = createVector(Math.round(((mouseX + camPos.x - canvasSize.x/2)/zoom)/32)*32, Math.round(((mouseY + camPos.y-canvasSize.y/2)/zoom)/32)*32);
        }
        selectedObject.Update();
    }
    else if(SelectingPosition){
        copiedObject.UpdateSecondPosition(createVector(Math.round(((mouseX + camPos.x - canvasSize.x/2)/zoom)/32)*32, Math.round(((mouseY + camPos.y-canvasSize.y/2)/zoom)/32)*32));
    }
}
function ErasorTool(){
    let zoom = cam.GetZoom();
    let camPos = cam.GetPosition();
    let adjustedMousePos = createVector((mouseX + camPos.x - canvasSize.x/2)/zoom, (mouseY + camPos.y-canvasSize.y/2)/zoom);
    for(let object of mapObjects){
        if(object.checkCollision !== undefined && object.checkCollision(adjustedMousePos, createVector(1,1)) && object != player){
            let index = mapObjects.indexOf(object);
            mapObjects.splice(index,1);
        }
    }
    for(let platform of plat.platforms){
        if(platform.checkCollision(adjustedMousePos, createVector(1,1))){
            let index = plat.platforms.indexOf(platform);
            plat.platforms.splice(index,1);
        }
    }
}
function keyPressed(event){
    if(editMode){
    if(key == 'b' || key == "B"){
        PlaySound(2);
        editing = !editing;
        pauzed = editing;
        if(editing){
            cam.StartEditMode();
        }
        else{
            cam.StartPlayMode();
            selectedObject = null;
        }
    }
    if(selectedObject !== null){

    if(key == "Q"|| key == "q"){
        selectedObject.ChangeRenderLayer(constrain(selectedObject.renderLayer -=1, 1, 21));
    }
    else if(key == "E" || key == "e"){
        selectedObject.ChangeRenderLayer(constrain(selectedObject.renderLayer +=1, 1, 21));
    }
}

}
if(key == "Escape"){
    uiManager.TogglePauzeMenu();
    PlaySound(2);

}
if(key == "l" || key == "L"){
    LoadMapFromJSON(1);
}
if(key == "p" || key == "P"){
    player.position = createVector(adjusted0Pos.x + (canvasSize.x/2), adjusted0Pos.y + (canvasSize.y/2));
}
}
function SpawnPlatform(){
    let camPos = cam.GetPosition();
    let zoom = cam.GetZoom();
    let pos1 = mouseDragPos;
    let pos2 = createVector(Math.round(((mouseX + camPos.x - canvasSize.x/2)/zoom)/32)*32, Math.round(((mouseY + camPos.y-canvasSize.y/2)/zoom)/32)*32);
    let position = createVector(Math.round(lerp(pos1.x, pos2.x, 0.5)/32)*32, Math.round(lerp(pos1.y, pos2.y, 0.5)/32)*32);
    let size = createVector(constrain(abs(pos1.x -pos2.x),32,3200), constrain(abs(pos1.y- pos2.y),32,3200));
    let obj = new Platform(position, size, selectedObject.renderLayer, "normal", selectedObject.spriteIndex);
    obj.SetSprite(selectedObject.GetSprite());
    plat.platforms.push(obj );
    PlaySound(1);

}
function SpawnTrigger(){
    let camPos = cam.GetPosition();
    let zoom = cam.GetZoom();
    let name = prompt("Title to display");
    let pos1 = mouseDragPos;
    let pos2 = createVector(Math.round(((mouseX + camPos.x - canvasSize.x/2)/zoom)/32)*32, Math.round(((mouseY + camPos.y-canvasSize.y/2)/zoom)/32)*32);
    let position = createVector(Math.round(lerp(pos1.x, pos2.x, 0.5)/32)*32, Math.round(lerp(pos1.y, pos2.y, 0.5)/32)*32);
    let size = createVector(constrain(abs(pos1.x -pos2.x),32,3200), constrain(abs(pos1.y- pos2.y),32,3200));
    let obj = new TitleTrigger(position, size, selectedObject.renderLayer, name, 5000);
    mapObjects.push(obj);   

}

async function SpawnObject(){
    let camPos = cam.GetPosition();
    let overlap = false;
    let zoom = cam.GetZoom();
    let size = createVector(selectedObject.GetSize().x,selectedObject.GetSize().y);
    size.x -= 4;
    size.y -= 4
    for(let object of mapObjects){
       if(object.checkCollision !== undefined &&
        await object.checkCollision(selectedObject.GetPosition(), size) && object.renderLayer == selectedObject.renderLayer){
        overlap = true;
       }
    }
    for(let platform of plat.platforms){
        if(platform.checkCollision(selectedObject.GetPosition(), size) && platform.renderLayer == selectedObject.renderLayer){
            overlap = true; 
        }
    }
    if(!overlap){
        let copy = DeepCopy(selectedObject);
        if(copy != null && copiedObject == null){
        if( selectedObject instanceof SteamRelay){
            mapObjects.push(copy);
            staticDecor.push(copy);
            PlaySound(1);
        }
        else if (selectedObject instanceof Platform){
            if(selectedObject instanceof MovingPlatform){
                SelectingPosition = true;
                copiedObject = copy;
                plat.platforms.push(copy);
                PlaySound(1);

            }
        }
        else{
            mapObjects.push(copy);
            PlaySound(1);

        }
    }
    }
}

function mousePressed(){
    uiManager.ClickUiButton();
    if(selectedObject != null && selectedObject != undefined && editing && selectedObject !== null 
        && mouseX < canvasSize.x *0.9 && mouseButton === LEFT){
        if(!mouseDown){
        let camPos = cam.GetPosition();
        let zoom = cam.GetZoom();
        if(selectedObject.constructor == Platform || selectedObject.constructor == TitleTrigger){
            mouseDown = true;
            mouseDragPos = createVector(Math.round(((mouseX + camPos.x - canvasSize.x/2)/zoom)/32)*32, Math.round(((mouseY + camPos.y-canvasSize.y/2)/zoom)/32)*32);
            }
        }
    }
    else if(mouseButton === RIGHT){
        selectedObject = null;
    }
    
}
function mouseReleased(){
    if(selectedObject != null && selectedObject != undefined
         && mouseDown && mouseX < canvasSize.x *0.9){
            if(selectedObject.constructor == Platform){
                SpawnPlatform();
            }
            else if(selectedObject.constructor == TitleTrigger){
                SpawnTrigger();
            }
        mouseDown = false;
        mouseDragPos = null;
    }
    if(SelectingPosition){
        let zoom = cam.GetZoom();
        let camPos = cam.GetPosition();

        copiedObject.UpdateSecondPosition(createVector(Math.round(((mouseX + camPos.x - canvasSize.x/2)/zoom)/32)*32, Math.round(((mouseY + camPos.y-canvasSize.y/2)/zoom)/32)*32));
        SelectingPosition = false;
        copiedObject = null
    }
}

function DeepCopy(object){
    let copy = null;
    let position = createVector(object.GetPosition().x, object.GetPosition().y);
    let size = createVector(object.GetSize().x, object.GetSize().y);
    switch(object.constructor){
        case  Platform: 
        return null;
        copy = new Platform(position, size,object.renderLayer, "normal");
        copy.SetSprite(selectedObject.GetSprite());
        break;
        case MovingPlatform:
        copy = new MovingPlatform(position, size, object.renderLayer, "VerticalMover", createVector(0,0));
        copy.SetSprite(selectedObject.GetSprite());
        break;
        case SteamRelay: 
        copy = new SteamRelay(object.GetPosition(), object.GetSize(), object.renderLayer, object.GetSprite(), "SteamRelay");
        break;
        case StaticDecor:
        copy = new StaticDecor(object.GetPosition(), object.GetSize(), object.renderLayer, object.GetSprite(), "Normal");
        break;
        case ChaseEnemy:
        copy = new ChaseEnemy(object.GetPosition(), object.GetSize(), object.renderLayer);
        break;
        case TitleTrigger:
        return null;
        break;
        case Goal:
        copy = new Goal(object.GetPosition(), object.GetSize(), object.renderLayer);
        break;
    }
    if(copy.spriteIndex !== null){
    copy.spriteIndex = object.spriteIndex;
    }
    return copy;
}