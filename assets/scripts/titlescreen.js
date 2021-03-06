var titlescreenState = {};
var activeMenuItemTS;
var menuItemsTS = ['New Game', 'Load Game', 'Exit'];
var menuTextsTS;
var updatingMenu;

titlescreenState.create = function () 
{
    activeMenuItemTS = 0;
    menuTextsTS = [];
    
    game.input.resetLocked = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    var titlescreenGraphic = this.add.sprite(0,0,'titlescreen');
    
    var gameTitleText = game.add.text(game.camera.width/2, 64, 'Mansion Heist', { font: '64px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 0 });
    gameTitleText.anchor.x = 0.5;
    
    menuItemsTS.forEach(function (menuItem, menuIndex) {
        var menuItemText = game.add.text(game.camera.width/2 + (Math.floor(menuItemsTS.length/2)*300)*(menuIndex-1), game.camera.height - 128, menuItem, { font: '48px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 0 });
        menuItemText.anchor.x = 0.5;
        menuItemText.anchor.y = 0.5;
        menuItemText.alpha = 0.6;
        
        menuTextsTS.push(menuItemText);
    });
    
    game.input.gamepad.start();
    pad1 = game.input.gamepad.pad1;
    
    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    leftButton.onDown.add(leftPressedTS);
    rightButton.onDown.add(rightPressedTS);
    jumpButton.onDown.add(jumpPressedTS);
    
    inputs.push(leftButton);
    inputs.push(rightButton);
    inputs.push(jumpButton);
    
    changeactiveMenuItemTS();
    
    console.log('starting state');
};

titlescreenState.update = function () 
{
    if (pad1.connected)
        {
            removeInputCallbacks();
            
            jumpButton = pad1.getButton(Phaser.Gamepad.XBOX360_A);
            leftButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
            rightButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);

            leftButton.onDown.add(leftPressedTS);
            rightButton.onDown.add(rightPressedTS);
            jumpButton.onDown.add(jumpPressedTS);
            
            inputs.push(leftButton);
            inputs.push(rightButton);
            inputs.push(jumpButton);
        }
};

function changeactiveMenuItemTS ()
{
    console.log(activeMenuItemTS);
    
    menuTextsTS.forEach(function (menuItem, menuIndex) {
        if (activeMenuItemTS == menuIndex)
        {
            game.add.tween(menuItem.scale).to({x: 1.2, y: 1.2},100, Phaser.Easing.Linear.None, true);
            var updatingTween = game.add.tween(menuItem).to({alpha: 1}, 100, Phaser.Easing.Linear.None);
            updatingTween.onComplete.add(function () {
                updatingMenu = false;
            });
            updatingTween.start();
        }

        else if (menuItem.alpha != 0)
        {
            game.add.tween(menuItem.scale).to({x: 1, y: 1},100, Phaser.Easing.Linear.None, true);
            game.add.tween(menuItem).to({alpha: 0.6}, 100, Phaser.Easing.Linear.None, true);
        }
    });
}

function jumpPressedTS ()
{
    var menuSelectTween = game.add.tween(menuTextsTS[activeMenuItemTS].scale).to({x: 1.5, y: 1.5},150, Phaser.Easing.Bounce.InOut, false, 0, 0, true);
    
    menuSelectTween.onComplete.add(function () {
        removeInputCallbacks();
        
        switch (activeMenuItemTS)
        {
            case 0:
                resetGame();
                break;
            case 1:
                if (checkSavedGame())
                {
                    loadGame();
                }
                break;
            case 2:
                game.destroy();
                break;
        }
    });
    
    menuSelectTween.start();
}

function leftPressedTS ()
{
    if (!updatingMenu)
    {
        if (activeMenuItemTS == 0)
        {
            activeMenuItemTS = menuItemsTS.length - 1;
        }
        else
        {
            activeMenuItemTS -= 1
        }
        changeactiveMenuItemTS();
    }
}

function rightPressedTS ()
{
    if (!updatingMenu)
    {
        if (activeMenuItemTS == menuItemsTS.length - 1)
        {
            activeMenuItemTS = 0;
        }
        else
        {
            activeMenuItemTS += 1;
        }
        changeactiveMenuItemTS();
    }
}