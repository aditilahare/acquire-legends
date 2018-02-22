const getPlayerDetails=function(req,res,next){
  let game=req.app.game;
  let id=req.cookies.playerId;
  let details=game.getPlayerDetails(id);
  res.send(JSON.stringify(details));
};

module.exports=getPlayerDetails;
