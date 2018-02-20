const Hotel = require('./hotel');
const neighbourTilesOf = require('../utils/tileUtilities').neighbourTilesOf;

class Market{
  constructor(){
    this.occupiedTiles=[];
    this.independentTiles=[];
    this.hotels=[];
  }
  placeAsIndependentTile(tile){
    this.independentTiles.push(tile);
  }
  getActiveHotels(){
    return this.hotels.filter((hotel)=>{
      return hotel.status == true;
    });
  }
  getInactiveHotels(){
    return this.hotels.filter((hotel)=>{
      return hotel.status != true;
    });
  }
  isOccupied(tile){
    return this.occupiedTiles.includes(tile);
  }
  getNeighbourOccupiedTiles(tile){
    let self = this;
    let neighbourTiles=neighbourTilesOf(tile);
    return neighbourTiles.filter(cur=>{
      return self.isOccupied(cur);
    });
  }
  isIndependentTile(tile){
    let self=this;
    let neighbourOccupiedTiles=this.getNeighbourOccupiedTiles(tile);
    return neighbourOccupiedTiles.length==0;
  }
  isStartingHotel(tile){
    let neighbourOccupiedTiles = this.getNeighbourOccupiedTiles(tile);
    let neighbourHotelsOfTile = this.getNeighbourHotelsOfTile(tile);
    return neighbourOccupiedTiles.length>0
        && neighbourHotelsOfTile.length==0;
  }
  isAdjecentToSingleHotel(tile){
    let neighbourHotelsOfTile = this.getNeighbourHotelsOfTile(tile);
    return neighbourHotelsOfTile.length==1;
  }
  placeTile(tile){
    let response={
      status:false
    };
    if (this.isIndependentTile(tile)) {
      this.placeAsIndependentTile(tile);
      response.status="Independent";
    }else if(this.isAdjecentToSingleHotel(tile)) {
      this.addTileToExistingHotel(tile);
      response.status="Added to hotel";
    }else if(this.isStartingHotel(tile)){
      response.tiles=this.getNeighbourOccupiedTiles(tile);
      response.tiles.push(tile);
      response.status="starting hotel";
      let hotel = this.getInactiveHotels()[0];
      hotel.status=true;
      response.tiles.forEach((tile)=>{
        hotel.occupyTile(tile);
      });
    }
    this.occupiedTiles.push(tile);
    return response;
  }
  createHotel(hotel){
    this.hotels.push(new Hotel(hotel.name,hotel.color));
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
    return this.occupiedTiles;
  }
  doesHotelContainsTile(hotel,tile){
    return neighbourTilesOf(tile).reduce((bool,testTile)=>{
      return bool || hotel.doesOccupiedTilesInclude(testTile);
    },false);
  }
  getNeighbourHotelsOfTile(tile){
    let hotelsList = [];
    hotelsList = this.getActiveHotels().filter(hotel=>{
      return this.doesHotelContainsTile(hotel,tile);
    });
    return hotelsList;
  }
  addTileToExistingHotel(tile){
    let neighbourOccupiedTiles=this.getNeighbourOccupiedTiles(tile);
    let neighbourHotelsOfTile = this.getNeighbourHotelsOfTile(tile);
    neighbourHotelsOfTile[0].occupyTile(tile);
    neighbourOccupiedTiles.forEach((neighbourTile)=>{
      neighbourHotelsOfTile[0].occupyTile(neighbourTile);
    });
  }
}

module.exports = Market;
