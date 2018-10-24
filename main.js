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
}
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
    map: '10x9',
    direction: 'up',
    point: -100,
    bound1: 578,
    bound2: 740,
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

addMap('10x9', '10x9', [{
    map: '10x10',
    direction: 'down',
    point: 1280,
    bound1: 578,
    bound2: 740,
    spawn: {x: -1, y: 16}
},
{
    map: '10x8',
    direction: 'up',
    point: -64,
    bound1: 578,
    bound2: 740,
    spawn: {x: 1036, y: 700}
},
{
    map: '11x9',
    direction: 'right',
    point: 1280,
    bound1: 522,
    bound2: 676,
    spawn: {x: 32, y: 420}
}],10,9);

addMap('10x8', '10x8', [
{
    map: '10x9',
    direction: 'down',
    point: 710,
    bound1: 960,
    bound2: 1122,
    spawn: {x: 650, y: 16}
},
{
    map: '9x8',
    direction: 'left',
    point: 0,
    bound1: 330,
    bound2: 516,
    spawn: {x: 2020, y: -1}
}
],10,8);

addMap('9x8', '9x8', [
{
    map: '10x8',
    direction: 'right',
    point: 2080,
    bound1: 330,
    bound2: 516,
    spawn: {x: 32, y: -1}
}
],9,8);

addMap('11x9', '11x9', [
{
    map: '10x9',
    direction: 'left',
    point: 0,
    bound1: 328,
    bound2: 516,
    spawn: {x: 1250, y: 608}
}
],11,9);


// start new phaser game
var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', preload);

var score = 0;

maps.forEach(function (mapElement) {
    console.log(mapElement.mapName);
    game.state.add(mapElement.mapName, mapElement);
});

//game.state.add('state0', state0);
//game.state.add('state1', state1);