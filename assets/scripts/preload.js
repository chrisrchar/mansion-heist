var preload = {

    preload: function ()
    {
        game.load.spritesheet('fox', 'assets/spritesheets/fox_animations_110x140.png', 110, 140);
        game.load.image('tiles', 'assets/tilemaps/simples_pimples.png');
        game.load.image('spikes', 'assets/sprites/spikes.png');
        game.load.audio('jumpsfx', 'assets/sound/jump.wav');
        game.load.image('wall', 'assets/tilemaps/testtile.png');
        
        game.load.image('enemy', 'assets/sprites/guarddog.png');
        game.load.image('coin', 'assets/sprites/coin.png');
        game.load.image('vase', 'assets/sprites/vase.png');
        
        game.load.tilemap('map0', 'assets/tilemaps/map0.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('map1', 'assets/tilemaps/map1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('map2', 'assets/tilemaps/map2.json', null, Phaser.Tilemap.TILED_JSON);
    },

    create: function ()
    {
        game.state.start('state2');
    }
};