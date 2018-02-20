const Hotel = require('./hotel');
const neighbourTilesOf = require('../utils/tileUtilities');

class Market{
  constructor(){
    this.occupiedTiles=[];
    this.independentTiles=[];
    this.hotels=[];
  }
  placeAsIndependentTile(tile){
    this.independentTiles.push(tile);
  }
  isOccupied(tile){
    return this.occupiedTiles.includes(tile);
  }
  placeTile(tile){
    let self=this;
    let neighbourTiles=neighbourTilesOf(tile);
    let occupied=neighbourTiles.filter(cur=>{
      return self.isOccupied(cur);
    });
    if (occupied.length==0) {
      this.placeAsIndependentTile(tile);
      this.occupiedTiles.push(tile);
      return true;
    }
  }
  createHotels(hotelsData){
    let self = this;
    hotelsData.forEach(function (hotel) {
      self.hotels.push(new Hotel(hotel.name,hotel.color));
    });
  }
  getHotel(hotelName){
    return this.hotels.find(hotel=>{
      return hotel.getName()==hotelName;
    });
  }
  getAllHotelsDetails(){
    return this.hotels;
  }
  giveIndependentTiles(){
    return this.independentTiles;
  }
}

module.exports = Market;
