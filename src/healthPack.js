import { SCREEN_WIDTH, SCALE } from './constants/gameConstants.js';
import { HEALTH } from './constants/objectTypes.js';

function HealthPack(world, width, height, color) {
	this.color = '#2E0854';
	this.view = new createjs.Shape();
	this.view.graphics.beginFill(this.color)
				.drawRect(0, 0, width, height);
	this.view.regX = width / 2;
	this.view.regY = height - 15;
	
	//Build the physics object
	const fixDef = new Box2D.Dynamics.b2FixtureDef();
	fixDef.density = 5.0;
	fixDef.friction = 10;
	fixDef.restitution = 0.2;
	const bodyDef = new Box2D.Dynamics.b2BodyDef();
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	bodyDef.position.x = ((Math.random() * (SCREEN_WIDTH - 80)) + 40) / SCALE;
	bodyDef.position.y = 0;
	bodyDef.fixedRotation = true;
	bodyDef.userData = { type: HEALTH };
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

export default HealthPack;