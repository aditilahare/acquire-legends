const mergingForTieCase = function (req,res) {
  let game = req.app.game;
  let id=req.cookies.playerId;
  let hotelName= req.body.hotelName;
  game.tieBreaker(hotelName);
  res.send(game.getTurnState());
};

module.exports=mergingForTieCase;
