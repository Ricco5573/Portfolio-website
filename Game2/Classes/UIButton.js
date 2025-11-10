class UIButton extends CollisionObject{
    onClick;
    hovered = false;
    constructor(position, size,renderLayer, sprite, onClick){
        super(position, size, renderLayer, sprite);
        this.onClick = onClick;
    }
    Click(){
        this.onClick();
        PlaySound(0);

    }
    Update(){
        let sprite = this.GetSprite();
        if(!this.hovered){
        fill("Black");
        }
        else{
        fill("Blue");
        }
        rect(this.position.x, this.position.y, this.size.x, this.size.y)
        if(sprite !== null && sprite !== undefined){
        image(sprite, this.position.x + (this.size.x/4), this.position.y + (this.size.y/4));
        }
    }
    Press(){
        if(this.hovered){
            this.Click();
            PlaySound(0);
        }
    }
    checkCollision(position, size){
        if(super.checkCollision(position, size)){
            this.hovered = true;
            return true;
        }
        else{
            this.hovered = false;
            return false;
        }
    }
}

class TextButton extends UIButton{
    #text
    constructor(position, size, renderLayer, onClick, text){
        super(position, size, renderLayer, null, onClick);
        this.#text = text;
    }
    Update(){
        super.Update();
        fill("White");
        text(this.#text, this.position.x, this.position.y + this.size.y/2, this.size.x, this.size.y);
    }
    Click(){
        this.onClick(1);
        PlaySound(0);

    }
}
class LevelButton extends TextButton{
    #levelIndex;
    constructor(position, size, renderLayer, onClick, text, levelIndex){
        super(position, size, renderLayer,onClick, text);
        this.#levelIndex = levelIndex;
    }
    Click(){
        this.onClick(this.#levelIndex);
        state = "Play";
    }
}
class SpriteButton extends UIButton{
    #spriteIndex;
    #parent;
    constructor(position, size, renderLayer, onClick, sprite, spriteIndex, parent){
        super(position, size, renderLayer, sprite, onClick)
        this.#spriteIndex = spriteIndex;
        this.#parent = parent;
    }
    Click(){
        let args = [this.#spriteIndex]; 
        this.onClick.call(this.#parent,this.#spriteIndex);
        PlaySound(0);

    }
}


class UnfoldButton extends UIButton{
    #parent;
    constructor(position, size, renderLayer, onClick, sprites, parent){
        super(position, size, renderLayer,sprites[0], onClick);
        this.#parent = parent;
    }
    Click(){
        this.onClick.call(this.#parent);
        PlaySound(0);

    }
    Update(){
        fill("Grey");
        if(this.hovered){
            fill("Blue");
        }
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
        fill("White");
        triangle(this.position.x + 5, this.position.y +5,
            this.position.x +5, this.position.y-5,
            this.position.x -5, this.position.y
        );

    }
}
class BuildButton extends UIButton{
    #linkedObject;
    #object
    selectedSprite;
    #sprites = [];
    #spriteButtons = [];
    #unfolded = false;
    #canUnfold = false;
    #unfoldButton;
    constructor(position, size, renderLayer, sprite, onClick, object, imgs){
        if(sprite != null ){
            super(position, size, renderLayer, sprite, onClick);
            }
        else{
            super(position, size, renderLayer, imgs[0], onClick);
            this.selectedSprite = 0;
            this.#canUnfold = true;
            this.#unfoldButton = new UnfoldButton(createVector(this.position.x - this.size.x/2 - 20, this.position.y),
            createVector(40, this.size.y), 12, this.ToggleFold, imgs, this);
        }
        this.#sprites = imgs;
        this.#object = object;
        this.selectedSprite = 0;


    }
    Update(){
        let camPos = cam.GetPosition(); 
        if(this.#unfoldButton !== undefined){
            let pos = createVector((this.position.x-this.size.x/2 - 20), this.position.y)
            this.#unfoldButton.position = pos;
            this.#unfoldButton.Update();
        }
        if(this.#unfolded){
            let divisions;
            if(this.#sprites.length > 50){
                divisions = 8;
            }
            else{
                divisions = 2;
            }
            let size = createVector(this.#sprites.length/2 /divisions* 64, 4*64);
            let pos = createVector(this.position.x - this.size.x/2 - 40 - size.x/2, this.position.y + size.y/2);
            fill("Red");
            let length = this.#sprites.length/divisions
            if(this.#spriteButtons.length == 0){
                for(let i = 0; i <= divisions; i+=1){
                    for(let j = 0; j <= length; j+=1){
                        let spriteIndex;
                        if(i == 0){
                            spriteIndex = j
                        }
                        else{
                            if(j!= 0){
                            spriteIndex = floor(j + (length * i));
                        }
                        else{
                            spriteIndex = floor(length * i);
                        }
                    }
                        let buttonPos = createVector((pos.x - size.x/2) + 64 * j, pos.y - size.y/2 +i * 64);
                        let button = new SpriteButton(buttonPos, createVector(64,64), 12,this.SelectSprite, this.#sprites[spriteIndex],spriteIndex, this);
                        this.#spriteButtons.push(button);
                    }
                }
            }
            let index = createVector(0,0);
            for(let button of this.#spriteButtons){
                let buttonPos = createVector((pos.x - size.x/2) + 64 * index.x, pos.y - size.y/2 +index.y* 64);
                button.position = buttonPos;
                button.Update();
                index.x +=1;
                if(index.x > this.#sprites.length /2/divisions){
                    index.x = 0;
                    index.y +=1;
                }

            }

        }
        
        else if(this.#spriteButtons.length >=1){
            this.#spriteButtons = [];
        }
        super.Update();
        if(this.#sprites !== undefined){
            super.SetSprite(this.#sprites[this.selectedSprite]);

        }

    }
    ToggleFold(){
        this.#unfolded = !this.#unfolded;
    }
    SelectSprite(index){
        this.selectedSprite = index;
        this.#unfolded = false;

    }
    GetLinkedObject(){
        return this.#linkedObject;  
    }
    Click(){
        PlaySound(0);

        if(this.#object == Platform){
            this.#linkedObject = new this.#object(createVector(0,0), createVector(32,32), 11, "normal");
            this.#linkedObject.SetSprite(this.#sprites[this.selectedSprite]);
            this.#linkedObject.spriteIndex = 21 + this.selectedSprite;
        }
        if(this.#object == MovingPlatform){
            this.#linkedObject = new this.#object(createVector(0,0), createVector(32,32), 11, "VerticalMover", createVector(0,0)); 
            this.#linkedObject.SetSprite(this.#sprites[this.selectedSprite])
            this.#linkedObject.spriteIndex = 21 + this.selectedSprite;
        }
        if(this.#object == SteamRelay){
            this.#linkedObject = new this.#object(createVector(0,0), createVector(32,64), 9, sprites[7])
            this.#linkedObject.spriteIndex = 7;

        }
        if(this.#object == StaticDecor){
            this.#linkedObject = new this.#object(createVector(0,0), createVector(32,64), 8, this.#sprites[this.selectedSprite], this.selectedSprite);
            this.#linkedObject.spriteIndex = this.selectedSprite;
       
        }
        if(this.#object == ChaseEnemy){
            this.#linkedObject = new this.#object(createVector(0,0), createVector(96,96), 11)
            this.#linkedObject.spriteIndex = -1;
        }
        if(this.#object == TitleTrigger){
            this.#linkedObject = new this.#object(createVector(0,0), createVector(1,1), 12, "None", 1500);
        }
        if(this.#object == Goal){
            this.#linkedObject = new this.#object(createVector(0,0), createVector(32,64), 12);
        }
        this.onClick(this.#linkedObject);
    }
    Press(){
        if(this.hovered){
            this.Click();
        }
        else{
            if(this.#unfoldButton !== undefined){
                this.#unfoldButton.Press();
            }
            if(this.#spriteButtons.length != 0){
                for(let button of this.#spriteButtons){
                    button.Press();
                }
            }
        }
    }
    checkCollision(position, size){
        if(super.checkCollision(position, size)){
            this.hovered = true;
            return true;
        }
        else{
            this.hovered = false;
            if(this.#unfoldButton !== undefined){
                if(this.#unfoldButton.checkCollision(position, size)){
                    return true;
                }
            }
            let col = false;
            if(this.#spriteButtons.length != 0){
                for(let button of this.#spriteButtons){
                    if(button.checkCollision(position, size)){
                        col = true;
                    }
                }
            }
            if(col){
                return true;
            }
        return false;

        }
    }
}
