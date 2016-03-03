import { FPS, SCREEN_HEIGHT, SCREEN_WIDTH } from './constants/gameConstants.js';
import { buildStage } from './stage.js';
import Paddle from './paddle.js';

const stage = buildStage('game');

const paddle = new Paddle(0, 0, 120, 30, '#ff0000');
paddle.y = 550;
paddle.init();

stage.addChild(paddle);

createjs.Ticker.setFPS(FPS);
createjs.Ticker.addEventListener("tick", () => {
	stage.update();	
});