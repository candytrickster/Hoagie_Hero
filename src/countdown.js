import { FPS } from './constants/gameConstants.js';

function CountDown(x, y, count, color) {
	this.x = x;
	this.y = y;
	this.view.count = count || 3;
	this.color = color || "#000";
	this.view = new createjs.Text(this.score, "48px Arial", this.color);
	this.view.x = this.x;
	this.view.y = this.y;
	this.view.frameCount = 0;
	this.view.addEventListener('tick', tick.bind(this.view));
	
	function tick(e) {
		this.frameCount++;
		
		if(this.frameCount % (FPS) === 0 ) {
			if(this.count > 0) {
				this.count -= 1;	
			} else {
				this.visible = false;
			}
        }
	}
}

export default CountDown;