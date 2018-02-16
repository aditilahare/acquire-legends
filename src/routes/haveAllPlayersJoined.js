const haveAllPlayersJoined=function (req,res) {

  res.send(req.app.game.haveAllPlayersJoined());
};

module.exports=haveAllPlayersJoined;
