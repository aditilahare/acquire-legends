let Game = require('../../src/models/game.js');
let TileBox = require('../../src/models/tileBox.js');
const Player = require('../../src/models/player.js');
const Bot = require('../../src/models/bot.js');
const mockRandomTiles = require('./mockRandomTiles.js').getTiles;

let tileBox = new TileBox(12,9);
let game = new Game(6,tileBox);
let player1 = new Bot(0, 'bot1');
let player2 = new Bot(1, 'bot2');
let player3 = new Bot(2, 'bot3');
let player4 = new Bot(3, 'bot4');
let player5 = new Bot(4,"pragya");
let player6 = new Bot(5,"veera");

game.addPlayer(player1);
game.addPlayer(player2);
game.addPlayer(player3);
game.addPlayer(player4);
game.addPlayer(player5);
game.addPlayer(player6);

module.exports=game;
