// GAME GLOBALS
//====================================
var maps = [];
var mapVisited = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
var mapSize = 20;

for (var i = 0; i < mapSize; i++)
{
    for (var j = 0; j < mapSize; j++)
    {
        mapVisited[i][j] = false;
    }
}

// PHYSICS VARIABLES
var speed = 350;
var gravity = 1000;
var jumpHeight = -650;
var player;

// GAME OBJECTS
var platforms, jumpthruPlatforms, coins, enemies, vases, spikes, saves;

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
        map.addTilesetImage('tileset', 'tiles');

        //var background = map.createLayer('background');
        var background2 = map.createLayer('background2');
        platforms = map.createLayer('platforms');
        jumpthruPlatforms = map.createLayer('jumpthru');

        // HAZARDS
        spikes = game.add.group();
        spikes.enableBody = true;

        map.createFromObjects('sprites', 84, 'spikes', 0, true, false, spikes);
        spikes.setAll('body.immovable', true);
        
        lasers = game.add.group();
        lasers.enableBody = true;

        map.createFromObjects('sprites', 86, 'laser', 0, true, false, lasers);
        lasers.setAll('body.immovable', true);

        createLasers(lasers);
        
        // COIN GROUP
        
        coins = game.add.group();
        coins.enableBody = true;
        coins.physicsBodyType = Phaser.Physics.ARCADE;
        
        // SPAWN VASES
        
        vases = game.add.group();
        vases.enableBody = true;
        vases.physicsBodyType = Phaser.Physics.ARCADE;
        
        map.createFromObjects('sprites', 45, 'vase', 0, true, false, vases);
        
        saves = game.add.group();
        saves.enableBody = true;
        
        map.createFromObjects('sprites', 10, 'toilet', 0, true, false, saves);
        
        saves.forEachAlive(function (toilet)
        {
            toilet.x -= 68;
            toilet.body.setSize(128,64,0,64);
            toilet.body.immovable = true;
        });
        
        //===============
        
        // SPAWN ENEMIES
        
        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        
        map.createFromObjects('sprites', 47, 'enemy', 0, true, false, enemies);
        
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
        map.setCollisionBetween(1, 1000, true, 'jumpthru');

        setTileCollision(jumpthruPlatforms, [5, 6, 7], {
            top: true,
            bottom: false,
            left: false,
            right: false
        });

        platforms.resizeWorld();

        createPlayer();
        
        powerup = game.add.group();
        powerup.enableBody = true;
        
        if (!playerGlobals.powerUps[0])
        {
            map.createFromObjects('sprites', 29, 'djPowerup', 0, true, false, powerup);
        }
        if (!playerGlobals.powerUps[1])
        {
            map.createFromObjects('sprites', 9, 'invisPowerup', 0, true, false, powerup);
        }
        
        // MINI MAP

        drawMiniMap(gridX, gridY);
        
        // HUD
        
        drawHUD();

        game.camera.focusOn(player);
        game.camera.follow(player);
        game.camera.lerp.x = .1;
    }
    
    tempMap.update = function () {
        
        game.world.bringToTop(minimap);
    
        game.physics.arcade.overlap(player, coins, collectCoins, null, this);
        game.physics.arcade.overlap(player, powerup, powerUp, null, this);
        
        game.physics.arcade.collide(enemies, platforms);
        game.physics.arcade.collide(coins, platforms);
        game.physics.arcade.collide(enemies, jumpthruPlatforms);
        game.physics.arcade.collide(coins, jumpthruPlatforms);
        
        /*if (playerGlobals.hp < 1)
        {
            resetGame();
        }*/

        exits.forEach(checkExits);
    }
    
    // Hitbox Debugging
    tempMap.render = function () {
        /*lasers.forEachAlive(function (obj)
        {
            game.debug.body(obj);
        });*/
        
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
            if (player.body.y < exit.point && player.body.x > exit.bound1 && player.body.x < exit.bound2)
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
    
    playerGlobals.money += 10;
    moneyHUD.text = '$: '+playerGlobals.money;

}

function switchDir (ref)
{
    ref.facing = ref.facing * -1;
}

function powerUp (player, power)
{
    if (power.ability == 0)
    {
        playerGlobals.maxJumps += 1;
    }
    playerGlobals.powerUps[power.ability] = true;
    console.log(playerGlobals.powerUps[1]);
    power.kill();
}

//SAVE AND LOAD
function saveGame ()
{
    localStorage.setItem("savegame", JSON.stringify(playerGlobals));
    playerGlobals.maxJumps += 1;
    console.log('game saved');
}

function loadGame ()
{
    console.log(localStorage.savegame);
    playerGlobals = JSON.parse(localStorage.savegame);
}

// RESET GAME
function resetGame ()
{
    playerGlobals = {
        lastX: 300,
        lastY: 300,
        xVel: 600,
        yVel: -500,
        hp: 4,
        money: 0,
        jumps: 0,
        maxJumps: 1,
        xDir: 0,
        hurt: false,
        powerUps: [false, false], // 0 - Double Jump 1 - Invisibility
        lastSave: null
    };
    game.state.start('9x10');
}