const getPlayerSharesDetails=function(req,res,next){
  let game=req.app.game;
  let id=req.cookies.playerId;
  let sharesDetails=game.getPlayerSharesDetails(id);
  res.send(JSON.stringify(sharesDetails));
};

module.exports=getPlayerSharesDetails;
