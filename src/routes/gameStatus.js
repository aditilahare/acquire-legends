const getGameStatus = function (req,res,next) {
  let game = req.app.game;
  let playerId=req.cookies.playerId;
  res.send(JSON.stringify(game.getStatus(playerId)));
};

module.exports=getGameStatus;
