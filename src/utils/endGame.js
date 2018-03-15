const isEveryHotelStable=function(hotels){
  return hotels.every(hotel=>{
    return hotel.getSize()>10;
  });
};
const isAnyAboveFourty=function(hotels){
  return hotels.some(hotel=>{
    return hotel.getSize()>40;
  });
};
const isGameOver=function(activeHotels){
  if (activeHotels.length>0) {
    return isEveryHotelStable(activeHotels)||isAnyAboveFourty(activeHotels);
  }
  return false;
};

const getRankList = function (game) {
  let players = game.players;
  return players.sort((firstShareHolder,secondShareHolder)=>{
    let secondShareHolderShares=secondShareHolder.getAvailableCash();
    let firstShareHolderShares=firstShareHolder.getAvailableCash();
    return secondShareHolderShares-firstShareHolderShares;
  });
};

const sanitizer = function(player){
  let sanitized = {};
  sanitized.name = player.name;
  sanitized.cash = player.getAvailableCash();
  return sanitized;
};

const decidePlayerRank = function () {
  let activeHotels = this.market.getActiveHotels();
  activeHotels.forEach(hotel=>{
    this.giveMajorityMinorityBonus(hotel.name);
    let shareHolder=this.bank.getShareholdersOfHotel(hotel.name);
    shareHolder.forEach(shareHolder=>{
      let playerId = shareHolder.id;
      let noOfShares = shareHolder.noOfShares;
      let sharePriceOfHotel = this.market.getSharePriceOfHotel(hotel.name);
      let moneyThroughshare = sharePriceOfHotel*noOfShares;
      this.distributeMoneyToPlayer(playerId,moneyThroughshare);
    });
  });
  let rankList = getRankList(this);
  return rankList.map(sanitizer);
};

module.exports={
  isGameOver,
  decidePlayerRank
};
