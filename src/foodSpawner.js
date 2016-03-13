import Food from './food.js';
import HealthPack from './healthPack.js';
import ItemsLeft from './itemsLeft.js';
import { SCREEN_WIDTH } from './constants/gameConstants.js';

function FoodSpawner(world, stage) {
	this.world = world;
	this.stage = stage;
	this.currentItems = [];
	
	this.startDrop = (totalItems, intervalTime) => {
		let itemsDropped = 0;
		this.itemsLeft = new ItemsLeft.default((SCREEN_WIDTH / 2) - 100, 20, totalItems, "#fff");
		this.stage.addChild(this.itemsLeft.view);
		
		this.itemDropInterval = () => {
			if(itemsDropped < totalItems) {
				let foodItem;
				const random = (Math.random() * 5);
				if(random > 3 && random < 4) {
					foodItem = new Food.default(this.world, this.currentItems.length, 80, 30, '#00ff00', true);
				} else if(random >= 4) {
					foodItem = new HealthPack.default(this.world, 80, 30, '#00ff00');
				} else {
					this.itemsLeft.update(-1);
					foodItem = new Food.default(this.world, this.currentItems.length, 80, 30, '#00ff00');
					this.currentItems.push(foodItem);
					itemsDropped++;
				}
				this.stage.addChild(foodItem.view);	
			} else {
				stopInterval();
			}
		};
		
		const stopInterval = () => {
			clearInterval(this.itemDropInterval);
		}
		
		setInterval(this.itemDropInterval, intervalTime);
	}; 	
	
	this.clear = () => {
		this.currentItems = [];
		this.itemsLeft.clear();
		clearInterval(this.itemDropInterval);
	};
}

export default FoodSpawner;