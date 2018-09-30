/* global
    Phaser, game, player:true, gravity, speed, cursors, jumpHeight
*/
var pad1, jumpButton, leftButton, rightButton, atkButton;

var playerGlobals = {
    lastX: 64,
    lastY: 64,
    xVel: 600,
    yVel: -500,
    jumps: 0,
    canDoubleJump: false,
    xDir: 0
};

function createPlayer() {
    // create player object and enable physics
    player = game.add.sprite(playerGlobals.lastX, playerGlobals.lastY + 48, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.anchor.x = .5;
    player.anchor.y = 1;
    //player.body.collideWorldBounds = true;
    player.body.gravity.y = gravity;
    player.body.maxVelocity = 925;
    
    player.animations.add('walk', [0, 1, 2, 3], 10, true);
    
    player.body.velocity.x = playerGlobals.xVel;
    player.body.velocity.y = playerGlobals.yVel;
    
    game.input.resetLocked = true;
    
    game.input.gamepad.start();
    pad1 = game.input.gamepad.pad1;
    
    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    atkButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    
    //atkButton.onPressCallback = test;
    
    pad1.onConnectCallback = function () {
        console.log('gamepad connected');
    };
    
    cursors = game.input.keyboard.createCursorKeys();
    
    // Player States
    var playerStates = {
        IDLE: "IDLE",
        WALKING: "WALKING",
        JUMPING: "JUMPING"
    };
    var firstCheck = true;
    var xDir;
        
    // PLAYER UPDATE
    player.update = function () {
        
        if (pad1.connected && !checkButtons(pad1))
        {
            console.log('setting controller buttons');
            jumpButton = pad1.getButton(Phaser.Gamepad.XBOX360_A);
            atkButton = pad1.getButton(Phaser.Gamepad.XBOX360_X);
            leftButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
            rightButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
        }
        
        game.physics.arcade.collide(player, platforms);
        
        //var clipping = game.physics.arcade.overlap(player, platforms);
        
        var grounded = player.body.blocked.down;
        
        // Left Right Movement
        if (firstCheck)
        {
            xDir = playerGlobals.xDir;
            firstCheck = false;
        }
        else
        {
            xDir = rightButton.isDown - leftButton.isDown;
        }
        
        if (xDir != 0)
        {
            player.body.velocity.x = xDir * speed;
            player.scale.setTo(-1 * xDir, 1);
            if (grounded)
            {
                player.state = playerStates.WALKING;
            }
            player.animations.play('walk');
        }
        else 
        {
            player.frame = 0;
            player.body.velocity.x = 0
        }

        //Variable Jumping

        if (jumpButton.isDown && grounded && playerGlobals.jumps < 1)
        {
            player.body.velocity.y = jumpHeight;
            playerGlobals.jumps++;
            player.state = playerStates.JUMPING;
        }

        if (!jumpButton.isDown && player.body.velocity.y < 0)
        {
            player.body.velocity.y = Math.max(player.body.velocity.y, jumpHeight/4);
        }

        if (!jumpButton.isDown && !grounded)
        {
            if (playerGlobals.jumps == 1)
            {
                playerGlobals.canDoubleJump = true;
            }
            else if (playerGlobals.jumps < 1)
            {
                playerGlobals.jumps = 1;
            }
        }

        if (jumpButton.isDown && !grounded && playerGlobals.canDoubleJump)
        {
            player.body.velocity.y = jumpHeight;
            playerGlobals.jumps++;
            playerGlobals.canDoubleJump = false;
        }

        // Adjust gravity for faster falling
        if (!grounded && player.body.velocity.y > -100) 
        {
            player.body.gravity.y = 1.8*gravity;
        }
        else 
        {
            player.body.gravity.y = gravity;
        }
        
        // Reset playerGlobals.jumps
        if (grounded && !jumpButton.isDown)
        {
            playerGlobals.jumps = 0;
            if (player.body.velocity.x == 0)
            {
                player.state = playerStates.IDLE;
            }
            else 
            {
                player.state = playerStates.WALKING;
            }
        }
        
        // set to max velocity
        player.body.velocity.y = Math.min(player.body.velocity.y, player.body.maxVelocity);
        
    };
} // PLAYER OBJECT

function checkButtons (pad)
{
    return jumpButton == pad.getButton(Phaser.Gamepad.XBOX360_A) && leftButton == pad.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT) && rightButton == pad.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
}