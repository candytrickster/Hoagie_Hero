import Food from './food.js';

function FoodSpawner(world, stage) {
	this.world = world;
	this.stage = stage;
	this.currentItems = [];
	
	this.startDrop = (totalItems, intervalTime) => {
		let itemsDropped = 0;
		
		const itemDropInterval = () => {
			if(itemsDropped < totalItems) {
				const foodItem = new Food.default(this.world, 80, 30, '#00ff00');
				this.currentItems.push(foodItem);
				itemsDropped++;
				this.stage.addChild(foodItem.view);	
			} else {
				stopInterval();
			}
		};
		
		const stopInterval = () => {
			clearInterval(itemDropInterval);
		}
		
		setInterval(itemDropInterval, intervalTime);
	}; 	
}

export default FoodSpawner;