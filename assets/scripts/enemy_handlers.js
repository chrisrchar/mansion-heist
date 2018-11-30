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
            this.anchor.y = 1;
            this.anchor.x = .5;
            this.body.setSize(this.width - 32, this.height, 16);
            
            var walkTimer = game.time.create(false);
            walkTimer.loop(1000, switchDir, this, this);
            walkTimer.start();
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
            this.anchor.y = 1;
            this.anchor.x = .5;
            
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
    },
    {
        key: '',
        tile: 51,
        hp: 10,
        animations: [],
        defaultAnim: '',
        create: function () {
            this.body.gravity.y = 0;
            this.body.enable = false;
            
            var base = game.add.sprite(0, 0, 'turretBase');
            
            base.anchor.x = 0.5;
            base.anchor.y = 0.5;
            
            base.rotation = Math.PI/2 * this.side * -1 - Math.PI/2;
            
            if (this.side == 2)
            {
                this.x += 32;
            }
            
            if (this.side == 3)
            {
                this.y -= 32;
            }
            
            var barrel = game.add.sprite(0, 0, 'turretBarrel');
            
            barrel.anchor.x = 0.5;
            barrel.anchor.y = 0.8;
            barrel.firing = false;
            if (this.side == 1 || this.side == 3)
            {
                barrel.y += Math.sign(Math.sin(base.rotation))*16
            }
            else
            {
                barrel.x += Math.sign(Math.cos(base.rotation))*16
            }
                
            var spawnPoint = game.add.sprite(0, 4, '');
            barrel.addChild(spawnPoint);
            
            this.addChild(barrel);
            this.addChild(base); 
            
            var shootTimer = game.time.create(false);
            console.log(this.firerate);
            shootTimer.loop(this.firerate, function () {
                console.log('timer');
                turretFire(this.children[0]);
            }, this);
            shootTimer.start();
            
            console.log('turret');
            
        },
        update: function () {
            barrel = this.children[0];
            
            if (!barrel.firing)
            {
                barrel.rotation = Phaser.Math.linearInterpolation([barrel.rotation, game.physics.arcade.angleBetween(this, player) + Math.PI/2], 0.3);
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

function turretFire(barrel)
{
    console.log('firing');
    var spawnPoint = barrel.children[0].world
    
    var recoil = {x: barrel.position.x + Math.cos(barrel.rotation + Math.PI/2) * 20, y: barrel.position.y + Math.sin(barrel.rotation + Math.PI/2) * 20};
    
    var fireTween = game.add.tween(barrel.position).to(recoil, 100, Phaser.Easing.Cubic.In, true, 0, 0, true);
    fireTween.onComplete.add(function () {
        barrel.firing = false;
    });
    
    barrel.firing = true;
    
    var shootDelay = game.time.create(true);
    shootDelay.add(100, function () {
        var bullet = bullets.create(spawnPoint.x, spawnPoint.y, 'bullet');
        bullet.anchor.y = 0.5;
        bullet.rotation = barrel.rotation - Math.PI/2;
        bullet.body.velocity = game.physics.arcade.velocityFromRotation(bullet.rotation, 1000);
        
        bullet.update = function () {
        if (!inCamera(bullet))
        {
            bullet.destroy();
        }
    };
    }, this);
    shootDelay.start();
    
}