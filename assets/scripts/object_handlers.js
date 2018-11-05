function spawnObjects(map)
{
    // SPIKES
    
    spikes = game.add.group();
    spikes.enableBody = true;

    map.createFromObjects('sprites', 84, 'spikes', 0, true, false, spikes);
    spikes.setAll('body.immovable', true);
    
    // LASERS

    lasers = game.add.group();
    lasers.enableBody = true;

    map.createFromObjects('sprites', 86, 'laser', 0, true, false, lasers);
    
    lasers.forEachAlive(setLaserProperties);

    // COINS

    coins = game.add.group();
    coins.enableBody = true;
    coins.physicsBodyType = Phaser.Physics.ARCADE;

    // VASES

    vases = game.add.group();
    vases.enableBody = true;
    vases.physicsBodyType = Phaser.Physics.ARCADE;

    map.createFromObjects('sprites', 45, 'vase', 0, true, false, vases);

    vases.forEach(setVaseProperties);
    
    // VASE PARTICLES
    brokeVase = game.add.emitter(0, 0, 100);
    brokeVase.makeParticles('vase-shard', 0, 16, true);
    brokeVase.gravity = 600;
    brokeVase.particleDrag.x = 100;
    brokeVase.angularDrag = 300;

    // SAVES

    saves = game.add.group();
    saves.enableBody = true;

    map.createFromObjects('sprites', 10, 'toilet', 0, true, false, saves);

    saves.forEachAlive(setSaveProperties);

    // VENDING

    shopObjects = game.add.group();
    shopObjects.enableBody = true;

    map.createFromObjects('sprites', 11, 'vending', 0, true, false, shopObjects);

    shopObjects.forEachAlive(setShopProperties);
    
    // UPGRADES
    
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
    
    // EVENTS
    
    eventObjects = game.add.group();
    eventObjects.enableBody = true;

    map.createFromObjects('sprites', 107, null, 0, true, false, eventObjects);

    eventObjects.forEach(setEventProperties);
    
}

function setVaseProperties(vase)
{
    vase.anchor.x = 0.5;
    vase.anchor.y = 0.5;
    vase.x += vase.width/2;
    vase.y += vase.height/2;
}

function setShopProperties(vendor)
{
    vendor.anchor.x = 0.5;
    vendor.anchor.y = 0;
    shopText = game.add.text(vendor.x, vendor.y - 80, "Shop ↓", { font: '24px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 4 });
    shopText.anchor.x = .5;
    shopText.alpha = 0;
    game.add.tween(shopText).to({x: vendor.x, y: vendor.y - 64}, 500, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
}

function setSaveProperties (toilet)
{
    toilet.x -= 68;
    toilet.body.setSize(128,64,0,64);
    toilet.body.immovable = true;

    restroomText = game.add.text(toilet.x, toilet.y - 80, "Take a Rest ↓", { font: '24px Cartwheel', fill: '#fff', stroke: 'black', strokeThickness: 4 });
    restroomText.anchor.x = .5;
    restroomText.x += toilet.width/2;
    //restroomText.alpha = 0;
    restroomTextTween = game.add.tween(restroomText).to({x: restroomText.x, y: toilet.y - 64}, 500, Phaser.Easing.Quadratic.InOut, true, 0, -1, true);
}

function setEventProperties (event) 
{
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
}