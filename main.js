/*global
    Phaser
*/

addMap('state0', 'map0', [{
    map: 'state1',
    direction: 'right',
    point: 1280,
    bound1: 320,
    bound2: 528,
    spawn: {x: 16, y: -1}
}]);

addMap('state1', 'map1', [{
    map: 'state0',
    direction: 'left',
    point: 0,
    bound1: 320,
    bound2: 528,
    spawn: {x: 1264, y: -1}
}]);

// start new phaser game
var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', preload);

var score = 0;

maps.forEach(function (mapElement) {
    console.log(mapElement.mapName);
    game.state.add(mapElement.mapName, mapElement);
});

//game.state.add('state0', state0);
//game.state.add('state1', state1);