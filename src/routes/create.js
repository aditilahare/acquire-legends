const Game = require('../models/game.js');
const addPlayer = require('./join').addPlayer;

const createGame = function(req, res, next) {
  let body = req.body;
  let game = new Game(body.numberOfPlayers);
  req.app.game = game;
  addPlayer(req,res,next);
  return;
};
module.exports = createGame;
