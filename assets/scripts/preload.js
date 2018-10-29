var loadedMaps = [];
var preload = {

    preload: function ()
    {
        game.load.bitmapFont('pearsoda', 'assets/fonts/pearsoda_0.png', 'assets/fonts/pearsoda.fnt');
        game.load.bitmapFont('cartwheel', 'assets/fonts/cartwheel.png', 'assets/fonts/cartwheel.fnt');
        
        game.load.spritesheet('fox', 'assets/spritesheets/fox_animations_200x140.png', 200, 140);
        game.load.image('djPowerup', 'assets/sprites/doubleJump.png');
        game.load.image('invisPowerup', 'assets/sprites/invisibility.png');
        
        game.load.image('tiles', 'assets/tilemaps/tileset_library.png');
        game.load.image('tileBG', 'assets/sprites/tileBG.png');
        
        game.load.spritesheet('enemy', 'assets/spritesheets/final_sheets/guard_100x150.png', 100, 200);
        game.load.image('coin', 'assets/sprites/coin.png');
        game.load.image('vase', 'assets/tilemaps/tiles/vase.png');
        game.load.image('laser', 'assets/tilemaps/tiles/laserTop.png');
        game.load.image('spikes', 'assets/sprites/spikes.png');
        game.load.image('toilet', 'assets/sprites/toilet.png');
        
        game.load.image('vase-shard', 'assets/sprites/vaseshard.png');
        game.load.image('laserpart', 'assets/sprites/laserparticle.png');
        
        // SOUND
        // https://opengameart.org/content/interface-sounds-starter-pack
        // https://opengameart.org/content/different-steps-on-wood-stone-leaves-gravel-and-mud
        // https://opengameart.org/content/fantasy-sound-effects-library
        // https://opengameart.org/content/footsteps-leather-cloth-armor
        
        game.load.audio('jumpsfx', 'assets/sound/jump.wav');
        game.load.audio('lettersfx', 'assets/sound/sfx/letter.ogg');
        game.load.audio('coinsfx', 'assets/sound/sfx/coin.wav');
        game.load.audio('breaksfx', 'assets/sound/sfx/break.wav');
        
        for (var i = 5; i <= 15; i++)
        {
            for (var j = 5; j <= 15; j++)
            {
                try {
                    game.load.tilemap(i+'x'+j, 'assets/tilemaps/'+i+'x'+j+'.json', null, Phaser.Tilemap.TILED_JSON);
                }
                catch (err) {
                    console.log('No map for '+i+'x'+j);
                }
            }
        }
        
        game.time.advancedTiming = true;
        
    },

    create: function ()
    {
        game.state.start('9x10');
    }
};