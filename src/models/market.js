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
  isAdjecentToAnyHotel(tile){
    let neighbourHotelsOfTile = this.getNeighbourHotelsOfTile(tile);
    return neighbourHotelsOfTile.length>0;
  }
  removeFromIndependentTiles(tiles){
    tiles.forEach(tile=>{
      let index = this.independentTiles.indexOf(tile);
      this.independentTiles.splice(index,1);
    });
  }
  placeTile(tile){
    let response={
      status:false
    };
    if (this.isIndependentTile(tile)) {
      this.placeAsIndependentTile(tile);
      response.status="Independent";
    }
    if(this.isAdjecentToAnyHotel(tile)) {
      let neighbourHotelsOfTile=this.getNeighbourHotelsOfTile(tile);
      if (neighbourHotelsOfTile.length==1) {
        this.addTileToExistingHotel(tile);
        response.status="Added to hotel";
      }
      if (neighbourHotelsOfTile.length==2) {
        this.megerOfTwoHotel(response,neighbourHotelsOfTile,tile);
      }
    }
    if(this.isStartingHotel(tile)){
      this.startHotel(response,tile);
    }
    this.occupiedTiles.push(tile);
    return response;
  }
  startHotel(response,tile){
    response.tiles=this.getNeighbourOccupiedTiles(tile);
    response.tiles.push(tile);
    response.status="starting hotel";
    let hotel = this.getInactiveHotels()[0];
    hotel.status=true;
    response.tiles.forEach((tile)=>{
      hotel.occupyTile(tile);
    });
    response.hotelName=hotel.name;
  }
  megerOfTwoHotel(response,neighbourHotelsOfTile,tile){
    response.status="merge";
    response.mergerBetween=neighbourHotelsOfTile;
    response.mergingTile=tile;
    let surviourHotel=this.getLargerHotel(neighbourHotelsOfTile);
    response.surviourHotel=surviourHotel;
  }
  getLargerHotel(hotelsList){
    let hotel=hotelsList[0];
    let sizeOfFirstHotel=hotelsList[0].getSize();
    let sizeOfSecondHotel=hotelsList[1].getSize();

    if (sizeOfSecondHotel>sizeOfFirstHotel) {
      hotel=hotelsList[1];
    }
    return hotel;
  }
  createHotel(hotel){
    this.hotels.push(new Hotel(hotel.name,hotel.color,hotel.level));
  }
  getHotel(hotelName){
    return this.hotels.find(hotel=>{
      return hotel.getName()==hotelName;
    });
  }
  getAllHotelsDetails(){
    let self=this;
    return this.hotels.map((hotel)=>{
      hotel.sharePrice="-";
      if (hotel.status) {
        hotel.sharePrice=self.getSharePriceOfActiveHotel(hotel.name);
      }
      return hotel;
    });
  }
  getSharePriceOfActiveHotel(hotelName){
    let hotel = this.getHotel(hotelName);
    let hotelSize = hotel.occupiedTiles.length;
    let hotelLevel = hotel.level;
    let sharePrice = this.calculateSharePrice(hotelSize,hotelLevel);
    return sharePrice;
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
    this.removeFromIndependentTiles(neighbourOccupiedTiles);
    let sanitizedNeighbourTiles=neighbourOccupiedTiles.filter((tile)=>{
      return !this.doesHotelContainsTile(neighbourHotelsOfTile[0],tile);
    });
    neighbourHotelsOfTile[0].occupyTile(tile);
    sanitizedNeighbourTiles.forEach((neighbourTile)=>{
      neighbourHotelsOfTile[0].occupyTile(neighbourTile);
    });
  }
  getSharePriceOfHotel(hotelName){
    return this.getSharePriceOfActiveHotel(hotelName);
  }
  calculateSharePrice(hotelSize,hotelLevel){
    let sharePrice = (hotelLevel*100);
    if(hotelSize<6){
      let increament = (hotelSize-2)*100;
      sharePrice += increament;
    }
    if(hotelSize>5&&hotelSize<11){
      sharePrice += 400;
    }
    if(hotelSize>10&&hotelSize<21){
      sharePrice += 500;
    }
    if(hotelSize>20&&hotelSize<31){
      sharePrice += 600;
    }
    if(hotelSize>30&&hotelSize<41){
      sharePrice += 700;
    }
    if(hotelSize>40){
      sharePrice += 800;
    }
    return sharePrice;
  }
}


module.exports = Market;
