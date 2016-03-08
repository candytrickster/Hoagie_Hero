import { FPS, SCREEN_HEIGHT, SCREEN_WIDTH, FRICTION, SCALE } from './constants/gameConstants.js';
import { GROUND, FOOD, PADDLE, WALL } from './constants/objectTypes.js';
import { buildStage } from './stage.js';
import Paddle from './paddle.js';
import FoodSpawner from './foodSpawner.js';
import ScoreKeeper from './scoreKeeper.js';
import HealthBar from './healthBar.js';
import CountDown from './countdown.js';
import Wall from './wall.js';

const stage = buildStage('game');
const debug = document.getElementById('debug');
stage.enableMouseOver();

let world;

const setUpPhysics = () => {
	world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true);
	
	//create ground
	const ground = new Wall.default(world, SCREEN_WIDTH / 2, 600, 20, SCREEN_WIDTH, '#0000ff', GROUND);
	
	//create walls
	const leftWall = new Wall.default(world, 0, 600, SCREEN_HEIGHT * 2, 20, '#0000ff', WALL);
	const rightWall = new Wall.default(world, SCREEN_WIDTH, 600, SCREEN_HEIGHT * 2, 20, '#0000ff', WALL);

	stage.addChild(ground.view, leftWall.view);

	const debugDraw = new Box2D.Dynamics.b2DebugDraw();
	debugDraw.SetSprite(debug.getContext('2d'));
	debugDraw.SetDrawScale(SCALE);
	debugDraw.SetFillAlpha(0.5);
	debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);	
};

setUpPhysics();

const scoreKeeper = new ScoreKeeper.default(600, 50, 0, "#fff");
stage.addChild(scoreKeeper.view);

const healthBar = new HealthBar.default(600, 10, 150, 20);
stage.addChild(healthBar.view.background, healthBar.view.healthBar);

const foodSpawner = new FoodSpawner.default(world, stage);
foodSpawner.startDrop(10, 5000);

const paddle = new Paddle.default(world, 400, 560, 120, 60, '#ff0000');

stage.addChild(paddle.view);

createjs.Ticker.setFPS(FPS);
createjs.Ticker.useRAF = true;

createjs.Ticker.addEventListener("tick", () => {
	stage.update();
	world.DrawDebugData();
	world.Step(1/FPS, 10, 10);
	world.ClearForces();
});

//Collision detection
const detectedHits = [];
const blocksOnPaddle = [];
const collisionListener = new Box2D.Dynamics.b2ContactListener();
collisionListener.BeginContact = (contact, impulse) => {
	const bodyA = contact.GetFixtureA().GetBody();
	const bodyB = contact.GetFixtureB().GetBody();
	
	if(bodyA.GetUserData().type === FOOD && bodyB.GetUserData().type === GROUND) {
		if(detectedHits.indexOf(bodyA) < 0) {
			healthBar.update(10);
			detectedHits.push(bodyA);
		}
	} else if(bodyA.GetUserData().type === FOOD && bodyB.GetUserData().type === PADDLE) {
		if(detectedHits.indexOf(bodyA) < 0) {
			scoreKeeper.updateScore(1);
			detectedHits.push(bodyA);
			blocksOnPaddle.push(bodyA);
		}
	} else if(bodyA.GetUserData().type === FOOD && bodyB.GetUserData().type === FOOD) {
		if(detectedHits.indexOf(bodyA) < 0) {
			if(blocksOnPaddle.indexOf(bodyB) > 0) {
				scoreKeeper.updateScore(1);
				blocksOnPaddle.push(bodyA);	
			}
			detectedHits.push(bodyA);
		}
	}
};
world.SetContactListener(collisionListener);