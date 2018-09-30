/* global
    game, Phaser
*/

var state0 = {};

state0.preload = function () {
    game.load.spritesheet('dude', 'assets/spritesheets/dude.png', 32, 48);
    game.load.tilemap('map0', 'assets/tilemaps/map0.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/simples_pimples.png');
    game.load.image('coin', 'assets/sprites/coin.png');
}

// assign physics variables
var speed = 300;
var gravity = 1000;
var jumpHeight = -450;
var player;
var platforms, coins, jumpthru, scoreText;

// assign control variables
var cursors;

state0.create = function () {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    var map = game.add.tilemap('map0');
    map.addTilesetImage('blocks', 'tiles');
    
    var background = map.createLayer('background');
    platforms = map.createLayer('platforms');
    
    coins = game.add.group();
    coins.enableBody = true;
    
    jumpthru = game.add.group();
    jumpthru.enableBody = true;
    
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

state0.update = function () {
    
    game.physics.arcade.collide(player, jumpthru);
    game.physics.arcade.overlap(player, coins, collectStar, null, this);
    
    if (player.x > game.world.width)
    {
        playerGlobals.lastY = player.body.y;
        playerGlobals.lastX = 16;
        playerGlobals.xVel = player.body.velocity.x;
        playerGlobals.yVel = player.body.velocity.y;
        playerGlobals.xDir = cursors.right.isDown - cursors.left.isDown;
        game.state.start('state1');
    }
}

function collectStar (player, star) 
{
    // Removes the star from the screen
    star.kill();
    
    score += 10;
    scoreText.text = 'Score: '+score;

}

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