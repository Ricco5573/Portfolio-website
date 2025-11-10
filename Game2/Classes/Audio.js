let Sounds = [];

/*
A list of currently initialized sounds and their index.

0: UI button click.
1: Place object impact.
2: another click 
3: footstep 1
4: footstep 2
5: Jump
6: Land
7: double jump & dash
8: title pop
9: Shot
10: Shot no bullets
*/
function InitializeSound(sound){
    let array = [];
    for(let i = 0; i <=5; i+=1){
        let sond = new Audio(sound)
        sond.onEnded = (event) => {
            sond.stop();
        };
        array.push(sond);
    }
    Sounds.push(array);
}

function PlaySound(index){

    for(let sound of Sounds[index] ){
        if(sound.paused){
            sound.play();
            return;
        }
    }
}




Audio.prototype.stop = function() {
    this.pause();
    this.currentTime = 0;
}