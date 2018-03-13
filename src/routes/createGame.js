const Game = require('../models/game.js');
const addPlayer = require('./joinGame').addPlayer;
const isValidNumberOfPlayers = require('../utils/utilities').isNumberBetween;

const createGame = function(req, res, next) {
  let body = req.body;
  let gameManager = req.app.gameManager;
  let gameId = gameManager.getAvailableIdForGame();
  req.body.gameId = gameId;
  let numberOfPlayers = body.numberOfPlayers;
  if(isValidNumberOfPlayers(numberOfPlayers)){
    let game = new Game(numberOfPlayers);
    gameManager.addGame(game,body.playerName);
    req.app.game = gameManager.getGameById(gameId);
    addPlayer(req,res,next);
    return;
  }
  res.send(422);
};


module.exports = createGame;
