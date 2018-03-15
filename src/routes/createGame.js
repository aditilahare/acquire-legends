const Game = require('../models/game.js');
const addPlayer = require('./joinGame').addPlayer;
const isValidNumberOfPlayers = require('../utils/utilities').isNumberBetween;

const createGame = function(req, res, next) {
  let body = req.body;
  let gameManager = req.app.gameManager;
  let gameId = gameManager.getAvailableIdForGame();
  req.body.gameId = gameId;
  let numberOfPlayers = body.numberOfPlayers;
  if(!isValidNumberOfPlayers(numberOfPlayers)){
    res.send(422);
    return;
  }
  let game = new Game(numberOfPlayers);
  req.app.game = game;
  addPlayer(req,res);
  gameManager.addGame(game,body.playerName);
  return;
};


module.exports = createGame;
