const actions = {};
actions['placeTile'] = function (game) {
  game.placeTile(this.id,this.getTile());
  return true;
};

actions['chooseHotel'] = function (game) {
  let hotel=game.market.getInactiveHotels()[0];
  game.startHotel(hotel.name,this.id);
  return true;
};

actions['chooseHotelForMerge'] = function (game) {
  let state=game.getStatus(this.id).turnDetails.state;
  let hotel=state.survivorHotels[0];
  game.tieBreaker(hotel.name);
  return true;
};

actions['disposeShares'] = function (game) {
  let sharesToDeploy={};
  let state=game.getStatus(this.id).turnDetails.state;
  let hotelName = state.currentMergingHotel.name;
  sharesToDeploy.hotelName=hotelName;
  sharesToDeploy.noOfSharesToExchange=0;
  sharesToDeploy.noOfSharesToSell=this.shares[hotelName];
  game.disposeShares(this.id,sharesToDeploy);
  return true;
};
actions['purchaseShares'] = function (game) {
  let hotel=game.market.getActiveHotels()[0];
  game.purchaseShares(hotel.name,2,this.id);
  game.changeCurrentPlayer();
  return true;
};


module.exports=actions;
