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
var speed = 300;
var gravity = 1000;
var jumpHeight = -650;
var player;

// GAME OBJECTS
var platforms, jumpthruPlatforms, coins, enemies, vases, spikes, vases;

// DRAWN OBJECTS
var healthHUD, moneyHUD, minimap;

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

        var background = map.createLayer('background');
        var background2 = map.createLayer('background2');
        platforms = map.createLayer('platforms');
        jumpthruPlatforms = map.createLayer('jumpthru');

        // HAZARDS
        spikes = game.add.group();
        spikes.enableBody = true;
        
        lasers = game.add.group();
        lasers.enableBody = true;

        map.createFromObjects('sprites', 84, 'spikes', 0, true, false, spikes);
        spikes.setAll('body.immovable', true);
        
        map.createFromObjects('sprites', 86, 'laser', 0, true, false, lasers);
        lasers.setAll('body.immovable', true);
        
        lasers.forEach(function (laserBase)
        {
            laserBase.anchor.x = 0.5;
            laserBase.x += 16;
            
            laserBase.ray = new Phaser.Line(laserBase.x, laserBase.y, laserBase.x, 2000);
            var intersection = getWallIntersection(laserBase.ray);
            var endSet = false;
            
            laserBase.update = function ()
            {
                if (intersection && !endSet)
                {
                    console.log(intersection.x)
                    endSet = true;
                    laserBase.ray = laserBase.ray.setTo(laserBase.ray.start.x, laserBase.ray.start.y, laserBase.ray.end.x, intersection.y);
                    
                    var laserWidth = 8;
                    
                    laserBase.laserRect = game.add.graphics(laserBase.x, laserBase.y);
                    laserBase.laserRect.beginFill(0xff0000, .6);
                    laserBase.laserRect.drawRect(0 - laserWidth/2, 10, laserWidth, laserBase.ray.height - 10);
                    laserBase.laserRect.endFill();
                    
                    game.physics.enable(laserBase, Phaser.Physics.ARCADE);
                    laserBase.body.setSize(laserWidth, laserBase.ray.height, -1*laserWidth/2 + 16, 0);
                    if (laserBase.timer)
                    {
                        if (laserBase.delay)
                        {
                            var delayTimer = game.time.create(true);
                            delayTimer.add(laserBase.delay, function () {
                                var laserTimer = game.time.create(false);
                                laserTimer.loop(laserBase.timer, function () {
                                    laserBase.body.enable = !laserBase.body.enable;
                                    laserBase.laserRect.visible = !laserBase.laserRect.visible;
                                }, this);
                                laserTimer.start();
                            }, this);
                            delayTimer.start();
                        }
                        else {
                            var laserTimer = game.time.create(false);
                            laserTimer.loop(laserBase.timer, function () {
                                laserBase.body.enable = !laserBase.body.enable;
                                laserBase.laserRect.visible = !laserBase.laserRect.visible;
                            }, this);
                            laserTimer.start();
                        }
                    }
                }
            }
        });
        
        // COIN GROUP
        
        coins = game.add.group();
        coins.enableBody = true;
        coins.physicsBodyType = Phaser.Physics.ARCADE;
        
        // SPAWN VASES
        
        vases = game.add.group();
        vases.enableBody = true;
        vases.physicsBodyType = Phaser.Physics.ARCADE;
        
        map.createFromObjects('sprites', 45, 'vase', 0, true, false, vases);
        
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

        game.camera.follow(player);
    }
    
    tempMap.update = function () {
    
        game.physics.arcade.overlap(player, coins, collectCoins, null, this);
        game.physics.arcade.overlap(player, powerup, powerUp, null, this);
        
        game.physics.arcade.collide(enemies, platforms);
        game.physics.arcade.collide(coins, platforms);
        game.physics.arcade.collide(enemies, jumpthruPlatforms);
        game.physics.arcade.collide(coins, jumpthruPlatforms);
        
        healthHUD.text = "HP: "+playerGlobals.hp;
        
        if (playerGlobals.hp < 1)
        {
            resetGame();
        }

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
    
    moneyHUD = game.add.text(16, 64, '$: '+playerGlobals.money, { fontSize: '32px', fill: '#fff', stroke: 'black', strokeThickness: 8 });
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

// LASER COLLISION WITH WALL
function getWallIntersection (ray) {
    var distanceToWall = Number.POSITIVE_INFINITY;
    var closestIntersection = null;

    // For each of the walls...
    var tiles = platforms.getTiles(ray.x, ray.y, 32, ray.height);
    console.log(tiles);
    
    tiles.forEach(function(tile) {
        if (tile.index != -1)
        {
        // Create an array of lines that represent the four edges of each wall
        var tileTop = new Phaser.Line(tile.x*32, tile.y*32, tile.x*32+32, tile.y*32);

        // Test each of the edges in this wall against the ray.
        // If the ray intersects any of the edges then the wall must be in the way.
        var intersect = ray.intersects(tileTop);
        //console.log(tileTop.y);
        if (intersect) {
            // Find the closest intersection
            distance = this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
            if (distance < distanceToWall) {
                distanceToWall = distance;
                closestIntersection = intersect;
            }
        }
        }
    }, this);

    return closestIntersection;
};

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