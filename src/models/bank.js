class Bank {
  constructor(initialMoney) {
    this.availableCash = initialMoney;
    this.sharesDetailsOfHotels = [];
  }
  getAvalibleCash(){
    return this.availableCash;
  }
  reduceMoney(money){
    this.availableCash -= money;
  }
  createSharesOfHotel(nameOfHotel,noOfShares){
    let sharesOf = {};
    sharesOf = {
      hotelName:nameOfHotel,
      availableShares:noOfShares,
      shareHolders:[]
    };
    this.sharesDetailsOfHotels.push(sharesOf);
  }
  getAvailableSharesOfHotels(){
    return this.sharesDetailsOfHotels.reduce((prev,cur)=>{
      prev[cur.hotelName]=cur.availableShares;
      return prev;
    },{});
  }
  getAvalibleSharesOf(hotelName){
    let hotel = this.findHotelBy(hotelName);
    return hotel.availableShares;
  }
  findHotelBy(hotelName){
    return this.sharesDetailsOfHotels.find(hotel=>{
      return hotel.hotelName==hotelName;
    });
  }
  giveOneFreeShare(startedHotel,playerId){
    let desiredHotel = this.findHotelBy(startedHotel);
    desiredHotel.availableShares -= 1;
    desiredHotel.shareHolders.push(playerId);
  }
  getShareholdersOfHotel(hotelName){
    let hotel = this.findHotelBy(hotelName);
    return hotel.shareHolders;
  }
  doesHotelhaveEnoughShares(hotelName,noOfShares){
    let hotel = this.findHotelBy(hotelName);
    let availableSharesOfHotel = hotel.availableShares;
    return noOfShares<=availableSharesOfHotel;
  }
  sellSharesToPlayer(hotelName,noOfShares,playerId,cartValue){
    let desiredHotel = this.findHotelBy(hotelName);
    if(this.doesHotelhaveEnoughShares(hotelName,noOfShares)){
      desiredHotel.availableShares -= noOfShares;
      while(noOfShares>0){
        desiredHotel.shareHolders.push(playerId);
        noOfShares--;
      }
      this.availableCash += cartValue;
      return true;
    }
    return false;
  }
}
module.exports = Bank;
