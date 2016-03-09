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
import Screens from './screens.js';

const stage = buildStage('game');
const debug = document.getElementById('debug');
stage.enableMouseOver(20);

let world,
	ground,
	leftWall,
	rightWall;

const setUpPhysics = () => {
	world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true);
	
	//create ground
	ground = new Wall.default(world, SCREEN_WIDTH / 2, 600, 20, SCREEN_WIDTH, '#0000ff', GROUND);
	
	//create walls
	leftWall = new Wall.default(world, 10, 600, SCREEN_HEIGHT * 2, 20, '#0000ff', WALL);
	rightWall = new Wall.default(world, SCREEN_WIDTH - 10, 600, SCREEN_HEIGHT * 2, 20, '#0000ff', WALL);

	const debugDraw = new Box2D.Dynamics.b2DebugDraw();
	debugDraw.SetSprite(debug.getContext('2d'));
	debugDraw.SetDrawScale(SCALE);
	debugDraw.SetFillAlpha(0.5);
	debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);	
};

setUpPhysics();

const scoreKeeper = new ScoreKeeper.default(600, 50, 0, "#fff");

const healthBar = new HealthBar.default(600, 10, 150, 20);

const foodSpawner = new FoodSpawner.default(world, stage);

const paddle = new Paddle.default(world, 400, 560, 120, 60, '#ff0000');

const playBtn = new Button.default(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 200, 'Play');
playBtn.onClick((e) => {
	createjs.Ticker.setFPS(FPS);
	createjs.Ticker.useRAF = true;
	stage.addChild(ground.view, leftWall.view, rightWall.view, scoreKeeper.view, healthBar.view.background, healthBar.view.healthBar, paddle.view);
	if(stage.getChildIndex(screens.gameOverScreen) >= 0) {
		stage.removeChild(screens.gameOverScreen, playBtn.view);	
	} else {
		stage.removeChild(screens.titleScreen, playBtn.view);
	}
	stage.update();
	
	const countdown = new CountDown.default(stage, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 4, null, () => {
		stage.removeChild(countdown.view);
		foodSpawner.startDrop(15, 5000);
		
		createjs.Ticker.addEventListener("tick", () => {
			//Check if player is dead
			if(healthBar.health <= 0) {
				createjs.Ticker.removeAllEventListeners('tick');
				stage.removeAllChildren();
				healthBar.reset();
				scoreKeeper.clear();
				destroyBodies(detectedHits);
				destroyBodies(blocksOnPaddle);
				stage.addChild(screens.gameOverScreen, playBtn.view);
				stage.update();
			} else {
				stage.update();
				//world.DrawDebugData();
				world.Step(1/FPS, 10, 10);	
			}
			
			world.ClearForces();
			destroyBodies(bodiesOnTheFloor);
		});
	});
});

//Game State Screens
const screens = new Screens.default(stage);
screens.loadScreens(() => {
	stage.addChild(screens.titleScreen, playBtn.view);
	stage.update();
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
		bodies = bodies.splice(i, 1);
	}
}