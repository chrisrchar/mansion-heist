var gamewinState = {};
var activeMenuItemWIN;
var menuItemsWIN = ['Play Again', 'Title Screen'];
var menuTextsWIN;
var updatingMenu;

gamewinState.create = function () 
{
    game.input.reset(true);
    removeInputCallbacks();
    
    game.sound.stopAll();
    
    activeMenuItemWIN = 0;
    menuTextsWIN = [];
    
    game.input.resetLocked = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    var titlescreenGraphic = this.add.sprite(0,0,'gamewinImg');
    
    var gameTitleText = this.add.text(game.camera.width/2, 64, 'YOU WON', { font: '64px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 0 });
    gameTitleText.anchor.x = 0.5;
    
    menuItemsWIN.forEach(function (menuItem, menuIndex) {
        var menuItemText = game.add.text(game.camera.width/2 + (Math.floor(menuItemsWIN.length/2)*300)*(Math.pow((-1), (menuIndex-1))), game.camera.height - 128, menuItem, { font: '48px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 0 });
        menuItemText.anchor.x = 0.5;
        menuItemText.anchor.y = 0.5;
        menuItemText.alpha = 0.6;
        
        menuTextsWIN.push(menuItemText);
    });
    
    game.input.gamepad.start();
    pad1 = game.input.gamepad.pad1;
    
    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    leftButton.onDown.add(leftPressedWIN);
    rightButton.onDown.add(rightPressedWIN);
    jumpButton.onDown.add(jumpPressedWIN);
    
    inputs.push(leftButton);
    inputs.push(rightButton);
    inputs.push(jumpButton);
    
    changeactiveMenuItemWIN();
    
    console.log('starting state');
};

gamewinState.update = function () 
{
    if (pad1.connected)
        {
            removeInputCallbacks();
            
            jumpButton = pad1.getButton(Phaser.Gamepad.XBOX360_A);
            leftButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
            rightButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);

            leftButton.onDown.add(leftPressedWIN);
            rightButton.onDown.add(rightPressedWIN);
            jumpButton.onDown.add(jumpPressedWIN);
            
            inputs.push(leftButton);
            inputs.push(rightButton);
            inputs.push(jumpButton);
        }
};

function changeactiveMenuItemWIN ()
{
    console.log(activeMenuItemWIN);
    
    menuTextsWIN.forEach(function (menuItem, menuIndex) {
        if (activeMenuItemWIN == menuIndex)
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

function jumpPressedWIN ()
{
    var menuSelectTween = game.add.tween(menuTextsWIN[activeMenuItemWIN].scale).to({x: 1.5, y: 1.5},150, Phaser.Easing.Bounce.InOut, false, 0, 0, true);
    
    menuSelectTween.onComplete.add(function () {
        removeInputCallbacks();
        
        switch (activeMenuItemWIN)
        {
            case 0:
                resetGame();
                break;
            case 1:
                game.state.start('titlescreenState');
                break;
        }
    });
    
    menuSelectTween.start();
}

function leftPressedWIN ()
{
    if (!updatingMenu)
    {
        if (activeMenuItemWIN == 0)
        {
            activeMenuItemWIN = menuItemsWIN.length - 1;
        }
        else
        {
            activeMenuItemWIN -= 1
        }
        changeactiveMenuItemWIN();
    }
}

function rightPressedWIN ()
{
    if (!updatingMenu)
    {
        if (activeMenuItemWIN == menuItemsWIN.length - 1)
        {
            activeMenuItemWIN = 0;
        }
        else
        {
            activeMenuItemWIN += 1;
        }
        changeactiveMenuItemWIN();
    }
}