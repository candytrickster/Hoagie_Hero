function LevelPassedDisplay(x, y, text, color) {
	this.x = x;
	this.y = y;
	this.text = text;
	this.color = color || "#00ff00";
	this.view = new createjs.Text(this.text, "56px Arial", this.color);
	this.view.x = this.x;
	this.view.y = this.y;
}

export default LevelPassedDisplay;