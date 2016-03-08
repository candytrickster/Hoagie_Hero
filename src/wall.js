function Wall(world, x, y, height, width, color, type) {
	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;
	this.color = color;
	
	this.view = new createjs.Shape();
	this.view.graphics.beginFill(this.color)
					.drawRect(x, 0, this.width, this.height);
	
	this.view.regX = this.width / 2;
	this.view.regY = -this.y + (height - (height / 2));
				
	//Build the physics object
	const fixDef = new Box2D.Dynamics.b2FixtureDef();
	fixDef.density = 20.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0;
	const bodyDef = new Box2D.Dynamics.b2BodyDef();
	bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
	bodyDef.position.x = this.x / 30;
	bodyDef.position.y = this.y / 30;
	bodyDef.userData = { type: type };
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
	fixDef.shape.SetAsBox((width / 30) / 2, (height / 30) / 2);
	this.view.body = world.CreateBody(bodyDef);
	this.view.body.CreateFixture(fixDef);
}

export default Wall;