const isGameExisted = function(req,res,next){
  let isGame=req.app.game ? true : false;
  res.send(isGame);
};

module.exports=isGameExisted;
