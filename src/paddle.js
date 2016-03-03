import { PADDLE_SPEED_LIMIT, FRICTION, SCREEN_WIDTH } from './constants/gameConstants.js';

class Paddle extends createjs.Container {
    constructor(x, y, width, height, color) {
        super();
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
		this.color = color;
        
        this.ax = this.ay = this.vx = this.vy = 0;
    }
	
	init() {
		this.build();
		this.registerListners();
	}
    
    move() {
        this.vx += this.ax;
	    this.vy += this.ay;
        
        let speed = Math.sqrt((this.vx * this.vx) + (this.vy * this.vy));
        
        if(speed > PADDLE_SPEED_LIMIT) {
            speed = PADDLE_SPEED_LIMIT;
        }
        
        if (speed > FRICTION) {
            speed -= FRICTION;
        } else {
            speed = 0;
        }
        
        let angle = Math.atan2(this.vy, this.vx);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.x += this.vx;
	    this.y += this.vy;
        
        if(this.x >= SCREEN_WIDTH - this.width) {
            this.x = SCREEN_WIDTH - this.width;
        } else if(this.x <= 0) {
            this.x = 0;
        }
    }
    
    registerListners() {
        window.addEventListener('keydown', (e) => {
            switch(e.keyCode) {
                // Left
				case 65:
                case 37:
                    this.ax = -1;
                    break;
                    
                // Right
				case 68:
                case 39:
                    this.ax = 1;
                    break;
            }
            
            e.preventDefault();
            e.stopPropagation();
        }, false);
        
        window.addEventListener('keyup', () => {
            this.ax = this.ay = 0;
        }, false);
        
        createjs.Ticker.addEventListener("tick", () => {
            this.move();
        });
    }
    
    build() {
        const paddle = new createjs.Shape();
		paddle.graphics.beginFill(this.color)
					.drawRect(0, 0, this.width, this.height);
		this.addChild(paddle);
    }
}

export default createjs.promote(Paddle, "Container");