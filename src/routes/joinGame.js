const Player = require('../models/player.js');

const joinGame = function(req,res,next){
  let game = req.app.game;
  if(game.isVacant()){
    addPlayer(req,res,next);
  }else{
    res.send("Maximum number of players joined");
  }
};


const addPlayer = function (req,res,next) {
  let playerName = req.body.playerName;
  let game = req.app.game;
  let playerId = game.getPlayerCount();
  game.addPlayer(new Player(playerId,playerName));
  res.cookie("playerId",playerId);
  res.redirect(302,'/wait');
};

module.exports={
  joinGame,addPlayer
};
