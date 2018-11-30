// DRAWN OBJECTS
var moneyHUD, minimap, hud;
var hpTween, staTween, msgOpenTween;

function drawHUD()
{
    
    hud = game.add.graphics(16,16);
    hud.fixedToCamera = true;
    
    var healthBarOuter = game.add.graphics(0, 0);
    var healthBarInner = game.add.graphics(0, 0);
    
    hud.addChild(healthBarOuter);
    hud.addChild(healthBarInner);
    
    healthBarOuter.lineStyle(6, 0x333333, 1);
    healthBarOuter.beginFill(0x000000, 1);
    healthBarOuter.drawRoundedRect(0,0,playerGlobals.maxhp * 3, 32, 8);
    healthBarOuter.endFill();
    
    healthBarInner.beginFill(0xff0000, 1);
    healthBarInner.drawRoundedRect(0,0,playerGlobals.maxhp * 3, 32, 8);
    healthBarInner.endFill();
    
    healthBarInner.scale = {x: playerGlobals.hp/playerGlobals.maxhp, y: 1};
    
    var healthText = game.add.text(playerGlobals.maxhp * 3 + 16, 0, playerGlobals.hp, { font: '24px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 4 });
    hud.addChild(healthText);
    
    var staBarOuter = game.add.graphics(0, 38);
    var staBarInner = game.add.graphics(0, 38);
    
    hud.addChild(staBarOuter);
    hud.addChild(staBarInner);
    
    staBarOuter.lineStyle(6, 0x333333, 1);
    staBarOuter.beginFill(0x000000, 1);
    staBarOuter.drawRoundedRect(0,0,playerGlobals.maxSta * 5, 16, 4);
    staBarOuter.endFill();
    
    staBarInner.beginFill(0x4ecbff, 1);
    staBarInner.drawRoundedRect(0,0,playerGlobals.maxSta * 5, 16, 4);
    staBarInner.endFill();
    
    staBarInner.scale = {x: playerGlobals.stamina/playerGlobals.maxSta, y: 1};
    
    moneyHUD = game.add.text(16, 64, '$: '+playerGlobals.money, { font: '32px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 8 });
    hud.addChild(moneyHUD);
}

function updateHPHUD ()
{
    var barMaxLen = playerGlobals.maxhp * 3;
    
    var bar = hud.children[1];
    var hpText = hud.children[2];
    
    game.add.tween(bar.scale).to({x: playerGlobals.hp/playerGlobals.maxhp, y: 1.0}, 200, Phaser.Easing.Linear.None, true);
    
    hpText.text = playerGlobals.hp.clamp(0, playerGlobals.maxhp);
}

function updateMaxHPHUD ()
{
    var hpBar = hud.children[0];
    var hpText = hud.children[2];
    hpBar.clear();
    hpBar.beginFill(0xff0000, 1);
    hpBar.drawRoundedRect(0,0,playerGlobals.maxhp * 3, 32, 8);
    hpBar.endFill();
    hpText.text = playerGlobals.hp;
}

function updateStaHUD ()
{   
    var bar = hud.children[4];
    
    game.add.tween(bar.scale).to({x: playerGlobals.stamina/playerGlobals.maxSta, y: 1.0}, 200, Phaser.Easing.Linear.None, true);
}

// MINI MAP
function drawMiniMap (gridX, gridY)
{
    var mmap_size = 180;
    var mmap_units = 5;
    var mmap_unit_size = mmap_size/mmap_units;
    
    var exitOffset = 6;
    
    minimap = game.add.graphics(game.camera.width - mmap_size - 25, 25);
    minimap.fixedToCamera = true;

    minimap.beginFill(0x000000, 1);
    minimap.drawRect(0, 0, mmap_size, mmap_size);
    minimap.endFill();

    minimap.lineStyle(2, 0xffffff, 1);

    for (var i = 0; i < mmap_units+1; i++)
    {
        minimap.moveTo(i*mmap_unit_size,0);
        minimap.lineTo(i*mmap_unit_size, mmap_size);
    }
    
    for (var i = 0; i < mmap_units+1; i++)
    {
        minimap.moveTo(0, i*mmap_unit_size);
        minimap.lineTo(mmap_size, i*mmap_unit_size);
    }
    
    minimap.lineStyle(0, 0xffffff, 0);
    minimap.beginFill(0xffffff, .6);
    
    for (var i = -1*Math.floor(mmap_units/2); i < Math.ceil(mmap_units/2); i++)
    {
        for (var j = -1*Math.floor(mmap_units/2); j < Math.ceil(mmap_units/2); j++)
        {
            if (mapVisited[(gridY+i)][(gridX+j)])
            {
                if (i == 0 && j == 0)
                {
                    minimap.beginFill(0xffffff, 1);
                    minimap.drawRect(mmap_unit_size*(j+2),mmap_unit_size*(i+2),mmap_unit_size,mmap_unit_size);
                }
                else
                {
                    minimap.beginFill(0xffffff, .6);
                    minimap.drawRect(mmap_unit_size*(j+2),mmap_unit_size*(i+2),mmap_unit_size,mmap_unit_size);
                }
                
                mapVisited[(gridY+i)][(gridX+j)].exits.forEach(function (exit) {
                    minimap.lineStyle(2, 0x000000, .7);
                    
                    switch (exit) {
                        case 'up':
                            minimap.moveTo(mmap_unit_size*(j+2)+exitOffset,mmap_unit_size*(i+2));
                            minimap.lineTo(mmap_unit_size*(j+3)-exitOffset,mmap_unit_size*(i+2));
                            break;
                            
                        case 'down':
                            minimap.moveTo(mmap_unit_size*(j+2)+exitOffset,mmap_unit_size*(i+3));
                            minimap.lineTo(mmap_unit_size*(j+3)-exitOffset,mmap_unit_size*(i+3));
                            break;
                            
                        case 'left':
                            minimap.moveTo(mmap_unit_size*(j+2),mmap_unit_size*(i+2)+exitOffset);
                            minimap.lineTo(mmap_unit_size*(j+2),mmap_unit_size*(i+3)-exitOffset);
                            break;
                            
                        case 'right':
                            minimap.moveTo(mmap_unit_size*(j+3),mmap_unit_size*(i+2)+exitOffset);
                            minimap.lineTo(mmap_unit_size*(j+3),mmap_unit_size*(i+3)-exitOffset);
                            break;
                    }
                    
                });
                
                minimap.lineStyle(0, 0xffffff, 0);
            }
        }
    }
    
    minimap.endFill();
    
    minimap.alpha = 0.8;
}

var msgBoxSprite;

function showMsgBox(x, y, scale, tweenSpeed)
{
    var msgBox = game.add.graphics(x, y);
    
    msgBox.beginFill(0x000000, .9);
    msgBox.drawPolygon([{x: x+(50*scale), y: y},{x: x+(1000*scale), y: y},{x: x+(950*scale), y: y+(150*scale)},{x: x, y: y+(150*scale)}]);
    msgBox.endFill();
    
    msgBoxSprite = game.add.sprite(x, y, msgBox.generateTexture());
    msgBoxSprite.fixedToCamera = true;
    
    msgBox.destroy();
    
    msgBoxSprite.anchor.x = .5;
    msgBoxSprite.anchor.y = .5;
    msgBoxSprite.scale.x = 0;
    msgBoxSprite.scale.y = 0;
    
    msgOpenTween = game.add.tween(msgBoxSprite.scale).to({x: 1, y: 1}, tweenSpeed, Phaser.Easing.Back.Out, true);
    msgOpenTween.onComplete.add(function () {
        text.start();
    });
}

function closeMsgBox () 
{
    var closeTween = game.add.tween(msgBoxSprite.scale).to({x: 0, y: 0}, tweenSpeed, Phaser.Easing.Back.Out, true);
    closeTween.onComplete.add(function () {
        msgBoxSprite.destroy();
    });
}