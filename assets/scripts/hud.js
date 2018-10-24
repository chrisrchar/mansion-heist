// DRAWN OBJECTS
var moneyHUD, minimap, hud;

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
    healthBarInner.drawRoundedRect(0,0,playerGlobals.hp/playerGlobals.maxhp * playerGlobals.maxhp * 3, 32, 8);
    healthBarInner.endFill();
    
    var healthText = game.add.text(playerGlobals.maxhp * 3 + 16, 0, playerGlobals.hp, { fontSize: '24px', fill: '#fff', stroke: 'black', strokeThickness: 4 });
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
    staBarInner.drawRoundedRect(0,0,playerGlobals.stamina/playerGlobals.maxSta * playerGlobals.maxSta * 5, 16, 4);
    staBarInner.endFill();
    
    moneyHUD = game.add.text(16, 64, '$: '+playerGlobals.money, { fontSize: '32px', fill: '#fff', stroke: 'black', strokeThickness: 8 });
    moneyHUD.fixedToCamera = true;
    
    console.log(hud);
}

function updateHPHUD ()
{
    var barMaxLen = playerGlobals.maxhp * 3;
    
    var hpBar = hud.children[1];
    var hpText = hud.children[2];
    
    hpBar.clear();
    hpBar.beginFill(0xff0000, 1);
    hpBar.drawRoundedRect(0,0,(playerGlobals.hp/playerGlobals.maxhp * barMaxLen).clamp(0, barMaxLen), 32, 8);
    hpBar.endFill();
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
    var barMaxLen = playerGlobals.maxSta * 5;
    
    var bar = hud.children[4];
    
    bar.clear();
    bar.beginFill(0x4ecbff, 1);
    bar.drawRoundedRect(0,0,playerGlobals.stamina/playerGlobals.maxSta * playerGlobals.maxSta * 5, 16, 4);
    bar.endFill();
}

// MINI MAP
function drawMiniMap (gridX, gridY)
{
    var mmap_size = 180;
    var mmap_units = 5;
    var mmap_unit_size = mmap_size/mmap_units;
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
            }
        }
    }
    
    minimap.endFill();
    
    minimap.alpha = 0.8;
}