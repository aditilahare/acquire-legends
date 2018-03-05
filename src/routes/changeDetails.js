const changeDetails = function(req,res) {
  let game=req.app.game;
  let id=req.cookies.playerId;
  res.send(game.getUpdationId(id).toString());
};
module.exports=changeDetails;
