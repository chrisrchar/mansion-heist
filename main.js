/*global
    Phaser
*/

addMap('10x10', '10x10', [{
    map: '11x10',
    direction: 'right',
    point: 1280,
    bound1: 328,
    bound2: 516,
    spawn: {x: 32, y: -1}
}],5,5);

addMap('11x10', '11x10', [{
    map: '10x10',
    direction: 'left',
    point: 0,
    bound1: 328,
    bound2: 516,
    spawn: {x: 1264, y: -1}
}],6,5);

// start new phaser game
var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', preload);

var score = 0;

maps.forEach(function (mapElement) {
    console.log(mapElement.mapName);
    game.state.add(mapElement.mapName, mapElement);
});

//game.state.add('state0', state0);
//game.state.add('state1', state1);