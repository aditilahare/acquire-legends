const changeTurn = function(req,res,next) {
  let game=req.app.game;
  game.changeCurrentPlayer();
  res.end();
};
module.exports=changeTurn;
