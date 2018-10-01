// GAME GLOBALS
//====================================
var maps = [];

// PHYSICS VARIABLES
var speed = 300;
var gravity = 1000;
var jumpHeight = -650;
var player;

// GAME OBJECTS
var platforms, coins;

// DRAWN OBJECTS
var scoreText;

//====================================

// Map creation
function addMap (mapName, tilemapName, exits)
{
    // Create empty state object to add to
    var tempMap = {}
    
    tempMap.mapName = mapName;
    
    tempMap.preload = function () {
        game.load.spritesheet('dude', 'assets/spritesheets/fox_walk_80x124.png', 80, 124);
        game.load.tilemap(tilemapName, 'assets/tilemaps/'+tilemapName+'.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/tilemaps/simples_pimples.png');
        game.load.image('coin', 'assets/sprites/coin.png');
    }
    
    tempMap.create = function () {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.physics.startSystem(Phaser.Physics.ARCADE);

        var map = game.add.tilemap(tilemapName);
        map.addTilesetImage('blocks', 'tiles');

        var background = map.createLayer('background');
        platforms = map.createLayer('platforms');

        coins = game.add.group();
        coins.enableBody = true;

        map.createFromObjects('coins', 952, 'coin', 0, true, false, coins);

        map.setCollisionBetween(1, 1000, true, 'platforms');

        setTileCollision(platforms, 708, {
            top: true,
            bottom: false,
            left: false,
            right: false
        });

        //background.resizeWorld();

        scoreText = game.add.text(16, 16, 'Score: '+score, { fontSize: '32px', fill: '#fff', stroke: 'black', strokeThickness: 8 });

        createPlayer();

    }
    
    tempMap.update = function () {
    
        game.physics.arcade.overlap(player, coins, collectStar, null, this);

        exits.forEach(checkExits);
    }
    
    // Hitbox Debugging
    tempMap.render = function () {
        //game.debug.body(hitbox1);
        //game.debug.body(player);
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
        playerGlobals.lastY = player.body.y;
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

// Object Collection
function collectStar (player, star) 
{
    // Removes the star from the screen
    star.kill();
    
    score += 10;
    scoreText.text = 'Score: '+score;

}