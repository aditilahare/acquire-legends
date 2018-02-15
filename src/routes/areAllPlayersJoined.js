const areAllPlayersJoined=function (req,res) {
  return req.app.game.areAllPlayersJoined();
};

module.exports=areAllPlayersJoined;
