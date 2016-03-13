function buildBtn()
{
    var btnSheet = new createjs.SpriteSheet({
        images: [queue.getResult("button")],
        frames: [[0,0,98,57,0,0.75,11],[98,0,98,73,0,0.75,27],[196,0,98,73,0,0.75,27],[294,0,194,58,0,83.75,12],[0,73,194,76,0,83.75,30],[194,73,194,76,0,83.75,30],[0,149,149,57,0,51.75,11],[149,149,149,75,0,51.75,29],[298,149,149,75,0,51.75,29],[0,224,129,57,0,41.75,11],[129,224,129,75,0,41.75,29],[258,224,129,75,0,41.75,29]],
        animations: {
            play: [0, 0, "play"],
            playHover: [1, 1, "playHover"],
            playClick: [2, 2, "playClick"],
            instruction: [3, 3, "instruction"],
            instructionHover: [4, 4, "instructionHover"],
            instructionClick: [5, 5, "instructionClick"],
            menu: [6, 6, "menu"],
            menuHover: [7, 7, "menuHover"],
            menuClick: [8, 8, "menuClick"],
            continue: [9, 9, "continue"],
            continueHover: [10, 10, "continueHover"],
            continueClick: [11, 11, "continueClick"]
            }     
        });
    
    btnPlay = new createjs.Sprite(btnSheet);
    btnInstructions = new createjs.Sprite(btnSheet);
    btnMenu = new createjs.Sprite(btnSheet);
    btnContinue = new createjs.Sprite(btnSheet);
    
    stage.enableMouseOver();
    
    btnPlay.x=380;
    btnPlay.y=520;
    btnPlay.gotoAndStop('play');
    
    btnPlay.on("click", function(evt) { 
        console.log("Clicked"); 
        btnPlay.gotoAndStop('playHover');
        setGameState(state.PLAY);
    });
    btnPlay.on("mouseover", function(evt) { 
        console.log("Mouse Over");
        btnPlay.gotoAndStop('playHover');
    });
    btnPlay.on("mouseout", function(evt) { 
        console.log("Mouse Out");
        btnPlay.gotoAndStop('play');
    });
    btnPlay.on("mousedown", function(evt) { 
        console.log("Mouse Down");
        btnPlay.gotoAndStop('playClick');
    });
    
    btnInstructions.x=560;
    btnInstructions.y=520;
    btnInstructions.gotoAndStop('instruction');
    
    btnInstructions.on("click", function(evt) { 
        console.log("Clicked"); 
        btnInstructions.gotoAndStop('instructionHover');
        setGameState(state.INSTRUCTIONS);
    });
    btnInstructions.on("mouseover", function(evt) { 
        console.log("Mouse Over");
        btnInstructions.gotoAndStop('instructionHover');
    });
    btnInstructions.on("mouseout", function(evt) { 
        console.log("Mouse Out");
        btnInstructions.gotoAndStop('instruction');
    });
    btnInstructions.on("mousedown", function(evt) { 
        console.log("Mouse Down");
        btnInstructions.gotoAndStop('instructionClick');
    });    
    
    btnMenu.x=560;
    btnMenu.y=520;
    btnMenu.gotoAndStop('menu');
    
    btnMenu.on("click", function(evt) { 
        console.log("Clicked"); 
        btnMenu.gotoAndStop('menuHover');
        setGameState(state.TITLE);
    });
    btnMenu.on("mouseover", function(evt) { 
        console.log("Mouse Over");
        btnMenu.gotoAndStop('menuHover');
    });
    btnMenu.on("mouseout", function(evt) { 
        console.log("Mouse Out");
        btnMenu.gotoAndStop('menu');
    });
    btnMenu.on("mousedown", function(evt) { 
        console.log("Mouse Down");
        btnMenu.gotoAndStop('menuClick');
    });
    
    btnContinue.x=560;
    btnContinue.y=520;
    btnContinue.gotoAndStop('continue');
    
    btnContinue.on("click", function(evt) { 
        console.log("going to title"); 
        btnContinue.gotoAndStop('continueHover');
        setGameState(state.TITLE);
    });
    btnContinue.on("mouseover", function(evt) { 
        console.log("Mouse Over");
        btnContinue.gotoAndStop('continueHover');
    });
    btnContinue.on("mouseout", function(evt) { 
        console.log("Mouse Out");
        btnContinue.gotoAndStop('continue');
    });
    btnContinue.on("mousedown", function(evt) { 
        console.log("Mouse Down");
        btnContinue.gotoAndStop('continueClick');
    });
        
}

function addBtns()
{
    stage.addChild(btnContinue);
    stage.addChild(btnPlay);
    stage.addChild(btnMenu);
    stage.addChild(btnInstructions);
}




















