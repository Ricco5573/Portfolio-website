class GameState {
    #gamestate
    constructor() {
        this.#gamestate = "Menu";
    }

    Update() {
        if (this.#gamestate === "Menu") {
            menuSystem.Update();
        } else if (this.#gamestate === "Playing") {
            UpdateCameraPosition();

            if (player.GetDeadState() === false){
                player.Update();
            }
            
            UpdateDecor();
            UpdateEnemies();
            updatePlatforms();
            updateProjectiles();
            imageMode(CORNERS);
        
            fill("white");
            background(backgroundImage, width, height);
            // Object renderer
            renderer.Render();
            //UI is rendered on top of everything else. And independently of the moving camera
            uiManager.UpdateUI();
        }
    }

    getGameState() {
        return this.#gamestate;
    }

    changeState(state) {
        this.#gamestate = state;
    }
}