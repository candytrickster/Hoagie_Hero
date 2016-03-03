import { FPS, SCREEN_HEIGHT, SCREEN_WIDTH, FRICTION, SCALE } from './constants/gameConstants.js';
import { buildStage } from './stage.js';
import Paddle from './paddle.js';

const stage = buildStage('game');
stage.enableMouseOver();

let world;

const setUpPhysics = () => {
	world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 50), true);
	//create ground
	const fixDef = new Box2D.Dynamics.b2FixtureDef();
	fixDef.density = 1;
	fixDef.friction = FRICTION;
	const bodyDef = new Box2D.Dynamics.b2BodyDef();
	bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
	bodyDef.position.x = 400 / SCALE;
	bodyDef.position.y = 600 / SCALE;
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
	fixDef.shape.SetAsBox(400 / SCALE, 20 / SCALE);
	world.CreateBody(bodyDef).CreateFixture(fixDef);

	const debugDraw = new Box2D.Dynamics.b2DebugDraw();
	debugDraw.SetSprite(stage.canvas.getContext('2d'));
	debugDraw.SetDrawScale(SCALE);
	debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);	
};

setUpPhysics();

stage.on('stagemousedown', (e) => {
	const fixDef = new Box2D.Dynamics.b2FixtureDef();
	fixDef.density = 1;
	fixDef.friction = FRICTION;
	fixDef.restitution = 0.5;
	const bodyDef = new Box2D.Dynamics.b2BodyDef();
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	bodyDef.position.x = Math.random() * SCREEN_WIDTH / SCALE;
	bodyDef.position.y = 0;
	fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(Math.random() * 100 / SCALE);
	world.CreateBody(bodyDef).CreateFixture(fixDef);
});

// const paddle = new Paddle(0, 0, 120, 30, '#ff0000');
// paddle.y = 550;
// paddle.init();

//stage.addChild(paddle);

createjs.Ticker.setFPS(FPS);
createjs.Ticker.userRAF = true;
createjs.Ticker.addEventListener("tick", () => {
	stage.update();
	world.DrawDebugData();
	world.Step(1/FPS, 10, 10);
	world.ClearForces();
});