import { SCREEN_HEIGHT, SCREEN_WIDTH } from './constants/gameConstants.js';

export const buildStage = (stageName) => {
	const canvas = document.getElementById(stageName);
	
	return new createjs.Stage(canvas);
}