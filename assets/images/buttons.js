(function(window) {
hoagie_button = function() {
	this.initialize();
}
hoagie_button._SpriteSheet = new createjs.SpriteSheet({images: ["buttons.png"], frames: [[0,0,98,57,0,0.75,11],[98,0,98,73,0,0.75,27],[196,0,98,73,0,0.75,27],[294,0,194,58,0,83.75,12],[0,73,194,76,0,83.75,30],[194,73,194,76,0,83.75,30],[0,149,149,57,0,51.75,11],[149,149,149,75,0,51.75,29],[298,149,149,75,0,51.75,29],[0,224,129,57,0,41.75,11],[129,224,129,75,0,41.75,29],[258,224,129,75,0,41.75,29]]});
var hoagie_button_p = hoagie_button.prototype = new createjs.Sprite();
hoagie_button_p.Sprite_initialize = hoagie_button_p.initialize;
hoagie_button_p.initialize = function() {
	this.Sprite_initialize(hoagie_button._SpriteSheet);
	this.paused = false;
}
window.hoagie_button = hoagie_button;
}(window));

