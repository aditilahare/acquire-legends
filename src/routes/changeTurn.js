const changeTurn = function(req,res,next) {
  let game=req.app.game;
  let id=req.cookies.playerId;
  if(game.isCurrentPlayer(id)){
    game.changeCurrentPlayer();
    res.end();
  }else {
    res.sendStatus(401);
  }
};
module.exports=changeTurn;
