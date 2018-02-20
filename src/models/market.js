const Hotel = require('./hotel');
const neighbourTilesOf = require('../utils/tileUtilities').neighbourTilesOf;

class Market{
  constructor(){
    this.occupiedTiles=[];
    this.independentTiles=[];
    this.activeHotels=[];
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
  createHotel(hotel){
    this.activeHotels.push(new Hotel(hotel.name,hotel.color));
  }
  getHotel(hotelName){
    return this.activeHotels.find(hotel=>{
      return hotel.getName()==hotelName;
    });
  }
  getAllHotelsDetails(){
    return this.activeHotels;
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
