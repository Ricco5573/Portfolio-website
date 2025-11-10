class MenuSystem {
    #menus;
    #currentMenu;
    #lastMenu;
    #refreshable;
    #changing;
    #index;
    constructor() {
        this.#menus = [];
        this.#currentMenu = 0;
        this.#lastMenu = 0;
        this.#refreshable = true;
        this.#changing = false;
        this.#index = 0;
    }

    Update() {
        if (game.getGameState() === "Menu") {
            if (this.#menus.length === 0) {
                this.#menus.push(new MainMenu);
                this.#menus.push(new OptionsMenu);
                this.#menus.push(new PauseMenu);
                this.#menus.push(new ControlsMenu);
    
                for (let i = 0; i < this.#menus.length;i++) {
                    this.#menus[i].startup();
                }
                
            } else if (this.#refreshable === false) {
                if (this.#menuInteracting()) {
                    this.#changing = true;
                    this.#refreshable = true;
                }
            } else if (this.#refreshable === true) {
                this.#refreshable = false;
                
                this.#showText();
                this.#showSelector();
                
                this.#menus[this.#currentMenu].Update();
            }
        }
    }

    #showText() {
        background("white");

        let options = this.#menus[this.#currentMenu].getOptions();
        
        push();

        textAlign(CENTER);
        textSize(30);
        textFont("Times New Roman");
        fill("black");
        strokeWeight(1);
        stroke(1);

        for (let i = 0; i < this.#menus[this.#currentMenu].options.length;i++) {
            text(options[i].text,canvasSize.x/2,canvasSize.y - canvasSize.y + 340 + 50 * (1 + i))
        }

        pop();
    }

    #showSelector() {
        push();

        fill(0,0,0,0);
        stroke("black");
        strokeWeight(2);
        textSize(30);

        let plol = textWidth(this.#menus[this.#currentMenu].getOptions()[this.#index].text);

        rect(canvasSize.x/2, 347 + textAscent() + textDescent() + 50 * this.#index,plol + 10,textAscent() + textDescent());

        pop();
    }

    #menuInteracting() {
        if (this.#refreshable === false && this.#changing === false) {
            if (keyIsDown(13)) {
                this.#select();

                return true;
            } else if (keyIsDown(83) || keyIsDown(40)) {
                this.#index = constrain(this.#index + 1,0,this.#menus[this.#currentMenu].options.length - 1);

                return true;
            } else if (keyIsDown(87) || keyIsDown(38)) {
                this.#index = constrain(this.#index - 1,0,this.#menus[this.#currentMenu].options.length - 1);

                return true;
            }
        } else if (!keyIsDown(83) && !keyIsDown(87) && !keyIsDown(40) && !keyIsDown(38) && !keyIsDown(13)){
            this.#changing = false;
            this.#refreshable === false;
        }
    }

    #select() {
        switch(this.#menus[this.#currentMenu].getOptions()[this.#index].text) {
            case "Play":
                this.changeMenu(2);

                playerID = random(0,1) * 100000000;

                NewGame(playerID);
               // ChangePlayerID();
                
                restart.restart();
                game.changeState("Playing");
                break;
            case "Resume" : 
                game.changeState("Playing");
                break;
            case "Save & Quit":
                this.changeMenu(0);
                
                SavePlayerData();

                this.#index = 0;
                break;
            case "Options" : 
                this.#lastMenu = this.#currentMenu;
                this.changeMenu(1);
                this.#index = 0;
                break;
            case "Return" : 
                this.changeMenu(this.#lastMenu);
                this.#index = 0;
                break;
            case "Controls" : 
                this.#lastMenu = this.#currentMenu;
                this.changeMenu(3);
                this.#index = 0;
        }
    }

    /* Can be used externally.
     * Menus available :
     * 0 = Main Menu;
     * 1 = Options Menu;
     * 2 = Pause Menu.
    =*/
    changeMenu(menu) {
        this.#currentMenu = menu;
    }
}

class Menu {
    options;
    constructor() {
        this.options = [];
    }

    Update() {}

    getOptions() {
        return this.options;
    }
}

class MainMenu extends Menu{
    constructor(options) {
        super(options);
    }

    startup() {
        this.options = [
            {text : "Play"},
            {text : "Options"},
            {text : "Controls"}
        ];
    }
}

class OptionsMenu extends Menu{
    constructor(options) {
        super(options);
    }

    startup() {
        this.options = [
            {text : "Option1"},
            {text : "Option2"},
            {text : "Option3"},
            {text : "Option4"},
            {text : "Return"},
        ];
    }
}

class PauseMenu extends Menu{
    constructor(options) {
        super(options);
    }

    startup() {
        this.options = [
            {text : "Resume"},
            {text : "Options"},
            {text : "Save & Quit"}
        ];
    }
}

class ControlsMenu extends Menu{
    #controls;
    constructor(options) {
        super(options);
        this.#controls;
    }

    Update() {
        this.#show();
    }

    #show() {
        push();

        textSize(30);
        textAlign(CENTER);
        textFont("Times New Roman");
        strokeWeight(1);
        stroke(1);
        fill(0,0,0,0);
        for (let i = 0; i < this.#controls.length;i++) {
            text(this.#controls[i].text,canvasSize.x/2,500 + 50 * i);
        }
        
        pop();

        fill(0,0,0,0);
        strokeWeight(5);
        rect(canvasSize.x/2,620,500,350);
    }

    startup() {
        this.options = [
            {text : "Return"}
        ];

        this.#controls = [
            {text : "Press Space to jump"},
            {text : "Press Space while in air to double jump"},
            {text : "Hold A to move left"},
            {text : "Hold D to move right"},
            {text : "Click left mouse button to shoot"},
            {text : "Press shift to dash"}
        ]
    }
}

class LevelEditorMenu extends Menu {
    constructor(options) {
        super(options);
    }

    startup() {
        this.options = {}
    }
}