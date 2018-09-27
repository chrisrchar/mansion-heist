/* global
    game, Phaser
*/

var state1 = {};

state1.preload = function () {
    game.load.spritesheet('dude', 'assets/spritesheets/dude.png', 32, 48);
    game.load.image('coin', 'assets/sprites/coin.png');
    game.load.tilemap('map1', 'assets/tilemaps/map1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/simples_pimples.png');
}

// assign physics variables
var speed = 300;
var gravity = 1000;
var jumpHeight = -450;
var player;
var platforms, coins, scoreText;
var messageBox;

// assign control variables
var cursors;
var testButton, callButton;

state1.create = function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    testButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    callButton = game.input.keyboard.addKey(Phaser.Keyboard.B);
    
    callButton.onDown.add(startScene);
    
    var map = game.add.tilemap('map1');
    map.addTilesetImage('blocks', 'tiles');
    
    coins = game.add.group();
    coins.enableBody = true;
    
    var background = map.createLayer('background');
    platforms = map.createLayer('platforms');
    
    map.createFromObjects('coins', 952, 'coin', 0, true, false, coins);
    
    /*for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var coin = coins.create(i * 70, 400, 'coin');
    }*/
    
    background.resizeWorld();
    
    map.setCollisionBetween(1, 1000, true, 'platforms');
    
    scoreText = game.add.text(16, 16, 'Score: '+score, { fontSize: '32px', fill: '#fff', stroke: 'black', strokeThickness: 8 });
    
    messageBox = game.add.text(64, 64, '', { fontSize: '32px', fill: '#fff', stroke: 'black', strokeThickness: 8 });
    
    createPlayer();
    
}

state1.update = function () {
    
    game.physics.arcade.overlap(player, coins, collectStar, null, this);
    
    if (player.x < 0)
    {
        playerGlobals.lastY = player.body.y;
        playerGlobals.lastX = game.world.width - 10;
        playerGlobals.xVel = player.body.velocity.x;
        playerGlobals.yVel = player.body.velocity.y;
        game.state.start('state0');
    }
}

function collectStar (player, star) 
{
    // Removes the star from the screen
    star.kill();
    
    score += 10;
    scoreText.text = 'Score: '+score;

}

function startScene()
{
    if (!inMessage)
    {
        callScene(sampleDialogue);
    }
}