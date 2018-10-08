/* global
    Phaser, game, player:true, gravity, speed, cursors, jumpHeight
*/
var pad1, jumpButton, leftButton, rightButton, atkButton, ablButton;

var playerStates, grounded, facing, hitboxes, hitbox1, atkTimer, invisible, attacking;

var jumpsfx;

var playerGlobals = {
    lastX: 328,
    lastY: 128,
    xVel: 600,
    yVel: -500,
    hp: 4,
    jumps: 0,
    canDoubleJump: false,
    xDir: 0,
    hurt: false
};

function createPlayer() {
    // create player object and enable physics
    player = game.add.sprite(playerGlobals.lastX, playerGlobals.lastY, 'fox');
    
    player.animations.add('run', [1, 2, 3, 4, 5], 10, true);
    player.animations.add('jump', [6, 7], 10, false);
    player.animations.add('attack', [8, 9, 10], 20, false);
    
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.anchor.x = .5;
    player.anchor.y = .5;
    
    player.body.setSize(player.width/3, player.height, 30, 0);
    
    player.body.gravity.y = gravity;
    player.body.maxVelocity = 925;
    
    player.body.velocity.x = playerGlobals.xVel;
    player.body.velocity.y = playerGlobals.yVel;
    
    game.input.resetLocked = true;
    
    hitboxes = game.add.group();
    hitboxes.enableBody = true;
    player.addChild(hitboxes);
    
    hitbox1 = hitboxes.create(0,0,null);
    hitbox1.anchor.setTo(.5,.5);
    hitbox1.body.setSize(32, 32);
    
    // PLAYER CONTROLS
    game.input.gamepad.start();
    pad1 = game.input.gamepad.pad1;
    
    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    atkButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    ablButton = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
    
    // ADDING CONTROL CALLBACKS
    jumpButton.onDown.add(jump);
    atkButton.onDown.add(attack);
    ablButton.onDown.add(abilityDown);
    ablButton.onUp.add(abilityUp);
    
    pad1.onConnectCallback = function () {
        console.log('gamepad connected');
    };
    
    atkTimer = game.time.create(false);
    
    // Player States
    playerStates = {
        IDLE: "IDLE",
        WALKING: "WALKING",
        JUMPING: "JUMPING",
        INVISIBLE: "INVISIBLE",
        ATTACKING: "ATTACKING"
    };
    var firstCheck = true;
    var xDir;
    
    jumpsfx = game.add.audio('jumpsfx');
    
    player.body.onCollide = new Phaser.Signal()
    player.body.onCollide.add(collide);
        
    // PLAYER UPDATE
    player.update = function () {
        
        if (pad1.connected && !checkButtons(pad1))
        {
            console.log('setting controller buttons');
            ablButton = pad1.getButton(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER);
            jumpButton = pad1.getButton(Phaser.Gamepad.XBOX360_A);
            atkButton = pad1.getButton(Phaser.Gamepad.XBOX360_X);
            leftButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
            rightButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
            
            jumpButton.onDown.add(jump);
            atkButton.onDown.add(attack);
            ablButton.onDown.add(abilityDown);
            ablButton.onUp.add(abilityUp);
        }
        
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(player, spikes);
        
        hitbox1.body.setSize(32,32,32*facing,0);
        
        //var clipping = game.physics.arcade.overlap(player, platforms);
        
        grounded = player.body.blocked.down;
        
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
        
        if (!playerGlobals.hurt)
        {
            if (xDir != 0)
            {
                facing = xDir;
                player.body.velocity.x = xDir * speed;
                player.scale.setTo(xDir, 1);
                if (grounded && !attacking)
                {
                    player.animations.play('run');
                    player.state = playerStates.WALKING;
                }
            }
            else 
            {
                if (grounded && !attacking)
                {
                    player.frame = 0;
                }
                player.body.velocity.x = 0
            }
        }

        // variable jumping
        if (!jumpButton.isDown && player.body.velocity.y < 0 && !playerGlobals.hurt)
        {
            player.body.velocity.y = Math.max(player.body.velocity.y, jumpHeight/4);
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
        if (grounded)
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

//==================
// JUMP FUNCTIONS

function jump ()
{
    //Variable Jumping

    if (playerGlobals.jumps < 2)
    {
        jumpsfx.play();
        player.animations.play('jump');
        player.body.velocity.y = jumpHeight;
        playerGlobals.jumps++;
        player.state = playerStates.JUMPING;
    }
}

//==================
// ATTACK FUNCTIONS

function attack ()
{
    console.log('attacking');
    attacking = true;
    hitbox1.body.enable = true;
    player.animations.play('attack');
    atkTimer.add(200, atkCallback, this);
    atkTimer.start();
    
}

function atkCallback ()
{
    console.log('attack end');
    attacking = false;
    hitbox1.body.enable = false;
    atkTimer.removeAll();
}

//===================
// ABILITY FUNCTIONS

function abilityDown ()
{
    invisible = true;
    player.alpha = 0.5;
}

function abilityUp ()
{
    invisible = false;
    player.alpha = 1;
}

//===================
// COLLISION

function collide (collider, other)
{
    switch(other.key)
    {
        case 'spikes':
            if (playerGlobals.hurt != true)
            {
                game.camera.shake(0.005, 100);
                playerGlobals.hp -= 1;
                player.tint = 0xff0000;
                player.body.velocity.x = player.body.velocity.x * -1;
                player.body.velocity.y = jumpHeight*.75;
                console.log(player.body.velocity.y);
                playerGlobals.hurt = true;
                hurt(other);   
            }
            break;
    }
}