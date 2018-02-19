class Player {
  constructor(playerId, playerName) {
    this.name = playerName;
    this.id = playerId;
    this.tiles=[];
    this.availableMoney = 0;
    this.shares= {};
  }
  addTile(tile){
    this.tiles.push(tile);
  }
  getTiles(){
    return this.tiles;
  }
  addTiles(tiles){
    this.tiles=tiles;
  }
  getAvailableCash() {
    return this.availableMoney;
  }
  addMoney(money) {
    this.availableMoney += money;
  }
  getDetails(){
    return {
      tiles:this.getTiles(),
      availableMoney : this.getAvailableCash(),
      name:this.name,
      id:this.id,
      shares:this.shares
    };
  }
  addShares(hotelName,noOfShares){
    if(this.shares[hotelName]){
      this.shares[hotelName]+=noOfShares;
    } else{
      this.shares[hotelName]=noOfShares;
    }
  }
  getShareDetails(){
    return this.shares;
  }
  getTile(tile){
    let index = this.tiles.indexOf(tile);
    return this.tiles.splice(index,1)[0];
  }
}

module.exports = Player;
