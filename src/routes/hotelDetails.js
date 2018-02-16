const getDetails=function(req,res,next){
  let game=req.app.game;
  let details=game.getAllHotelsDetails();
  res.send(JSON.stringify(details));
};

module.exports=getDetails;
