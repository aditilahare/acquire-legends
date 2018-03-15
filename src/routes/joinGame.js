const Player = require('../models/player.js');

const joinGame = function(req,res){
  let gameManager = req.app.gameManager;
  let gameId = req.body.gameId;
  let game = gameId && gameManager.getGameById(gameId);
  if(game && game.isVacant()){
    addPlayer(req,res);
  }else{
    res.send("Maximum number of players joined");
  }
};

const addPlayer = function (req,res) {
  let playerName = req.body.playerName;
  let gameId = req.body.gameId;
  let game = req.app.game;//gameManager.getGameById(gameId);
  let playerId = game && game.getPlayerCount()+1;
  if(game && playerId){
    game.addPlayer(new Player(playerId,playerName));
  }
  res.cookie("playerId",playerId);
  res.cookie("gameId", gameId);
  res.redirect(302,'/wait');
};

module.exports={
  joinGame,addPlayer
};
