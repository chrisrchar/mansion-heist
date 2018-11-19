// GAME GLOBALS
//====================================
// === Map Variables ===
var maps = [];
var mapVisited = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
var mapSize = 20;

for (var i = 0; i < mapSize; i++)
{
    for (var j = 0; j < mapSize; j++)
    {
        mapVisited[i][j] = null;
    }
}

// PHYSICS VARIABLES
var speed = 350;
var gravity = 1200;
var jumpHeight = -700;
var player;

var textPlacement;

// ===== GAME OBJECTS =====

// === Map Objects ===
var platforms, jumpthruPlatforms

// === Interactables ===
var coins, enemies, vases, spikes, saves, shopObjects, eventObjects;

// === World Text ===
var shopText, restroomText, restroomTextTween;

// === Particles & Tweens ===
var brokeVase, fadeToBlack, transitionFade;

// === Sounds ===
var coinsfx, breakSFX;

var bgMusic;

// === Inputs ===
var pad1, jumpButton, leftButton, rightButton, atkButton, ablButton;
var inputs = [];

//====================================

// Map creation
function addMap (gridX, gridY)
{
    // Create empty state object to add to
    var tempMap = {}
    
    tempMap.mapName = gridX+'x'+gridY;
    tempMap.exits = [];
    
    tempMap.create = function () {
        
        // Make sure the input doesn't reset when changing rooms
        game.input.resetLocked = true;
        
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.TILE_BIAS = 33;

        var map = game.add.tilemap(gridX+'x'+gridY);
        map.addTilesetImage('tileset', 'tiles');
        
        var exits1 = this.add.group();
        var exits2 = this.add.group();
        var entrances = this.add.group();
        
        map.createFromObjects('transitions', 167, null, 0, false, false, exits1);
        map.createFromObjects('transitions', 168, null, 0, false, false, exits2);
        map.createFromObjects('transitions', 169, null, 0, false, false, entrances);
        
        exits1.forEach(function (exit) {
            var exit2 = exits2.children.find(function (element)
            {
                return element.toMap == exit.toMap;
            });
            
            tempMap.exits.push(
                {
                    side: exit.side,
                    bound1: {x: exit.x, y: exit.y},
                    bound2: {x: exit2.x, y: exit2.y},
                    toMap: exit.toMap
                }
            );
        });
        
        if (!mapVisited[gridY][gridX])
        {
            console.log(gridY+" "+gridX);
            mapVisited[gridY][gridX] = {
                exits: []
            };
            
            tempMap.exits.forEach(function (exit) {
                mapVisited[gridY][gridX].exits.push(exit.side);
            });
        }
        
        var roomSpawn;
        
        entrances.forEach(function (entrance) {
           if (entrance.fromMap == playerGlobals.lastMap)
            {
                roomSpawn = {x: entrance.x, y: entrance.y};
            }
        });
        
        if (!roomSpawn)
        {
            roomSpawn = {x: 300, y: 300};
        }
        
        var background2 = map.createLayer('background2');
        
        platforms = map.createLayer('platforms');
        jumpthruPlatforms = map.createLayer('jumpthru');

        spawnObjects(map);
        spawnEnemies(map);
        
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
        
        var backgroundBack = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'tileBG');
        game.world.sendToBack(backgroundBack);

        createPlayer(roomSpawn);
        
        // MINI MAP

        drawMiniMap(gridX, gridY);
        
        // HUD
        
        drawHUD();
        
        // CAMERA

        game.camera.focusOn(player);
        game.camera.follow(player);
        game.camera.lerp.x = .1;
        
        // Fade in/out room
        fadeToBlack = game.add.graphics(0,0);
        fadeToBlack.fixedToCamera = true;
        fadeToBlack.beginFill(0x000000, 1);
        fadeToBlack.drawRect(0,0,game.camera.width,game.camera.height);
        fadeToBlack.endFill();
        
        this.add.tween(fadeToBlack).to({alpha: 0}, 500, Phaser.Easing.Quadratic.In, true);
        
        transitionFade = this.add.tween(fadeToBlack).to({alpha: 1}, 500, Phaser.Easing.Quadratic.Out, false);
    };
    
    tempMap.update = function () {
        
        if (saves.children[0])
        {
            if (Math.abs(game.physics.arcade.distanceBetween(saves.children[0], player)) < 100)
            {
                restroomText.alpha = 1;
                game.world.bringToTop(restroomText);
            }
            else if (Math.abs(game.physics.arcade.distanceBetween(saves.children[0], player)) > 400)
            {
                restroomText.alpha = 0;
            }
            else
            {
                restroomText.alpha = (1/(Math.abs(game.physics.arcade.distanceBetween(saves.children[0], player))/100)).clamp(0,1);
            }
        }
        
        game.world.bringToTop(minimap);
        game.world.bringToTop(hud);
    
        game.physics.arcade.overlap(player, coins, collectCoins, null, this);
        game.physics.arcade.overlap(player, powerup, powerUp, null, this);
        
        if (game.physics.arcade.overlap(player, shopObjects) && !shopOpen)
        {
            if (shopText.alpha == 0)
            {
                game.add.tween(shopText).to({alpha: 1},500, Phaser.Easing.Linear.None, true);
            }
        }
        else if (!game.physics.arcade.overlap(player, shopObjects))
        {
            if (shopText && shopText.alpha == 1)
            {
                game.add.tween(shopText).to({alpha: 0},500, Phaser.Easing.Linear.None, true);
            }
        }
        
        if (eventObjects.children[0])
        {
            game.physics.arcade.overlap(player, eventObjects, function (plyr, event) {
                if (!eventsDone[event.eventNum])
                {
                    callMsg(events[event.eventNum]);
                    eventsDone[event.eventNum] = true;
                }
                event.destroy();
            });
        }
        
        
        enemyGroups.forEach(function (enemGroup) {
            game.physics.arcade.collide(enemGroup, platforms);
            game.physics.arcade.collide(enemGroup, jumpthruPlatforms);
        });
        
        game.physics.arcade.collide(coins, platforms);
        game.physics.arcade.collide(brokeVase, platforms);
        game.physics.arcade.collide(coins, jumpthruPlatforms);
        
        if (playerGlobals.hp < 1)
        {
            playerDeath();
        }

        if (!transitionFade.isRunning)
        {
            tempMap.exits.forEach(checkExits);
        }
        else 
        {
            player.body.gravity = 0;
        }
    };
    
    // Hitbox Debugging
    tempMap.render = function () {
        
        //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
        
        /*bullets.forEachAlive(function (obj)
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
    };
    
    // Push the state object to the array of maps
    maps.push(tempMap);
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
    coinsfx.play('',0,.7);
    
    playerGlobals.money += coin.coinValue;
    coin.kill();
    moneyHUD.text = '$: '+playerGlobals.money;
}

function spawnCoins(other)
{
    if (Math.floor(Math.random()*3) == 0)
    {
        var coinTypeChance = Math.floor(Math.random()*6);

        if (coinTypeChance < 3)
        {
            var spoils = coins.create(other.body.x, other.body.y, 'coin');
            spoils.coinValue = 5;
        }
        else if (coinTypeChance < 5)
        {
            var spoils = coins.create(other.body.x, other.body.y, 'silvercoin');
            spoils.coinValue = 10;
        }
        else
        {
            var spoils = coins.create(other.body.x, other.body.y, 'goldcoin');
            spoils.coinValue = 25;
        }
        spoils.body.gravity.y = gravity;
        spoils.body.drag.x = 500;
        spoils.body.velocity.x = 150 * Math.sign(other.body.x - player.body.x);
    }
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
    puAnim.onComplete.add(function () {
        if (events[puEvents[power.ability]])
        {
            callMsg(events[puEvents[power.ability]]);
        }
    }, this);
    
    puAnim.play();
    
    power.kill();
}

function addAudio()
{
    coinsfx = game.add.audio('coinsfx');
    breakSFX = game.add.audio('breaksfx');
    
    letterSFX = game.add.audio('lettersfx');
    letterSFX.addMarker('char', 0, .05, .8);
    letterSFX.override = true;
    letterSFX.loop = false;
    letterSFX.volume = .8;
    nextMsgSFX = game.add.audio('lettersfx');
}

//SAVE AND LOAD
function saveGame ()
{
    playerGlobals.lastSave = {
        state: game.state.current,
        mapdata: mapVisited,
        eventsDone: eventsDone
    };
    playerGlobals.lastX = player.x;
    playerGlobals.lastY = player.y;
    localStorage.setItem("savegame", JSON.stringify(playerGlobals));
    restroomText.text = "Game Saved";
    restroomTextTween.pause();
    var saveTween = game.add.tween(restroomText).to({x: restroomText.x ,y: saves.children[0].y-96},2000, Phaser.Easing.Linear.None, true);
    game.add.tween(restroomText).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
    
    saveTween.onComplete.add(function () {
        restroomText.text = "Take a Rest ↓";
        restroomTextTween.resume();
    });
    
    console.log('game saved');
}

function checkSavedGame()
{
    return JSON.parse(localStorage.savegame);
}

function loadGame ()
{
    removeInputCallbacks();
    
    addGameControls();
    
    bgMusic = game.add.audio('bgmusic');
    bgMusic.loop = true;
    bgMusic.play();
    
    addAudio();
    
    playerGlobals = JSON.parse(localStorage.savegame);
    mapVisited = playerGlobals.lastSave.mapdata;
    eventsDone = playerGlobals.lastSave.eventsDone;
    
    var mapObj = maps.find(obj => {
      return obj.mapName === playerGlobals.lastSave.state;
    });
    game.state.add(playerGlobals.lastSave.state, mapObj);
    
    game.state.start(playerGlobals.lastSave.state);
}

// RESET GAME
function resetGame ()
{
    game.input.reset(true);
    removeInputCallbacks();
    
    for (var i=0; i<events.length; i++)
    {
        eventsDone[i] = false;
    }
    
    addGameControls();
    
    // Play Music
    bgMusic = game.add.audio('bgmusic');
    bgMusic.loop = true;
    bgMusic.play();
    
    addAudio();
    
    playerGlobals = {
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
        powerUps: [false, false], // 0 - Double Jump 1 - Invisibility
        lastMap: null,
        lastSave: null
    };
    
    game.state.start('9x10');
}

function playerDeath ()
{
    game.input.reset(true);
    removeInputCallbacks();
    
    game.sound.stopAll();
    game.state.start('gameoverState');
}

function addGameControls() 
{
    //================
    // PLAYER CONTROLS
    
    // Gamepad integration
    game.input.gamepad.start();
    pad1 = game.input.gamepad.pad1;
    
    leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    downButton = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    upButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    atkButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
    ablButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
    saveTestBtn = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
    loadTestBtn = game.input.keyboard.addKey(Phaser.Keyboard.FIVE);
    testBtn6 = game.input.keyboard.addKey(Phaser.Keyboard.SIX);
    
    // ADDING CONTROL CALLBACKS
    jumpButton.onDown.add(confirmPressed);
    atkButton.onDown.add(attack);
    ablButton.onDown.add(abilityDown);
    ablButton.onUp.add(abilityUp);
    saveTestBtn.onDown.add(saveGame);
    loadTestBtn.onDown.add(loadGame);
    
    leftButton.onDown.add(leftPressed);
    rightButton.onDown.add(rightPressed);
    upButton.onDown.add(upPressed);
    downButton.onDown.add(downPressed);
    
    jumpButton.onDown.add(jump);
    
    inputs.push(leftButton);
    inputs.push(rightButton);
    inputs.push(downButton);
    inputs.push(upButton);
    inputs.push(jumpButton);
    inputs.push(atkButton);
    inputs.push(ablButton);
}

function removeInputCallbacks ()
{
    inputs.forEach(function (button) {
        button.onDown.removeAll();
        button.onUp.removeAll();
    });
    
    inputs = [];
}

function inCamera (sprite) {
    return game.world.camera.view.intersectsRaw(sprite.left, sprite.right, sprite.top, sprite.bottom);
}

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};