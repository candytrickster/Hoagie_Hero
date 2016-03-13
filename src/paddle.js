import { PADDLE_SPEED_LIMIT, FRICTION, SCREEN_WIDTH } from './constants/gameConstants.js';
import { PADDLE } from './constants/objectTypes.js';

function Paddle(world, x, y, width, height, color, sprite) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.view = new createjs.Container();
	this.view.sprite = sprite;
	const shape = new createjs.Shape();
	shape.graphics.beginFill(color)
				.drawRect(0, 0, this.width, this.height);
	shape.regX = width / 2;
	shape.regY = -this.y + (this.height - (this.height / 2));
	this.view.sprite.regX = width / 2;
	this.view.sprite.regY = -(height * 14);
	this.view.sprite.scaleX = 0.6;
	this.view.sprite.scaleY = 0.6;
	this.view.addChild(shape, this.view.sprite);
	
	//Build the physics object
	const fixDef = new Box2D.Dynamics.b2FixtureDef();
	fixDef.density = 20.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0;
	const bodyDef = new Box2D.Dynamics.b2BodyDef();
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	bodyDef.fixedRotation = true;
	bodyDef.position.x = this.x / 30;
	bodyDef.position.y = this.y / 30;
	bodyDef.userData = { type: PADDLE };
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
	fixDef.shape.SetAsBox((this.width / 30) / 2, (this.height / 30) / 2);
	this.view.body = world.CreateBody(bodyDef);
	this.view.body.CreateFixture(fixDef);
	
	window.addEventListener('keydown', (e) => {
            switch(e.keyCode) {
                // Left
				case 65:
                case 37:
					let leftForceVector = (e.shiftKey) ? new Box2D.Common.Math.b2Vec2(-10000, 0) : new Box2D.Common.Math.b2Vec2(-6000, 0);
                    this.view.body.ApplyForce(leftForceVector, this.view.body.GetPosition());
					this.view.sprite.gotoAndPlay('walkLeft');
                    break;
                    
                // Right
				case 68:
                case 39:
                    let rightForceVector = (e.shiftKey) ? new Box2D.Common.Math.b2Vec2(10000, 0) : new Box2D.Common.Math.b2Vec2(6000, 0);
                    this.view.body.ApplyForce(rightForceVector, this.view.body.GetWorldCenter());
					this.view.sprite.gotoAndPlay('walkRight');
                    break;
					
				//Space Bar
				case 32:
					this.view.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0,0));
            }
            
            e.preventDefault();
            e.stopPropagation();
        }, false);
        
	this.view.addEventListener('tick', tick.bind(this.view));
}

function tick(e) {
	this.x = this.body.GetPosition().x * 30;
	this.rotation = this.body.GetAngle() * (180 / Math.Pi);
	this.body.ApplyForce(new Box2D.Common.Math.b2Vec2(0, 200), this.body.GetWorldCenter());
	if(this.body.GetLinearVelocity().x === 0) {
		this.sprite.gotoAndPlay('stand');
	}
}

export default Paddle;