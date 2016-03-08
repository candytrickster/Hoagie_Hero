function Button(x, y, text = '', radius = 50, color = '#222') {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.text = text;
	this.color = color;
	this.view = {};
	this.view.circle = new createjs.Shape();
	this.view.circle.graphics.beginFill(this.color).drawCircle(this.x, this.y, this.radius);
	this.view.text = new createjs.Text(this.text, "20px Arial", 'white');
	this.view.text.x = this.x - (this.radius / 3);
	this.view.text.y = this.y - (this.radius / 3);
};

export default Button;