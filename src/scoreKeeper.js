function ScoreKeeper(x, y, score, color) {
	this.x = x;
	this.y = y;
	this.score = score || 5;
	this.color = color || "#000";
	this.view = new createjs.Text("Ingredients\nneeded: " + this.score, "20px Arial", this.color);
	this.view.x = this.x;
	this.view.y = this.y;
	
	this.updateScore = (scoreUpdate) => {
		this.score += scoreUpdate;
		this.view.text = "Ingredients\nneeded: " + this.score;	
	};
	
	this.clear = (score) => {
		this.score = score;
		this.view.text = "Ingredients\nneeded: " + this.score;	
	};
}

export default ScoreKeeper;