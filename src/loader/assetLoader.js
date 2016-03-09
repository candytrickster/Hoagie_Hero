const manifest = [
    {src: "title.png", id:"title"},
	{src: "gameover.png", id:"gameOver"},
];

function Preloader() {
    this.queue = null;
    
    this.loadFiles = (callback) => {
        this.queue = new createjs.LoadQueue(true, "assets/images/");
        this.queue.on("complete", callback, this);
        this.queue.loadManifest(manifest);
    }
}

export default Preloader;