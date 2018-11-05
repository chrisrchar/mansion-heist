function spawnEnemies (map)
{
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    map.createFromObjects('sprites', 87, 'enemy', 0, true, false, enemies);

    enemies.setAll('body.gravity.y', gravity);
    enemies.setAll('body.drag.x', 500);
    enemies.setAll('body.immovable', true);
    enemies.setAll('anchor.y', 1);
    enemies.setAll('anchor.x', .5);

    enemies.forEach(function (obj) {
        obj.y += obj.height;
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
}