let Game = require('../../src/models/game.js');
let TileBox = require('../../src/models/tileBox.js');
const Player = require('../../src/models/player.js');
const mockRandomTiles = require('./mockRandomTiles.js').getTiles;

let tileBox = new TileBox(3,9,mockRandomTiles);
let game = new Game(3,tileBox);
let player1 = new Player(0, 'pragya');
let player2 = new Player(1, 'aditi');
let player3 = new Player(2, 'praveen');
game.addPlayer(player1);
game.addPlayer(player2);
game.addPlayer(player3);
game.start();

module.exports=game;
