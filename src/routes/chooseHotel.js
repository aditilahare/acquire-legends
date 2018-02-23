const chooseHotel = function (req,res,next) {
  let game = req.app.game;
  let id=req.cookies.playerId;
  let hotelName= req.body.hotelName;
  game.startHotel(hotelName,id);
  console.log(game.getTurnState());
  res.send(game.getTurnState());
};

module.exports=chooseHotel;
