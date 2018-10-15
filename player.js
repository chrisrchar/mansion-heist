/* global
    Phaser, game, player:true, gravity, speed, cursors, jumpHeight
*/
var pad1, jumpButton, leftButton, rightButton, atkButton, ablButton;

var playerStates, grounded, facing, hitboxes, hitbox1, atkTimer, invisible, attacking;

var jumpsfx;

var playerGlobals = {
    lastX: 300,
    lastY: 300,
    xVel: 600,
    yVel: -500,
    hp: 4,
    jumps: 0,
    maxJumps: 1,
    canDoubleJump: false,
    xDir: 0,
    hurt: false
};

function createPlayer() {
    // create player object and enable physics
    player = game.add.sprite(playerGlobals.lastX, playerGlobals.lastY, 'fox');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    
    // Add player animations based on sprite sheet
    player.animations.add('run', [1, 2, 3, 4, 5, 6], 10, true);
    player.animations.add('jump', [7, 9], 10, false);
    player.animations.add('land', [11, 0], 10, false);
    player.animations.add('attack', [12, 13, 14, 15], 20, false);
    
    // Center the player
    player.anchor.x = .5;
    player.anchor.y = .5;

    // Adjust player hitbox
    player.body.setSize(player.width/6, player.height, player.width/3+20, 0);
    
    // Set player physics variables
    player.body.gravity.y = gravity;
    player.body.maxVelocity = 925;
    
    // Adjust player velocity for a new room
    player.body.velocity.x = playerGlobals.xVel;
    player.body.velocity.y = playerGlobals.yVel;
    
    // Make a group for other hitboxes (such as attacks)
    hitboxes = game.add.group();
    hitboxes.enableBody = true;
    player.addChild(hitboxes);
    
    // Make the hitbox for the weapon swing
    hitbox1 = hitboxes.create(0,0,null);
    hitbox1.anchor.setTo(.5,.5);
    hitbox1.body.setSize(32, 32);
    
    //================
    // PLAYER CONTROLS
    
    // Gamepad integration
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
    
    player.body.onCollide = new Phaser.Signal();
    player.body.onCollide.add(collide);
    
    hitbox1.body.onOverlap = new Phaser.Signal();
    hitbox1.body.onOverlap.add(attackHit);
    
    hitbox1.body.enable = false;
        
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
        game.physics.arcade.collide(player, enemies);
        
        hitbox1.body.setSize(64,64,64*facing - 16,-40);
        
        game.physics.arcade.overlap(hitbox1, enemies);
        game.physics.arcade.overlap(hitbox1, vases);
        
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
            if (!attacking)
            {
                player.frame = 9;
            }
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

    if (playerGlobals.jumps < playerGlobals.maxJumps)
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
    attacking = true;
    hitbox1.body.enable = true;
    player.animations.play('attack');
    atkTimer.add(200, atkCallback, this);
    atkTimer.start();
    
}

function atkCallback ()
{
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
                player.body.velocity.x = Math.sign(player.body.velocity.x) * -1 * 50;
                player.body.velocity.y = jumpHeight*.75;
                console.log(player.body.velocity.y);
                playerGlobals.hurt = true;
                hurt(collider);   
            }
            break;
        case 'enemy':
            if (playerGlobals.hurt != true)
            {
                game.camera.shake(0.005, 100);
                playerGlobals.hp -= 1;
                player.tint = 0xff0000;
                playerGlobals.hurt = true;
                player.body.velocity.x = 200 * Math.sign(player.body.x - other.body.x);
                player.body.velocity.y = jumpHeight*.75;
                console.log(player.body.velocity.y);
                hurt(collider);   
            }
            break;
    }
}

function attackHit (atkHitbox, other)
{
    console.log('hit '+other.key)
    if (!other.hurt && other.key == 'enemy')
    {
        other.hp -= 1;
        console.log(other.hp);
        if (other.hp < 1)
            other.kill();
        other.hurt = true;
        other.tint = 0xff0000;
        other.body.velocity.x = 300 * Math.sign(other.body.x - player.body.x);
        other.body.velocity.y = jumpHeight*.5;
        hurt(other);
    }
    if (other.key == 'vase')
    {
        var spoils = coins.create(other.body.x, other.body.y, 'coin');
        spoils.body.gravity.y = gravity;
        spoils.body.drag.x = 500;
        spoils.body.velocity.x = 150 * Math.sign(other.body.x - player.body.x);
        other.destroy();
    }
}