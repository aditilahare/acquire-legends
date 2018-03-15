const endGame = function(req, res){
  let gameId = req.cookies.gameId;
  let playerId = req.cookies.playerId;
  let game = req.app.game;
  let manager = req.app.gameManager;
  if(game.hasEnded()){
    game.removePlayer(playerId);
    res.cookie('playerId','', {expires: new Date(0)});
    res.cookie('gameId','', {expires: new Date(0)});
    !game.getPlayerCount() && manager.quitGame(gameId);
    res.redirect('/');
    res.end();
  }
};

module.exports = endGame;
