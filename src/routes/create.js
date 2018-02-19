const Game = require('../models/game.js');
const addPlayer = require('./join').addPlayer;

const createGame = function(req, res, next) {
  let body = req.body;
  let numberOfPlayers = body.numberOfPlayers;
  if(!req.app.game && isNumberBetween(numberOfPlayers,3,6)){
    let game = new Game(numberOfPlayers);
    req.app.game = game;
    addPlayer(req,res,next);
    return;
  }
  res.send('Number of players should be between 3 and 6 / another \
game is currently running');
};

const isNumberBetween = function (number,min,max) {
  return number >= min && number <= max;
};
module.exports = createGame;
