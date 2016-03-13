import { FPS, SCREEN_HEIGHT, SCREEN_WIDTH, FRICTION, SCALE } from './constants/gameConstants.js';
import { GROUND, FOOD, PADDLE, WALL, BAD_FOOD, HEALTH } from './constants/objectTypes.js';
import { buildStage } from './stage.js';
import Paddle from './paddle.js';
import FoodSpawner from './foodSpawner.js';
import ScoreKeeper from './scoreKeeper.js';
import LevelPassedDisplay from './levelPassedDisplay.js';
import HealthBar from './healthBar.js';
import CountDown from './countdown.js';
import Wall from './wall.js';
import Button from './button.js';
import ImageManager from './imageManager.js';

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

const images = new ImageManager.default(stage);
images.loadScreens(() => {
	stage.addChild(images.titleScreen, playBtn.view);
	stage.update();
});

const scoreKeeper = new ScoreKeeper.default((SCREEN_WIDTH / 2) + 20, 20, 5, "#fff");

const healthBar = new HealthBar.default(600, 10, 150, 20);

const foodSpawner = new FoodSpawner.default(world, stage);

const playBtn = new Button.default(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 200, 'Play');
playBtn.onClick((e) => {
	createjs.Ticker.setFPS(FPS);
	createjs.Ticker.useRAF = true;
	const paddle = new Paddle.default(world, 400, 560, 120, 60, '#000', images.playerSprite);
	stage.addChild(images.backgroundImage, ground.view, leftWall.view, rightWall.view, scoreKeeper.view, healthBar.view.background, healthBar.view.healthBar, paddle.view);
	if(stage.getChildIndex(images.gameOverScreen) >= 0) {
		stage.removeChild(images.gameOverScreen, playBtn.view);	
	} else {
		stage.removeChild(images.titleScreen, playBtn.view);
	}
	stage.update();
	
	const countdown = new CountDown.default(stage, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 4, null, () => {
		stage.removeChild(countdown.view);
		foodSpawner.startDrop(10, 5000);
		
		createjs.Ticker.addEventListener("tick", () => {
			//Check if player is dead
			if(healthBar.health <= 0) {
				createjs.Ticker.removeAllEventListeners('tick');
				stage.removeAllChildren();
				healthBar.reset();
				scoreKeeper.clear(5);
				destroyBodies(detectedHits);
				destroyBodies(blocksOnPaddle);
				foodSpawner.clear();
				stage.addChild(images.gameOverScreen, playBtn.view);
				stage.update();
				//Check if player has won
			} else if(scoreKeeper.score <= 0) {
				stage.addChild(images.winScreen);
				stage.update();
				setTimeout(() => {
					createjs.Ticker.removeAllEventListeners('tick');
					stage.removeAllChildren();
					healthBar.reset();
					scoreKeeper.clear(5);
					destroyBodies(detectedHits);
					destroyBodies(blocksOnPaddle);
					foodSpawner.clear();
					stage.addChild(images.titleScreen, playBtn.view);
					stage.update();
				}, 2000);
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

//Collision detection
const detectedHits = [];
const blocksOnPaddle = [];
const bodiesOnTheFloor = [];
const collisionListener = new Box2D.Dynamics.b2ContactListener();
collisionListener.BeginContact = (contact, impulse) => {
	const bodyA = contact.GetFixtureA().GetBody();
	const bodyB = contact.GetFixtureB().GetBody();
	
	if((bodyA.GetUserData().type === FOOD || bodyA.GetUserData().type === BAD_FOOD || 
		bodyA.GetUserData().type === HEALTH) && bodyB.GetUserData().type === GROUND) {
		if(bodyA.GetUserData().type === FOOD) {
			healthBar.update(20);	
		}
		detectedHits.push(bodyA);
		bodiesOnTheFloor.push(bodyA);
		const blockOnPaddle = blocksOnPaddle.indexOf(bodyA);
		if(blockOnPaddle !== -1) { 
			blocksOnPaddle.splice(blockOnPaddle, 1);
			scoreKeeper.updateScore(1); 
		}
	} else if(bodyA.GetUserData().type === FOOD && bodyB.GetUserData().type === PADDLE) {
		if(detectedHits.indexOf(bodyA) < 0) {
			scoreKeeper.updateScore(-1);
			detectedHits.push(bodyA);
			blocksOnPaddle.push(bodyA);
		}
	} else if(bodyA.GetUserData().type === FOOD && bodyB.GetUserData().type === FOOD) {
		if(detectedHits.indexOf(bodyA) < 0) {
			if(blocksOnPaddle.indexOf(bodyB) >= 0) {
				const blocks = [bodyA, bodyB];
				blocks.sort((a, b) => {
					if(a.GetPosition().y > b.GetPosition().y) {
						return 1;
					}
					if(a.GetPosition().y < b.GetPosition().y) {
						return -1;
					}
					
					return 0;
				});
				
				if(blocks[0].GetUserData().index > blocks[1].GetUserData().index) {
					scoreKeeper.updateScore(-1);
				}
				blocksOnPaddle.push(bodyA);	
			} 
			detectedHits.push(bodyA);
		}
	} else if(bodyA.GetUserData().type === BAD_FOOD && bodyB.GetUserData().type === FOOD) {
		if(detectedHits.indexOf(bodyA) < 0) {
			if(blocksOnPaddle.indexOf(bodyB) >= 0) {
				scoreKeeper.updateScore(1);
				detectedHits.push(bodyA);
				blocksOnPaddle.splice(blocksOnPaddle.indexOf(bodyB), 1);
				bodiesOnTheFloor.push(bodyA);
				bodiesOnTheFloor.push(bodyB);
			}		
		}
	} else if(bodyA.GetUserData().type === BAD_FOOD && bodyB.GetUserData().type === PADDLE) {
		if(detectedHits.indexOf(bodyA) < 0) {
			detectedHits.push(bodyA);
			healthBar.update(20);
			bodiesOnTheFloor.push(bodyA);
		}
	} else if(bodyA.GetUserData().type === HEALTH && (bodyB.GetUserData().type === PADDLE || bodyB.GetUserData().type === FOOD)) {
		healthBar.update(-20);
		bodiesOnTheFloor.push(bodyA);
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