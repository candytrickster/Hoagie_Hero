import Food from './food.js';

function FoodSpawner(world, stage) {
	this.world = world;
	this.stage = stage;
	this.currentItems = [];
	
	this.startDrop = (totalItems, intervalTime) => {
		let itemsDropped = 0;
		
		this.itemDropInterval = () => {
			if(itemsDropped < totalItems) {
				const foodItem = new Food.default(this.world, this.currentItems.length, 80, 30, '#00ff00');
				this.currentItems.push(foodItem);
				itemsDropped++;
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
		this.currentItems.splice(0, this.currentItems.length);
		clearInterval(this.itemDropInterval);
	};
}

export default FoodSpawner;