class Bank {
  constructor(initialMoney) {
    this.availableCash = initialMoney;
    this.sharesOfHotels = [];
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
      shares:noOfShares,
      shareHolders:[]
    };
    this.sharesOfHotels.push(sharesOf);
  }
  getAvailableSharesOfHotels(){
    return this.sharesOfHotels.reduce((prev,cur)=>{
      prev[cur.hotelName]=cur.shares;
      return prev;
    },{});
  }
  getAvalibleSharesOf(hotelName){
    let hotel = this.findHotelBy(hotelName);
    return hotel.shares;
  }
  findHotelBy(hotelName){
    return this.sharesOfHotels.find(hotel=>{
      return hotel.hotelName==hotelName;
    });
  }
  giveOneFreeShare(startedHotelName,playerId){
    let desiredHotel = this.findHotelBy(startedHotelName);
    desiredHotel.shares -= 1;
    desiredHotel.shareHolders.push(playerId);
  }
  getShareholdersOfHotel(hotelName){
    let hotel = this.findHotelBy(hotelName);
    return hotel.shareHolders;
  }
}
module.exports = Bank;
