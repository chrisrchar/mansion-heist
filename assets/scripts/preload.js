var preload = {

    preload: function ()
    {
        game.load.spritesheet('dude', 'assets/spritesheets/fox_walk_80x124.png', 80, 124);
        game.load.image('tiles', 'assets/tilemaps/simples_pimples.png');
        game.load.image('coin', 'assets/sprites/coin.png');
        game.load.audio('jumpsfx', 'assets/sound/jump.wav');
        
        game.load.tilemap('map0', 'assets/tilemaps/map0.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap('map1', 'assets/tilemaps/map1.json', null, Phaser.Tilemap.TILED_JSON);
    },

    create: function ()
    {
        game.state.start('state0');
    }
};