const neighbourTilesOf = require('../utils/tileUtilities.js').neighbourTilesOf;

class Market{
  constructor(){
    this.activeHotels=[];
    this.independentTiles=[];
  }
  placeAsIndependentTile(tile){
    this.independentTiles.push(tile);
  }
  giveIndependentTiles(){
    return this.independentTiles;
  }

  doesHotelContainsTile(hotel,tile){
    return neighbourTilesOf(tile).reduce((bool,testTile)=>{
      return bool || hotel.doesOccupiedTilesInclude(testTile);
    },false);
  }

  getNeighbourHotelsOfTile(tile){
    let hotelsList = [];
    hotelsList = this.activeHotels.filter(hotel=>{
      return this.doesHotelContainsTile(hotel,tile);
    });
    return hotelsList;
  }

  addTileToExistingHotel(tile){
    let neighbourHotelsOfTile = this.getNeighbourHotelsOfTile(tile);
    if(neighbourHotelsOfTile.length==1) {
      neighbourHotelsOfTile[0].occupyTile(tile);
    }
  }
}

module.exports = Market;
