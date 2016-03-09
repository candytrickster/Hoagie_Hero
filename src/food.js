import { SCREEN_WIDTH, SCALE } from './constants/gameConstants.js';
import { FOOD } from './constants/objectTypes.js';

function Food(world, index, width, height, color) {
	this.index = index;
	this.view = new createjs.Container();
	const shape = new createjs.Shape();
	shape.graphics.beginFill(color)
				.drawRect(0, 0, width, height);
	const text = new createjs.Text(this.index, "12px Arial", '#000');
	this.view.addChild(shape, text);
	this.view.regX = width / 2;
	this.view.regY = height - 15;
	
	//Build the physics object
	const fixDef = new Box2D.Dynamics.b2FixtureDef();
	fixDef.density = 5.0;
	fixDef.friction = 10;
	fixDef.restitution = 0.2;
	const bodyDef = new Box2D.Dynamics.b2BodyDef();
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	bodyDef.position.x = ((Math.random() * (SCREEN_WIDTH - 40)) + 20) / SCALE;
	bodyDef.position.y = 0;
	bodyDef.fixedRotation = true;
	bodyDef.userData = { type: FOOD, index: this.index };
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
	fixDef.shape.SetAsBox((width / 30) / 2, (height / 30) / 2);
	this.view.body = world.CreateBody(bodyDef);
	this.view.body.CreateFixture(fixDef);
	this.view.addEventListener('tick', tick.bind(this.view));
}

function tick(e) {
	this.x = this.body.GetPosition().x * SCALE;
	this.y = this.body.GetPosition().y * SCALE;
	// console.log('Rotation', this.body.GetAngle() * (180 / Math.Pi));
	// this.rotation = this.body.GetAngle() * (180 / Math.Pi);
	this.body.ApplyForce(new Box2D.Common.Math.b2Vec2(0, 100), this.body.GetWorldCenter());
}

export default Food;