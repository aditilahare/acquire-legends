const purchaseShares = function(req,res,next){
  let game = req.app.game;
  let id = req.cookies.playerId;
  let cartData = JSON.parse(req.body.cart);
  if(game.canSharesBePurchased(id,cartData)){
    Object.keys(cartData).forEach(hotelName=>{
      game.purchaseShares(hotelName,cartData[hotelName],id);
    });
    game.changeCurrentPlayer();
  }
  res.send(game.getTurnState());
};
module.exports=purchaseShares;
