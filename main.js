/*global
    Phaser
*/

// start new phaser game
var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', state0);

var score = 0;

game.state.add('state0', state0);
game.state.add('state1', state1);