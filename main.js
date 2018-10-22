/*global
    Phaser
*/

addMap('9x10', '9x10', [{
    map: '10x10',
    direction: 'right',
    point: 2080,
    bound1: 356,
    bound2: 516,
    spawn: {x: 32, y: -1}
},
],9,10);

addMap('10x10', '10x10', [{
    map: '11x10',
    direction: 'right',
    point: 1280,
    bound1: 356,
    bound2: 516,
    spawn: {x: 32, y: -1}
},
{
    map: '10x11',
    direction: 'up',
    point: -64,
    bound1: 578,
    bound2: 770,
    spawn: {x: -1, y: 1260}
},
{
    map: '9x10',
    direction: 'left',
    point: 0,
    bound1: 356,
    bound2: 516,
    spawn: {x: 2020, y: -1}
}
],10,10);

addMap('11x10', '11x10', [{
    map: '10x10',
    direction: 'left',
    point: 0,
    bound1: 328,
    bound2: 516,
    spawn: {x: 1264, y: -1}
},
{
    map: '12x10',
    direction: 'right',
    point: 2560,
    bound1: 328,
    bound2: 516,
    spawn: {x: 32, y: -1}
}],11,10);

addMap('12x10', '12x10', [{
    map: '11x10',
    direction: 'left',
    point: 0,
    bound1: 328,
    bound2: 516,
    spawn: {x: 2524, y: -1}
}],12,10);

addMap('10x11', '10x11', [{
    map: '10x10',
    direction: 'down',
    point: 1280,
    bound1: 578,
    bound2: 770,
    spawn: {x: -1, y: 64}
}],10,9);

// start new phaser game
var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', preload);

var score = 0;

maps.forEach(function (mapElement) {
    console.log(mapElement.mapName);
    game.state.add(mapElement.mapName, mapElement);
});

//game.state.add('state0', state0);
//game.state.add('state1', state1);