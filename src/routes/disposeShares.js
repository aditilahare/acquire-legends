const disposeShares = function(req,res,next){
  let game=req.app.game;
  let playerId=req.cookies.playerId;
  let sharesToDispose=req.body;
  if(game.canSharesBeDisposed(playerId,sharesToDispose)){
    game.disposeShares(playerId,sharesToDispose);
  }
  res.send(game.getStatus(playerId));
};
module.exports=disposeShares;
