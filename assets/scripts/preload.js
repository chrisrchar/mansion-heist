var loadedMaps = [];
var preload = {

    preload: function ()
    {
        game.load.bitmapFont('pearsoda', 'assets/fonts/pearsoda_0.png', 'assets/fonts/pearsoda.fnt');
        
        game.load.spritesheet('fox', 'assets/spritesheets/fox_animations_200x140.png', 200, 140);
        game.load.image('djPowerup', 'assets/sprites/doubleJump.png');
        game.load.image('invisPowerup', 'assets/sprites/invisibility.png');
        game.load.audio('jumpsfx', 'assets/sound/jump.wav');
        game.load.image('tiles', 'assets/tilemaps/tileset_library.png');
        
        game.load.spritesheet('enemy', 'assets/spritesheets/final_sheets/guard_100x150.png', 100, 200);
        game.load.image('coin', 'assets/sprites/coin.png');
        game.load.image('vase', 'assets/tilemaps/tiles/vase.png');
        game.load.image('laser', 'assets/tilemaps/tiles/laserTop.png');
        game.load.image('spikes', 'assets/sprites/spikes.png');
        game.load.image('toilet', 'assets/sprites/toilet.png');
        
        game.load.image('vase-shard', 'assets/sprites/vaseshard.png');
        
        for (var i = 5; i <= 15; i++)
        {
            for (var j = 5; j <= 15; j++)
            {
                try {
                    game.load.tilemap(i+'x'+j, 'assets/tilemaps/'+i+'x'+j+'.json', null, Phaser.Tilemap.TILED_JSON);
                    loadedMaps.push(i+'x'+j);
                }
                catch (err) {
                    console.log('No map for '+i+'x'+j);
                }
            }
        }
        
    },

    create: function ()
    {
        game.state.start('11x9');
    }
};