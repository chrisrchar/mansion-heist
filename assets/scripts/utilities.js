// GAME GLOBALS
//====================================
var maps = [];
var mapVisited = [[],[],[],[],[],[],[],[],[],[]];
var mapSize = 10;

for (var i = 0; i < mapSize; i++)
{
    for (var j = 0; j < mapSize; j++)
    {
        mapVisited[i][j] = false;
    }
}

// PHYSICS VARIABLES
var speed = 300;
var gravity = 1000;
var jumpHeight = -650;
var player;

// GAME OBJECTS
var platforms, coins, enemies, vases;

// DRAWN OBJECTS
var healthHUD, moneyHUD, minimap;

// GAME VARIABLES

var money  = 0;

//====================================

// Map creation
function addMap (mapName, tilemapName, exits, gridX, gridY)
{
    // Create empty state object to add to
    var tempMap = {}
    
    tempMap.mapName = mapName;
    
    tempMap.create = function () {
        if (!mapVisited[gridY][gridX])
        {
            console.log(gridY+" "+gridX);
            mapVisited[gridY][gridX] = true;
        }
        
        // Make sure the input doesn't reset when changing rooms
        game.input.resetLocked = true;
        
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.physics.startSystem(Phaser.Physics.ARCADE);

        var map = game.add.tilemap(tilemapName);
        map.addTilesetImage('solids', 'tiles');
        map.addTilesetImage('wall', 'wall');
        map.addTilesetImage('window', 'window');
        map.addTilesetImage('shelf', 'shelf');
        map.addTilesetImage('pedestal', 'pedestal');

        var background = map.createLayer('background');
        var background2 = map.createLayer('background2');
        platforms = map.createLayer('platforms');

        spikes = game.add.group();
        spikes.enableBody = true;

        map.createFromObjects('sprites', 3305, 'spikes', 0, true, false, spikes);
        spikes.setAll('body.immovable', true);
        
        // COIN GROUP
        
        coins = game.add.group();
        coins.enableBody = true;
        coins.physicsBodyType = Phaser.Physics.ARCADE;
        
        // SPAWN VASES
        
        vases = game.add.group();
        vases.enableBody = true;
        vases.physicsBodyType = Phaser.Physics.ARCADE;
        
        map.createFromObjects('vases', 66, 'vase', 0, true, false, vases);
        
        //===============
        
        // SPAWN ENEMIES
        
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        
        map.createFromObjects('enemies', 73, 'enemy', 0, true, false, enemies);
        
        enemies.setAll('body.gravity.y', gravity);
        enemies.setAll('body.drag.x', 500);
        enemies.setAll('body.immovable', true);
        
        enemies.forEach(function (obj) {
            obj.anchor.x = .5;
            obj.anchor.y = .5;
            obj.animations.add('walk', [1, 2, 3, 4], 10, true);
            obj.animations.play('walk');
            
            obj.hp = 3;
            obj.facing = 1;
            obj.update = function ()
            {
                if (!obj.hurt)
                {
                    obj.body.velocity.x = 300*obj.facing;
                    obj.scale.setTo(obj.facing, 1);
                }

            }
            
            var walkTimer = game.time.create(false);
            walkTimer.loop(1000, switchDir, this, obj);
            walkTimer.start();
        }, this);
        
        //===============

        map.setCollisionBetween(1, 1000, true, 'platforms');

        setTileCollision(platforms, [67, 68, 69], {
            top: true,
            bottom: false,
            left: false,
            right: false
        });

        platforms.resizeWorld();

        createPlayer();
        
        powerup = game.add.group();
        powerup.enableBody = true;
        map.createFromObjects('sprites', 68, 'powerup', 0, true, false, powerup);
        
        // MINI MAP

        drawMiniMap(gridX, gridY);
        
        // HUD
        
        drawHUD();

        game.camera.follow(player);
    }
    
    tempMap.update = function () {
    
        game.physics.arcade.overlap(player, coins, collectCoins, null, this);
        game.physics.arcade.overlap(player, powerup, powerUp, null, this);
        
        game.physics.arcade.collide(enemies, platforms);
        game.physics.arcade.collide(coins, platforms);
        
        healthHUD.text = "HP: "+playerGlobals.hp;

        exits.forEach(checkExits);
    }
    
    // Hitbox Debugging
    tempMap.render = function () {
        //game.debug.body(player);  
        /*if (attacking)
        {
            game.debug.body(hitbox1);   
        }*/
        
        /*
        enemies.forEachAlive(renderGroup, this);
        function renderGroup(member) 
        {    game.debug.body(member);}*/
        
        //game.debug.cameraInfo(game.camera, 32, 32);
    }
    
    // Push the state object to the array of maps
    maps.push(tempMap);
}


