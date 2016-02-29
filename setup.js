var stage;

manifest = [
    
];

var sprites, walk;

var buttons;

var game_state;

var state = {
    TITLE: 'title',
    INSTRUCTIONS: 'instructions',
    PLAY: 'play',
    GAME_OVER: 'gameover'
};

function setGameState(state)
{
    game_state = state;
    gameLoop();
}


function loadComplete(evt) {
    
    setGameState(state.TITLE);
}

function loadFiles() {
    queue = new createjs.LoadQueue(true, "assets/");
    queue.on("complete", loadComplete, this);
    queue.loadManifest(manifest);
}

function setupCanvas() {
    var canvas = document.getElementById("game");
    canvas.width = 800;
    canvas.height = 600;
    stage = new createjs.Stage(canvas);
}

function main() {
    setupCanvas();
    loadFiles();    
}

main();
var FPS = 30;
function loop() {
    
    stage.update();
}
createjs.Ticker.addEventListener("tick", loop);
createjs.Ticker.setFPS(FPS);

var gameTimer = 0;
var frameCount = 0;

function resetGameTimer() {
    gameTimer = 0;
    frameCount = 0;
}
function runGameTimer() {
    frameCount += 1;
    if(frameCount%(FPS/10) === 0) {
        gameTimer = frameCount/(FPS);
    }
}



















