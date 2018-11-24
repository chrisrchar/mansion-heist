/*global
    Phaser
*/

var startingMapName = '9x10';


for (var i = 5; i <= 20; i++)
{
    for (var j = 5; j <= 20; j++)
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

/*maps.forEach(function (mapElement) {
    game.state.add(mapElement.mapName, mapElement);
});*/

var startingMap = maps.find(obj => {
  return obj.mapName === startingMapName;
});
game.state.add(startingMapName, startingMap);

game.state.add('titlescreenState', titlescreenState);
game.state.add('gameoverState', gameoverState);
