const areAllPlayersJoined=function (req,res) {

  res.send(req.app.game.areAllPlayersJoined());
};

module.exports=areAllPlayersJoined;
