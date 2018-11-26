var enemyObjects = [];
var enemyGroups = [];

var bullets;

var shootingTimer;

function initEnemies () {
    
    enemyObjects = [
    {
        key: 'enemy',
        tile: 87,
        hp: 2,
        animations: [{
            key: 'walk',
            frames: [1, 2, 3, 4],
            speed: 10,
            loop: true
        }],
        defaultAnim: 'walk',
        create: function () {
            this.body.setSize(this.width - 32, this.height, 16);
        },
        update: function () {
            if (!this.hurt)
            {
                this.body.velocity.x = 300*this.facing;
                this.scale.setTo(this.facing, 1);
            }
        }
    },
    {
        key: 'enemy2',
        tile: 90,
        hp: 2,
        animations: [],
        defaultAnim: '',
        create: function () {
            this.body.setSize(this.width - 96, this.height, 32);
            
            shootingTimer = game.time.create(false);
            shootingTimer.loop(1500, function () {
                console.log('shooting');
                fireBullet({x: this.x + 30*this.facing, y: this.y-125}, this.facing);
            }, this);
            shootingTimer.start();
            shootingTimer.pause();
        },
        update: function () {
            if (inCamera(this))
            {
                this.facing = Math.sign(player.x - this.x);
                this.scale.setTo(this.facing, 1);
                if (shootingTimer.paused)
                {
                    shootingTimer.resume();
                }
            }
            else if (!shootingTimer.paused)
            {
                shootingTimer.pause();
            }
        }
    }];
}

function spawnEnemies (map)
{
    bullets = game.add.group();
    bullets.enableBody = true;

    enemyObjects.forEach(function (enemyObj, ind) {
        var enemGroup = game.add.group();
        enemGroup.enableBody = true;
        enemGroup.physicsBodyType = Phaser.Physics.ARCADE;
        
        map.createFromObjects('sprites', enemyObj.tile, enemyObj.key, 0, true, false, enemGroup);
        
        enemGroup.setAll('body.gravity.y', gravity);
        enemGroup.setAll('body.drag.x', 500);
        enemGroup.setAll('body.immovable', true);
        enemGroup.setAll('anchor.y', 1);
        enemGroup.setAll('anchor.x', .5);
        
        enemGroup.forEach(function (enemy) {
            enemy.y += enemy.height;
            
            if (enemyObj.animations) {
                enemyObj.animations.forEach(function (anim) {
                    enemy.animations.add(anim.key, anim.frames, anim.speed, anim.loop);
                });
                
                enemy.animations.play(enemyObj.defaultAnim);
            }

            enemy.hp = enemyObj.hp;
            enemy.facing = 1;
            
            var create = enemyObj.create.bind(enemy);
            
            create();
            
            enemy.update = enemyObj.update.bind(enemy);

            var walkTimer = game.time.create(false);
            walkTimer.loop(1000, switchDir, this, enemy);
            walkTimer.start();
        }, this);
        
        enemyGroups.push(enemGroup);
    });

}

function fireBullet(spawnLoc, facing)
{
    var bullet = bullets.create(spawnLoc.x, spawnLoc.y, 'bullet');
    bullet.body.immovable = true;
    bullet.body.velocity.x = 500*facing;
    bullet.body.drag.x = 0;
    bullet.scale.setTo(facing, 1);
    
    shotSFX.play();
    
    console.log(bullet);
    
    bullet.update = function () {
        if (!inCamera(bullet))
        {
            bullet.destroy();
        }
    };
}