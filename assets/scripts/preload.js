var preload = {

    preload: function ()
    {
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
        
        game.load.tilemap('9x10', 'assets/tilemaps/9x10.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('10x10', 'assets/tilemaps/10x10.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('11x10', 'assets/tilemaps/11x10.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('12x10', 'assets/tilemaps/12x10.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('10x9', 'assets/tilemaps/10x9.json', null, Phaser.Tilemap.TILED_JSON);
    },

    create: function ()
    {
        game.state.start('9x10');
    }
};