import { FPS } from './constants/gameConstants.js';

function CountDown(stage, x, y, count, color, doneCallback) {
	this.stage = stage;
	this.x = x;
	this.y = y;
	this.count = count || 4;
	this.color = color || "#fff";
	this.doneCallback = doneCallback
	this.view = new createjs.Text(this.count, "48px Arial", this.color);
	this.view.x = this.x;
	this.view.y = this.y;
	this.frameCount = 0;
	createjs.Ticker.addEventListener('tick', tick.bind(this));
	this.stage.addChild(this.view);
	
	function updateTimerView() {
		this.view.text = this.count;
		this.stage.update();
	}
	
	function tick(e) {
		this.frameCount++;
		if(this.frameCount % (FPS) === 0 ) {
			if(this.count > 1) {
				this.count -= 1;
				updateTimerView.call(this);
			} else {
				createjs.Ticker.removeAllEventListeners('tick');
				this.doneCallback();
				this.visible = false;
			}
        }
	}
}

export default CountDown;