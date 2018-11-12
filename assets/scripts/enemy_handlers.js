var enemyObjects = [];
var enemyGroups = [];

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
        update: function () {
            if (!this.hurt)
            {
                this.body.velocity.x = 300*this.facing;
                this.scale.setTo(this.facing, 1);
            }
        }
    }];
}

function spawnEnemies (map)
{

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
            
            enemyObj.animations.forEach(function (anim) {
                enemy.animations.add(anim.key, anim.frames, anim.speed, anim.loop);
            });
            
            enemy.animations.play(enemyObj.defaultAnim);

            enemy.hp = enemyObj.hp;
            enemy.facing = 1;
            enemy.update = enemyObj.update.bind(enemy);

            var walkTimer = game.time.create(false);
            walkTimer.loop(1000, switchDir, this, enemy);
            walkTimer.start();
        }, this);
        
        enemyGroups.push(enemGroup);
    });

}