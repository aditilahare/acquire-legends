const mergingForTieCase = function (req,res) {
  let game = req.app.game;
  let id=req.cookies.playerId;
  let hotelName= req.body.hotelName;
  res.sendStatus(game.tieBreaker(hotelName));
};

module.exports=mergingForTieCase;
