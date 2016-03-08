function ScoreKeeper(x, y, score, color) {
	this.x = x;
	this.y = y;
	this.score = score || 0;
	this.color = color || "#000";
	this.view = new createjs.Text("Score: " + this.score, "20px Arial", this.color);
	this.view.x = this.x;
	this.view.y = this.y;
	
	this.updateScore = (scoreUpdate) => {
		this.score += scoreUpdate;
		this.view.text = "Score: " + this.score;	
	};
	
	this.clear = () => {
		this.score = 0;
		this.view.text = "Score: " + this.score;	
	};
}

export default ScoreKeeper;