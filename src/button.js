function Button(x, y, text = '', radius = 50, color = '#222') {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.text = text;
	this.color = color;
	this.view = new createjs.Container();
	const circle = new createjs.Shape();
	circle.graphics.beginFill(this.color).drawCircle(this.x, this.y, this.radius);
	const textDisplay = new createjs.Text(this.text, "20px Arial", 'white');
	textDisplay.x = this.x - (this.radius / 3);
	textDisplay.y = this.y - (this.radius / 4);
	this.view.addChild(circle, textDisplay);
	
	this.onClick = (handler) => {
		this.view.addEventListener('click', handler);
	}
};

export default Button;