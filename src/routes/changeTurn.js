const changeTurn = function(req,res,next) {
  let game=req.app.game;
  let id=req.cookies.playerId;
  game.changeCurrentPlayer();
  res.end();
};
module.exports=changeTurn;
