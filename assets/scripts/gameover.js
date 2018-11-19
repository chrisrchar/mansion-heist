var gameoverState = {};
var activeMenuItemGO;
var menuItemsGO = ['Load Game', 'Give Up'];
var menuTextsGO;
var updatingMenu;

gameoverState.create = function () 
{
    activeMenuItemGO = 0;
    menuTextsGO = [];
    
    game.input.resetLocked = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    var titlescreenGraphic = this.add.sprite(0,0,'gameoverImg');
    
    var gameTitleText = this.add.text(game.camera.width/2, 64, 'GAME OVER', { font: '64px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 0 });
    gameTitleText.anchor.x = 0.5;
    
    menuItemsGO.forEach(function (menuItem, menuIndex) {
        var menuItemText = game.add.text(game.camera.width/2 + (Math.floor(menuItemsGO.length/2)*300)*(Math.pow((-1), (menuIndex-1))), game.camera.height - 128, menuItem, { font: '48px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 0 });
        menuItemText.anchor.x = 0.5;
        menuItemText.anchor.y = 0.5;
        menuItemText.alpha = 0.6;
        
        menuTextsGO.push(menuItemText);
    });
    
    game.input.gamepad.start();
    pad1 = game.input.gamepad.pad1;
    
    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    leftButton.onDown.add(leftPressedGO);
    rightButton.onDown.add(rightPressedGO);
    jumpButton.onDown.add(jumpPressedGO);
    
    inputs.push(leftButton);
    inputs.push(rightButton);
    inputs.push(jumpButton);
    
    changeactiveMenuItemGO();
    
    console.log('starting state');
};

gameoverState.update = function () 
{
    if (pad1.connected)
        {
            removeInputCallbacks();
            
            jumpButton = pad1.getButton(Phaser.Gamepad.XBOX360_A);
            leftButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
            rightButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);

            leftButton.onDown.add(leftPressedGO);
            rightButton.onDown.add(rightPressedGO);
            jumpButton.onDown.add(jumpPressedGO);
            
            inputs.push(leftButton);
            inputs.push(rightButton);
            inputs.push(jumpButton);
        }
};

function changeactiveMenuItemGO ()
{
    console.log(activeMenuItemGO);
    
    menuTextsGO.forEach(function (menuItem, menuIndex) {
        if (activeMenuItemGO == menuIndex)
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

function jumpPressedGO ()
{
    var menuSelectTween = game.add.tween(menuTextsGO[activeMenuItemGO].scale).to({x: 1.5, y: 1.5},150, Phaser.Easing.Bounce.InOut, false, 0, 0, true);
    
    menuSelectTween.onComplete.add(function () {
        removeInputCallbacks();
        
        switch (activeMenuItemGO)
        {
            case 0:
                if (checkSavedGame())
                {
                    loadGame();
                }
                break;
            case 1:
                game.state.start('titlescreenState');
                break;
        }
    });
    
    menuSelectTween.start();
}

function leftPressedGO ()
{
    if (!updatingMenu)
    {
        if (activeMenuItemGO == 0)
        {
            activeMenuItemGO = menuItemsGO.length - 1;
        }
        else
        {
            activeMenuItemGO -= 1
        }
        changeactiveMenuItemGO();
    }
}

function rightPressedGO ()
{
    if (!updatingMenu)
    {
        if (activeMenuItemGO == menuItemsGO.length - 1)
        {
            activeMenuItemGO = 0;
        }
        else
        {
            activeMenuItemGO += 1;
        }
        changeactiveMenuItemGO();
    }
}