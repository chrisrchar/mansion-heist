// GAME GLOBALS
//====================================
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
// GAME OBJECTS
var platforms, jumpthruPlatforms, coins, enemies, vases, spikes, saves, eventObjects;

var brokeVase, restroomText, restroomTextTween;

var coinsfx, breakSFX;

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
        game.physics.arcade.TILE_BIAS = 32;

        var map = game.add.tilemap(gridX+'x'+gridY);
        map.addTilesetImage('tileset', 'tiles');
        
        var exits1 = game.add.group();
        var exits2 = game.add.group();
        var entrances = game.add.group();
        
        map.createFromObjects('transitions', 87, null, 0, false, false, exits1);
        map.createFromObjects('transitions', 88, null, 0, false, false, exits2);
        map.createFromObjects('transitions', 89, null, 0, false, false, entrances);
        
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
            
            restroomText = game.add.text(toilet.x, toilet.y - 80, "Take a Rest ↓", { fontSize: '24px', fill: '#fff', stroke: 'black', strokeThickness: 4 });
            restroomText.anchor.x = .5;
            restroomText.x += toilet.width/2;
            //restroomText.alpha = 0;
            restroomTextTween = game.add.tween(restroomText).to({x: restroomText.x, y: toilet.y - 64}, 500, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
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
            
            obj.hp = 2;
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
        
        var backgroundBack = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'tileBG');
        game.world.sendToBack(backgroundBack);

        createPlayer(roomSpawn);
        
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
        
        eventObjects = game.add.group();
        eventObjects.enableBody = true;
        
        map.createFromObjects('sprites', 107, null, 0, true, false, eventObjects);
        
        eventObjects.forEach(function (event) {
            if (event.autoStart)
            {
                var eventTimer = game.time.create(true);
                eventTimer.add(event.delay, function () {
                    if (!eventsDone[event.eventNum])
                    {
                        callMsg(events[event.eventNum]);
                        eventsDone[event.eventNum] = true;
                    }
                    event.destroy();
                }, this);
                eventTimer.start();
            }
            else {
                event.anchor.setTo(0.5,0.5);
                event.body.setSize(event.bodyWidth, event.bodyHeight, 0, 0);
            }
        });
        
        brokeVase = game.add.emitter(0, 0, 100);
        brokeVase.makeParticles('vase-shard', 0, 16, true);
        brokeVase.gravity = 600;
        
        addAudio();
    }
    
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
        game.physics.arcade.overlap(player, eventObjects, function (plyr, event) {
            if (!eventsDone[event.eventNum])
            {
                callMsg(events[event.eventNum]);
                eventsDone[event.eventNum] = true;
            }
            event.destroy();
        });
        
        game.physics.arcade.collide(enemies, platforms);
        game.physics.arcade.collide(coins, platforms);
        game.physics.arcade.collide(brokeVase, platforms);
        game.physics.arcade.collide(enemies, jumpthruPlatforms);
        game.physics.arcade.collide(coins, jumpthruPlatforms);
        
        if (playerGlobals.hp < 1)
        {
            loadGame();
        }

        tempMap.exits.forEach(checkExits);
    }
    
    // Hitbox Debugging
    tempMap.render = function () {
        
        //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
        
        /*eventObjects.forEachAlive(function (obj)
        {
            game.debug.body(obj);
        });
        
        game.debug.body(player);  */
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
    switch(exit.side) {
        case "right":
            if (player.body.x > exit.bound1.x && player.body.y > exit.bound1.y && player.body.y < exit.bound2.y)
            {
                goToMap(exit.toMap);
            }
            break;
        case "left":
            if (player.body.x < exit.bound1.x && player.body.y > exit.bound1.y && player.body.y < exit.bound2.y)
            {
                goToMap(exit.toMap);
            }
            break;
        case "up":
            if (player.body.y < exit.bound1.y && player.body.x > exit.bound1.x && player.body.x < exit.bound2.x)
            {
                goToMap(exit.toMap);
            }
            break;
        case "down":
            if (player.body.y > exit.bound1.y && player.body.x > exit.bound1.x && player.body.x < exit.bound2.x)
            {
                goToMap(exit.toMap);
            }
            break;
    }
}

// Transition to a given map with given parameters
function goToMap (mapName)
{
    playerGlobals.lastMap = game.state.current;
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
    
    coinsfx.play('',0,.7);
    
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

function loadGame ()
{
    playerGlobals = JSON.parse(localStorage.savegame);
    mapVisited = playerGlobals.lastSave.mapdata;
    eventsDone = playerGlobals.lastSave.eventsDone;
    game.state.start(playerGlobals.lastSave.state);
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

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};