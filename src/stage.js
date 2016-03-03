import { SCREEN_HEIGHT, SCREEN_WIDTH } from './constants/gameConstants.js';

export const buildStage = (stageName) => {
	const canvas = document.getElementById(stageName);
	canvas.height = SCREEN_HEIGHT;
	canvas.width = SCREEN_WIDTH;
	
	return new createjs.Stage(canvas);
}