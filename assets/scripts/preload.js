var preload = {

    preload: function ()
    {
        game.load.spritesheet('boss_run', 'assets/spritesheets/fox_run_95x130.png', 95, 130);
        game.load.image('tiles', 'assets/tilemaps/simples_pimples.png');
        game.load.image('coin', 'assets/sprites/coin.png');
        game.load.audio('jumpsfx', 'assets/sound/jump.wav');
        
        game.load.tilemap('map0', 'assets/tilemaps/map0.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('map1', 'assets/tilemaps/map1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('map2', 'assets/tilemaps/map2.json', null, Phaser.Tilemap.TILED_JSON);
    },

    create: function ()
    {
        game.state.start('state0');
    }
};