const getAllPlayerNames=function (req,res) {
  res.send(req.app.game.getAllPlayerNames());
};

module.exports=getAllPlayerNames;
