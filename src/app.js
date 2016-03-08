import { FPS, SCREEN_HEIGHT, SCREEN_WIDTH, FRICTION, SCALE } from './constants/gameConstants.js';
import { GROUND, FOOD, PADDLE, WALL } from './constants/objectTypes.js';
import { buildStage } from './stage.js';
import Paddle from './paddle.js';
import FoodSpawner from './foodSpawner.js';
import ScoreKeeper from './scoreKeeper.js';
import HealthBar from './healthBar.js';
import CountDown from './countdown.js';
import Wall from './wall.js';
import Button from './button.js';

const stage = buildStage('game');
const debug = document.getElementById('debug');
stage.enableMouseOver(20);

let world;

const setUpPhysics = () => {
	world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true);
	
	//create ground
	const ground = new Wall.default(world, SCREEN_WIDTH / 2, 600, 20, SCREEN_WIDTH, '#0000ff', GROUND);
	
	//create walls
	const leftWall = new Wall.default(world, 10, 600, SCREEN_HEIGHT * 2, 20, '#0000ff', WALL);
	const rightWall = new Wall.default(world, SCREEN_WIDTH - 10, 600, SCREEN_HEIGHT * 2, 20, '#0000ff', WALL);

	stage.addChild(ground.view, leftWall.view, rightWall.view);

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

const paddle = new Paddle.default(world, 400, 560, 120, 60, '#ff0000');

// const playBtn = new Button.default(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'Play');
// playBtn.view.circle.addEventListener('mouseover', (e) => {
// 	console.log('click');
// });

stage.addChild(paddle.view);

foodSpawner.startDrop(10, 5000);
createjs.Ticker.setFPS(FPS);
createjs.Ticker.useRAF = true;

createjs.Ticker.addEventListener("tick", () => {
	stage.update();
	world.DrawDebugData();
	world.Step(1/FPS, 10, 10);
	world.ClearForces();
	destroyBodies(bodiesOnTheFloor);
});

//Collision detection
const detectedHits = [];
const blocksOnPaddle = [];
const bodiesOnTheFloor = [];
const collisionListener = new Box2D.Dynamics.b2ContactListener();
collisionListener.BeginContact = (contact, impulse) => {
	const bodyA = contact.GetFixtureA().GetBody();
	const bodyB = contact.GetFixtureB().GetBody();
	
	if(bodyA.GetUserData().type === FOOD && bodyB.GetUserData().type === GROUND) {
		healthBar.update(10);
		detectedHits.push(bodyA);
		bodiesOnTheFloor.push(bodyA);
		const blockOnPaddle = blocksOnPaddle.indexOf(bodyA);
		if(blockOnPaddle !== -1) { 
			blocksOnPaddle.splice(blockOnPaddle, 1);
			scoreKeeper.updateScore(-1); 
		}
	} else if((bodyA.GetUserData().type === FOOD || bodyB.GetUserData().type === FOOD) &&
			 (bodyB.GetUserData().type === PADDLE || bodyA.GetUserData().type === PADDLE)) {
		if(detectedHits.indexOf(bodyA) < 0) {
			scoreKeeper.updateScore(1);
			detectedHits.push(bodyA);
			blocksOnPaddle.push(bodyA);
		}
	} else if(bodyA.GetUserData().type === FOOD && bodyB.GetUserData().type === FOOD) {
		if(detectedHits.indexOf(bodyA) < 0) {
			if(blocksOnPaddle.indexOf(bodyB) >= 0) {
				scoreKeeper.updateScore(1);
				blocksOnPaddle.push(bodyA);	
			} 
			detectedHits.push(bodyA);
		}
	}
};
world.SetContactListener(collisionListener);

const destroyBodies = (bodies) => {
	for(let i = 0; i < bodies.length; i++) {
		world.DestroyBody(bodies[i]);
		const viewObjects = stage.children;
		for(let j = 0; j < viewObjects.length; j++) {
			if(viewObjects[j].body === bodies[i]) {
				stage.removeChild(viewObjects[j]);
			}
		}
	}
}