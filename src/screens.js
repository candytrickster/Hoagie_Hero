import AssetLoader from './loader/assetLoader.js';

function Screens() {
	this.assetLoader = new AssetLoader.default();
	this.titleScreen = this.gameOverScreen = null;
	
	this.loadScreens = (callback) => {
		this.assetLoader.loadFiles(() => {
			this.titleScreen = new createjs.Bitmap(this.assetLoader.queue.getResult("title"));
			this.gameOverScreen = new createjs.Bitmap(this.assetLoader.queue.getResult("gameOver"));
			callback(true);
		});		
	};
}

export default Screens;