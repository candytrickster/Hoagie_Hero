import { TOTAL_HEALTH } from './constants/gameConstants.js';

const healthBarColors = {
    background: "#CCC",
    goodHealth: "#00ff00",
    dangerHealth: "#FF9100",
    dieing: "#ff0000"
}

function HealthBar(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.health = TOTAL_HEALTH;
	this.view = {};
	this.view.background = new createjs.Shape();
	this.view.background.graphics.beginFill(healthBarColors.background)
								 .drawRect(this.x, this.y, this.width, this.height);
	this.view.healthBar = new createjs.Shape();
	this.view.healthBar.graphics.beginFill(healthBarColors.goodHealth)
								.drawRect(this.x, this.y, this.width, this.height);
	
	this.update = (newHealth) => {
		this.health -= newHealth;
		if(this.health >= 100) {
			this.health = 100;
		}
		const percent = this.health / TOTAL_HEALTH;
		let barColor = (this.health >= 80) ? healthBarColors.goodHealth :
            (this.health > 50) ? healthBarColors.dangerHealth : healthBarColors.dieing;
        
        this.view.healthBar.graphics
            .clear()
            .beginFill(barColor)
            .drawRect(this.x, this.y, this.width * percent, this.height);	
	};
	
	this.reset = () => {
		this.health = TOTAL_HEALTH;
		this.view.healthBar.graphics
            .clear()
            .beginFill(healthBarColors.goodHealth)
            .drawRect(this.x, this.y, this.width, this.height);
	};
};

export default HealthBar;