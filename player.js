/* global
    Phaser, game, player:true, gravity, speed, cursors, jumpHeight
*/
var playerStates, grounded, facing, hitboxes, hitbox1, atkTimer, invisible, attacking, jumpDown, resting;

var textForMove, textForJump, textForAtk, textForAbl;

var atkAnim, puAnim, jumpAnim, rollAnim;

var jumpsfx;

var playerHeight = 124;

var playerGlobals = {
    lastX: 300,
    lastY: 300,
    xVel: 600,
    yVel: -500,
    hp: 100,
    maxhp: 100,
    stamina: 20,
    maxSta: 20,
    money: 0,
    jumps: 0,
    maxJumps: 1,
    xDir: 0,
    hurt: false,
    powerUps: [false, false, false], // 0 - Double Jump 1 - Invisibility 2 - Roll
    currentPU: 1,
    rolling: false,
    lastMap: null,
    lastSave: null
};

var puEvents = [1, 3];

var abiTimer, refreshTimer;

function createPlayer(spawn) {
    // create player object and enable physics
    player = game.add.sprite(spawn.x, spawn.y + playerHeight/2 - 8, 'fox');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    
    // Add player animations based on sprite sheet
    player.animations.add('run', [1, 2, 3, 4, 5, 6], 10, true);
    jumpAnim = player.animations.add('jump', [7, 9], 10, false);
    player.animations.add('land', [11, 0], 10, false);
    atkAnim = player.animations.add('attack', [12, 13, 14, 15, 15], 20, false);
    rollAnim = player.animations.add('roll', [19, 20, 21, 22, 23, 24, 25, 26, 27, 28], 20, true);
    
    atkAnim.onComplete.add(function () {
        attacking = false;
        hitbox1.body.enable = false;
    });
    
    puAnim = player.animations.add('drink', [16, 17, 17, 16], 1, false);
    
    // Center the player
    player.anchor.x = .5;
    player.anchor.y = .5;

    // Adjust player hitbox
    if (playerGlobals.rolling)
    {
        player.body.setSize(player.width/6, (player.height-16)/2, player.width/3+20, (player.height-16)/2+16);
    }
    else
    {
        player.body.setSize(player.width/6, player.height-16, player.width/3+20, 16);
    }
        
    // Set player physics variables
    player.body.gravity.y = gravity;
    player.body.maxVelocity = 1000;
    
    // Adjust player velocity for a new room
    player.body.velocity.x = playerGlobals.xVel;
    player.body.velocity.y = playerGlobals.yVel;
    
    console.log(player.body.velocity.y);
    
    // Make a group for other hitboxes (such as attacks)
    hitboxes = game.add.group();
    hitboxes.enableBody = true;
    player.addChild(hitboxes);
    
    // Make the hitbox for the weapon swing
    hitbox1 = hitboxes.create(0,0,null);
    hitbox1.anchor.setTo(.5,.5);
    
    // If the player was hurt then change their state back
    if (playerGlobals.hurt)
    {
        playerGlobals.hurt = false;
    }

    attacking = false;
    
    textForMove = "arrow keys";
    textForJump = "spacebar";
    textForAtk = "A key";
    textForAbl = "S key";
    
    pad1.onConnectCallback = function () {
        console.log('gamepad connected');
    };
    
    // Player States
    playerStates = {
        IDLE: "IDLE",
        WALKING: "WALKING",
        JUMPING: "JUMPING",
        INVISIBLE: "INVISIBLE",
        ATTACKING: "ATTACKING"
    };
    var xDir;
    
    jumpsfx = game.add.audio('jumpsfx');
    
    player.body.onCollide = new Phaser.Signal();
    player.body.onCollide.add(collide);
    
    hitbox1.body.onOverlap = new Phaser.Signal();
    hitbox1.body.onOverlap.add(attackHit);
    
    hitbox1.body.enable = false;
    
    abiTimer = game.time.create(false);
    abiTimer.loop(200, function () {
        playerGlobals.stamina -= 2;
        updateStaHUD();
    }, this);
    
    refreshTimer = game.time.create(false);
    refreshTimer.loop(500, function () {
        if (playerGlobals.stamina < playerGlobals.maxSta)
        {
            playerGlobals.stamina = playerGlobals.stamina.clamp(playerGlobals.stamina + 2, playerGlobals.maxSta);
            updateStaHUD();
        }
    }, this);
    
    abiTimer.start();
    abiTimer.pause();
    refreshTimer.start();
    
    textPlacement = {
            default: {x: game.camera.width/2-400, y: 600-60, anchor: 0},
            center: {x: game.camera.width/2, y: 600, anchor: 0.5}
    };
    
    setEvents();
        
    // PLAYER UPDATE
    player.update = function () {
        
        if (pad1.connected && !checkButtons(pad1))
        {
            removeInputCallbacks();
            
            console.log('setting controller buttons');
            ablButton = pad1.getButton(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER);
            jumpButton = pad1.getButton(Phaser.Gamepad.XBOX360_A);
            atkButton = pad1.getButton(Phaser.Gamepad.XBOX360_X);
            leftButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
            rightButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
            downButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN);
            upButton = pad1.getButton(Phaser.Gamepad.XBOX360_DPAD_UP);
            saveTestBtn = pad1.getButton(Phaser.Gamepad.XBOX360_START);
            ablCycleButton = pad1.getButton(Phaser.Gamepad.XBOX360_RIGHT_BUMPER);
            
            jumpButton.onDown.add(confirmPressed);
            atkButton.onDown.add(attack);
            ablButton.onDown.add(abilityDown);
            ablButton.onUp.add(abilityUp);
            saveTestBtn.onDown.add(saveGame);
            loadTestBtn.onDown.add(loadGame);
            ablCycleButton.onDown.add(cycleAbility);

            leftButton.onDown.add(leftPressed);
            rightButton.onDown.add(rightPressed);
            upButton.onDown.add(upPressed);
            downButton.onDown.add(downPressed);
            downButton.onUp.add(downReleased);

            jumpButton.onDown.add(jump);
            
            textForMove = "D-Pad";
            textForJump = "X Button";
            textForAtk = "Square Button";
            textForAbl = "Right Trigger";
            
            inputs.push(leftButton);
            inputs.push(rightButton);
            inputs.push(downButton);
            inputs.push(upButton);
            inputs.push(jumpButton);
            inputs.push(atkButton);
            inputs.push(ablButton);
            inputs.push(ablCycleButton);
            
            setEvents();
            
            console.log(textForAbl);
        }
        
        leftAxisX = pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
        leftAxisY = pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
        
        game.physics.arcade.collide(player, platforms);
        resting = game.physics.arcade.collide(player, saves) && player.body.touching.down;
        
        if (inMessage)
        {
            attacking = false;
        }
        
        if (!jumpDown && leftAxisY >= .8)
        {
            downPressed();
        }
        
        if (!jumpDown)
        {
            game.physics.arcade.collide(player, jumpthruPlatforms);
        }
        
        game.physics.arcade.collide(player, spikes);
        
        enemyGroups.forEach(function (enemGroup) {
            game.physics.arcade.collide(player, enemGroup);
            game.physics.arcade.overlap(hitbox1, enemGroup);
        });
        
        if (!invisible)
        {
            game.physics.arcade.collide(player, lasers);
            game.physics.arcade.collide(player, bullets);
        }
        
        game.physics.arcade.overlap(hitbox1, vases);
        
        if (attacking)
        {
            hitbox1.body.setSize(64,64,64*facing - 16,-40);
        }
        
        //var clipping = game.physics.arcade.overlap(player, platforms);
        
        grounded = player.body.blocked.down || player.body.touching.down;
        
        xDir = rightButton.isDown - leftButton.isDown || Math.sign(leftAxisX);
        
        if (!playerGlobals.hurt)
        {
            if (xDir != 0 && !inMessage && !puAnim.isPlaying && !shopOpen)
            {
                facing = xDir;
                player.body.velocity.x = xDir * speed;
                player.scale.setTo(xDir, 1);
                if (grounded && !attacking && !puAnim.isPlaying && !playerGlobals.rolling)
                {
                    player.animations.play('run');
                    player.state = playerStates.WALKING;
                }
                if (playerGlobals.rolling && !rollAnim.isPlaying)
                {
                    rollAnim.play();
                }
                else if (playerGlobals.rolling && rollAnim.isPaused)
                {
                    rollAnim.paused = false;
                }
                    
            }
            else 
            {
                if (grounded && !attacking && !puAnim.isPlaying && !playerGlobals.rolling)
                {
                    player.frame = 0;
                }
                else if (playerGlobals.rolling)
                {
                    rollAnim.paused = true;
                }
                player.body.velocity.x = 0
            }
        }

        // variable jumping
        if (!jumpButton.isDown && player.body.velocity.y < 0 && !playerGlobals.hurt)
        {
            player.body.velocity.y = Math.max(player.body.velocity.y, jumpHeight/4);
        }

        // Check to see if the player is falling up or down
        if (player.body.velocity.y > -100) 
        {
            // If the player is falling but hasn't jumped, make it so they can't jump
            if (playerGlobals.jumps < 1)
            {
                playerGlobals.jumps = 1;
            }
            
            // Show jumping animation if player isn't attacking
            player.body.gravity.y = 2*gravity;
        }
        else 
        {   
            player.body.gravity.y = gravity;
        }
        
        if (!grounded && !attacking && !playerGlobals.hurt)
        {
            player.frame = 9;
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
        
        if (invisible && playerGlobals.stamina < 1)
        {
            invisible = false;
            player.alpha = 1;
            abiTimer.pause();
            refreshTimer.resume();
        }
        
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
    if (playerGlobals.jumps < playerGlobals.maxJumps && !inMessage && !puAnim.isPlaying  && !shopOpen && !attacking)
    {
        jumpsfx.play();
        player.animations.play('jump');
        player.body.velocity.y = jumpHeight;
        playerGlobals.jumps++;
        player.state = playerStates.JUMPING;
        
        if (playerGlobals.rolling)
        {
            playerGlobals.rolling = false;
            player.body.setSize(player.body.width, player.body.height*2, player.body.offset.x, 16);
        }
    }
}

function confirmPressed ()
{
    if (inMessage)
    {
        handleNextMessage();
    }
    
    if (shopOpen)
    {
        buyProduct();
    }
}

function leftPressed ()
{
    if (shopOpen)
    {
        shopMoveLeft();
    }
}

function rightPressed ()
{
    if (shopOpen)
    {
        shopMoveRight();
    }
}

function upPressed ()
{
    if (shopOpen)
    {
        shopMoveUp();
    }
}

function downPressed ()
{
    if (resting && !inMessage  && !shopOpen)
    {
        saveGame();
    }
    
    else if (game.physics.arcade.overlap(player, shopObjects) && !inMessage  && !shopOpen)
    {
        shopOpen = true;
        openShop();
    }
    
    else if (shopOpen)
    {
        shopMoveDown();
    }
    
    else if (grounded && !inMessage  && !shopOpen)
    {
        if (player.body.velocity.x == 0)
        {
            jumpDown = true
            var groundTimer = game.time.create(true);
            groundTimer.add(200, function () {jumpDown = false;} , this);
            groundTimer.start();
        }
        else
        {
            if (!playerGlobals.rolling)
            {
                playerGlobals.rolling = true;
                player.body.setSize(player.body.width, player.body.height/2, player.body.offset.x, player.body.height/2 + 16);
            }
        }
    }
}

function downReleased ()
{
    if (playerGlobals.rolling)
    {
        playerGlobals.rolling = false;
        player.body.setSize(player.body.width, player.body.height*2, player.body.offset.x, 16);
    }
}

//==================
// ATTACK FUNCTIONS

function attack ()
{
    if (!attacking && !inMessage && !puAnim.isPlaying  && !shopOpen)
    {
        attacking = true;
        atkSFX.play();
        var atkHitTimer = game.time.create(true);
        atkHitTimer.add(150, function () {
            hitbox1.body.enable = true;
        });
        atkHitTimer.start();
        atkAnim.play();
    }
    else if (shopOpen)
    {
        shopOpen = false;
        closeShop();
    }
}

//===================
// ABILITY FUNCTIONS

function abilityDown ()
{
    if (playerGlobals.powerUps[1] && !inMessage  && !shopOpen)
    {
        invisible = true;
        player.alpha = 0.5;
        abiTimer.resume();
        refreshTimer.pause();
    }
}

function abilityUp ()
{
    if (playerGlobals.powerUps[1] && !inMessage  && !shopOpen)
    {
        invisible = false;
        player.alpha = 1;
        abiTimer.pause();
        refreshTimer.resume();
    }
}

function cycleAbility()
{
    playerGlobals.currentPU += 1;
    if (playerGlobals.currentPU > playerGlobals.powerUps.length)
    {
        playerGlobals.currentPU = 1;
    }
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
                playerGlobals.hp -= playerGlobals.maxhp * .2;
                player.tint = 0xff0000;
                player.body.velocity.x = Math.sign(player.body.velocity.x) * -1 * 50;
                player.body.velocity.y = jumpHeight*.75;
                playerGlobals.hurt = true;
                hurt(collider);   
            }
            break;
        case 'bullet':
        case 'enemy2':
        case 'enemy':
            if (playerGlobals.hurt != true)
            {
                bossHurtSFX.play();
                game.camera.shake(0.005, 100);
                playerGlobals.hp -= playerGlobals.maxhp * .15;
                player.tint = 0xff0000;
                playerGlobals.hurt = true;
                player.body.velocity.x = 100 * Math.sign(player.body.x - other.body.x);
                player.body.velocity.y = jumpHeight*.6;
                hurt(collider);
                if (other.key == 'bullet')
                {
                    other.destroy();
                }
            }
            break;
        case 'laser':
            if (playerGlobals.hurt != true)
            {
                game.camera.shake(0.005, 100);
                playerGlobals.hp -= playerGlobals.maxhp * .1;
                player.tint = 0xff0000;
                playerGlobals.hurt = true;
                player.body.velocity.x = 200 * Math.sign(player.body.x - other.body.x);
                player.body.velocity.y = jumpHeight*.75;
                hurt(collider);   
            }
            break;
    }
    updateHPHUD();
}

function attackHit (atkHitbox, other)
{
    console.log('hit '+other.key)
    if (!other.hurt && (other.key == 'enemy' || other.key == 'enemy2'))
    {
        other.hp -= 1;
        other.hurt = true;
        other.tint = 0xff0000;
        other.body.velocity.x = 200 * Math.sign(other.body.x - player.body.x);
        other.body.velocity.y = jumpHeight*.2;
        hurt(other);
        if (other.hp < 1)
        {
            enemyDeathSFX.play();
            other.kill();

            if (other.key == 'enemy2')
            {
                shootingTimer.destroy();
            }

            spawnCoins(other);
        }
        else
        {
            enemyHurtSFX.play();
        }
    }
    if (other.key == 'vase')
    {
        breakSFX.play();
        
        spawnCoins(other);
        
        brokeVase.x = other.body.x + 16;
        brokeVase.y = other.body.y + 16;
        brokeVase.start(true, 2000, null, 4);
        other.destroy();
    }
}