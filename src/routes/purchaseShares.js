const purchaseShares = function(req,res,next){
  let game = req.app.game;
  let id = req.cookies.playerId;
  let cartData = JSON.parse(req.body.cart);
  console.log(cartData);
  Object.keys(cartData).forEach(hotelName=>{
    game.purchaseShares(hotelName,cartData[hotelName],id);
  });
  res.send(game.turn.getState());
};
module.exports=purchaseShares;
