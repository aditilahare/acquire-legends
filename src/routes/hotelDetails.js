const getDetails=function(req,res,next){
  let game=req.app.game;
  let details=game.getAllHotelsDetails();
  console.log(details);
  res.send(JSON.stringify(details));
};

module.exports=getDetails;