// Checks all exits of a given map to see if the player is leaving one
function checkExits (exit)
{
    switch(exit.direction) {
        case "right":
            if (player.body.x > exit.point && player.body.y > exit.bound1 && player.body.y < exit.bound2)
            {
                goToMap(exit.map, exit.spawn);
            }
            break;
        case "left":
            if (player.body.x < exit.point && player.body.y > exit.bound1 && player.body.y < exit.bound2)
            {
                goToMap(exit.map, exit.spawn);
            }
            break;
        case "up":
            if (player.body.y > exit.point && player.body.x > exit.bound1 && player.body.x < exit.bound2)
            {
                goToMap(exit.map, exit.spawn);
            }
            break;
        case "down":
            if (player.body.y > exit.point && player.body.x > exit.bound1 && player.body.x < exit.bound2)
            {
                goToMap(exit.map, exit.spawn);
            }
            break;
    }
}

// Transition to a given map with given parameters
function goToMap (mapName, spawn)
{
    if (spawn.y > 0)
    {
        playerGlobals.lastY = spawn.y;
    }
    else {
        playerGlobals.lastY = player.body.y + player.height/2;
    }
    if (spawn.x > 0)
    {
        playerGlobals.lastX = spawn.x;
    }
    else {
        playerGlobals.lastX = player.body.x;
    }
    playerGlobals.xVel = player.body.velocity.x;
    playerGlobals.yVel = player.body.velocity.y;
    playerGlobals.xDir = rightButton.isDown - leftButton.isDown;
    game.state.start(mapName);
}

// Set directional collision of tiles
function setTileCollision(mapLayer, idxOrArray, dirs) {
 
    var mFunc; // tile index matching function
    if (idxOrArray.length) {
        // if idxOrArray is an array, use a function with a loop
        mFunc = function(inp) {
            for (var i = 0; i < idxOrArray.length; i++) {
                if (idxOrArray[i] === inp) {
                    return true;
                }
            }
            return false;
        };
    } else {
        // if idxOrArray is a single number, use a simple function
        mFunc = function(inp) {
            return inp === idxOrArray;
        };
    }
 
    // get the 2-dimensional tiles array for this layer
    var d = mapLayer.map.layers[mapLayer.index].data;
     
    for (var i = 0; i < d.length; i++) {
        for (var j = 0; j < d[i].length; j++) {
            var t = d[i][j];
            if (mFunc(t.index)) {
                 
                t.collideUp = dirs.top;
                t.collideDown = dirs.bottom;
                t.collideLeft = dirs.left;
                t.collideRight = dirs.right;
                 
                t.faceTop = dirs.top;
                t.faceBottom = dirs.bottom;
                t.faceLeft = dirs.left;
                t.faceRight = dirs.right;
                 
            }
        }
    }
 
}

// MINI MAP
function drawMiniMap (gridX, gridY)
{
    var mmap_size = 180;
    var mmap_units = 5;
    var mmap_unit_size = mmap_size/mmap_units;
    var minimap = game.add.graphics(game.camera.width - mmap_size - 25, 25);
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

function drawHUD()
{
    healthHUD = game.add.text(16, 16, 'HP: '+playerGlobals.hp, { fontSize: '32px', fill: '#fff', stroke: 'black', strokeThickness: 8 });
    healthHUD.fixedToCamera = true;
    
    moneyHUD = game.add.text(16, 64, '$: '+money, { fontSize: '32px', fill: '#fff', stroke: 'black', strokeThickness: 8 });
    moneyHUD.fixedToCamera = true;
}

function hurt (painReceiver) 
{
    var hurtTimer = game.time.create(true);
    hurtTimer.add(500, hurtEnd, this, painReceiver);
    hurtTimer.start();
    console.log(painReceiver.key);
}

function hurtEnd (ref)
{
    if (ref.key == 'fox')
        playerGlobals.hurt = false;
    else
        ref.hurt = false;
    ref.tint = 0xffffff;
}

// Object Collection
function collectCoins (player, coin) 
{
    // Removes the star from the screen
    coin.kill();
    
    money += 10;
    moneyHUD.text = '$: '+money;

}

function switchDir (ref)
{
    ref.facing = ref.facing * -1;
}

function powerUp (player, power)
{
    power.kill();
    playerGlobals.maxJumps += 1;
}