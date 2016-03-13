function itemsLeft(x, y, items, color) {
	this.x = x;
	this.y = y;
	this.items = items || 10;
	this.color = color || "#000";
	this.view = new createjs.Text("Items\nleft: " + this.items, "20px Arial", this.color);
	this.view.x = this.x;
	this.view.y = this.y;
	
	this.update = (items) => {
		this.items += items;
		this.view.text = "Items\nleft: " + this.items;	
	};
	
	this.clear = () => {
		this.items = 0;
		this.view.text = "Items\nleft: " + this.items;	
	};
}

export default itemsLeft;