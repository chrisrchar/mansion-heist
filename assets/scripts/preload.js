var preload = {

    preload: function ()
    {
        game.load.spritesheet('fox', 'assets/spritesheets/fox_animations_200x140.png', 200, 140);
        game.load.image('powerup', 'assets/sprites/powerup.png');
        game.load.image('tiles', 'assets/tilemaps/tiles/walls.png');
        game.load.image('spikes', 'assets/sprites/spikes.png');
        game.load.audio('jumpsfx', 'assets/sound/jump.wav');
        game.load.image('wall', 'assets/tilemaps/testtile.png');
        game.load.image('wall', 'assets/tilemaps/tiles/testtile.png');
        game.load.image('pedestal', 'assets/tilemaps/tiles/pedestal.png');
        game.load.image('shelf', 'assets/tilemaps/tiles/shelf.png');
        game.load.image('window', 'assets/tilemaps/tiles/window_dark.png');
        
        game.load.spritesheet('enemy', 'assets/spritesheets/final_sheets/guard_100x150.png', 100, 200);
        game.load.image('coin', 'assets/sprites/coin.png');
        game.load.image('vase', 'assets/tilemaps/tiles/vase.png');
        
        game.load.tilemap('map0', 'assets/tilemaps/map0.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('map1', 'assets/tilemaps/map1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('map2', 'assets/tilemaps/map2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('10x10', 'assets/tilemaps/10x10.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('11x10', 'assets/tilemaps/11x10.json', null, Phaser.Tilemap.TILED_JSON);
    },

    create: function ()
    {
        game.state.start('10x10');
    }
};