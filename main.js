/*global
    Phaser
*/


for (var i = 5; i <= 15; i++)
{
    for (var j = 5; j <= 15; j++)
    {
        try {
            addMap(i, j)
        }
        catch (err) {
            console.log('No map for '+i+'x'+j);
        }
    }
}

// start new phaser game
var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', preload);

var score = 0;

maps.forEach(function (mapElement) {
    game.state.add(mapElement.mapName, mapElement);
});
