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
    //we can extract model of shares
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
  giveOneFreeShare(startedHotelName,playerId){
    playerId=Number(playerId);
    this.addShareHolder(startedHotelName,playerId,1);
  }
  getShareholdersOfHotel(hotelName){
    let hotel=this.findHotelBy(hotelName);
    return hotel.shareHolders;
  }
  getAllShareHolderIds(hotelName){
    let shareHolders=this.getShareholdersOfHotel(hotelName);
    return shareHolders.map((shareHolder)=>{
      if (shareHolder.noOfShares>0) {
        return shareHolder.id;
      }
    });
  }
  doesHotelhaveEnoughShares(hotelName,noOfShares){
    let hotel = this.findHotelBy(hotelName);
    let availableSharesOfHotel = hotel.availableShares;
    return noOfShares<=availableSharesOfHotel;
  }
  getShareHoldersInDescending(hotelName){
    let shareHolders=this.getShareholdersOfHotel(hotelName);
    return shareHolders.sort((firstShareHolder,secondShareHolder)=>{
      let secondShareHolderShares=secondShareHolder.noOfShares;
      let firstShareHolderShares=firstShareHolder.noOfShares;
      return secondShareHolderShares-firstShareHolderShares;
    });
  }
  getShareHoldersForBonus(hotelName){
    let shareHoldersInDescending=this.getShareHoldersInDescending(hotelName);
    let majorityShareHolder=shareHoldersInDescending[0];
    let noOfSharesMajorityHas=majorityShareHolder.noOfShares;
    let majorityShareHolders=shareHoldersInDescending.filter((shareHolder)=>{
      return shareHolder.noOfShares==noOfSharesMajorityHas;
    });
    let minorityShareHolders=[];
    if (majorityShareHolders.length==1&&shareHoldersInDescending.length>1) {
      let minorityShareHolder=shareHoldersInDescending[1];
      let noOfSharesMinorityHas=minorityShareHolder.noOfShares;
      minorityShareHolders=shareHoldersInDescending.filter((shareHolder)=>{
        return shareHolder.noOfShares==noOfSharesMinorityHas;
      });
    }
    let shareHolders={};
    shareHolders.majority=majorityShareHolders;
    shareHolders.minority=minorityShareHolders;
    return shareHolders;
  }
  findShareHolderBy(playerId,desiredHotel){
    return desiredHotel.shareHolders.find((shareHolder)=>{
      return shareHolder.id==playerId;
    });
  }
  addShareHolder(hotelName,playerId,noOfShares){
    playerId=Number(playerId);
    noOfShares=Number(noOfShares);
    let desiredHotel = this.findHotelBy(hotelName);
    let shareHolder=this.findShareHolderBy(playerId,desiredHotel);
    if (shareHolder) {
      shareHolder.noOfShares+=noOfShares;
      desiredHotel.availableShares -= noOfShares;
    }else {
      shareHolder={};
      Number(playerId);
      shareHolder.id=playerId;
      shareHolder.noOfShares=noOfShares;
      desiredHotel.availableShares -= noOfShares;
      desiredHotel.shareHolders.push(shareHolder);
    }
  }
  sellSharesToPlayer(hotelName,noOfShares,playerId){
    playerId=Number(playerId);
    noOfShares=Number(noOfShares);
    if(this.doesHotelhaveEnoughShares(hotelName,noOfShares)){
      let desiredHotel = this.findHotelBy(hotelName);
      this.addShareHolder(hotelName,playerId,noOfShares);
      return true;
    }
    return false;
  }
  removeSharesOfPlayer(playerId,noOfSharesToSell,hotelName){
    noOfSharesToSell=Number(noOfSharesToSell);
    playerId=Number(playerId);
    let desiredHotel = this.findHotelBy(hotelName);
    let shareHolder=this.findShareHolderBy(playerId,desiredHotel);
    shareHolder.noOfShares-=noOfSharesToSell;
    desiredHotel.availableShares += noOfSharesToSell;
  }
}
module.exports = Bank;
