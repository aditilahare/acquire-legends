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
  mergeManager(tile,neighbourHotelsOfTile,response){
    let stableHotels = neighbourHotelsOfTile.filter(hotel=>{
      return hotel.getSize()>10;
    });
    if (stableHotels.length>1) {
      response.status="Invalid Tile";
    }else {
      response=this.mergerOfHotel(response,neighbourHotelsOfTile,tile);
    }
  }
  placeTile(tile){
    let response=this.getState();
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
      if (neighbourHotelsOfTile.length>1) {
        this.mergeManager(tile,neighbourHotelsOfTile,response);
        return response;
      }
    }else if(this.isStartingHotel(tile)){
      response=this.startingOfHotel(response,tile);
    }
    this.occupiedTiles.push(tile);
    return response;
  }
  startingOfHotel(response,tile){
    response.tiles=this.getNeighbourOccupiedTiles(tile);
    response.tiles.push(tile);
    response.status="chooseHotel";
    return response;
  }
  mergerOfHotel(response,neighbourHotelsOfTile,tile){
    response.status="merge";
    response.mergingTile=tile;
    let mergerBetween=neighbourHotelsOfTile;
    let survivorHotels=this.getLargeHotels(mergerBetween);
    let mergingHotels=this.getMergingHotels(mergerBetween,survivorHotels);
    response.survivorHotels=survivorHotels;
    response.mergingHotels=mergingHotels;
    return response;
  }

  getMergingHotels(mergerBetween,survivorHotels){
    return mergerBetween.filter((hotel)=>{
      return !survivorHotels.includes(hotel);
    });
  }
  reduceHotelsBySize(largerHotel,currentHotel){
    let sizeOfLargerHotel=largerHotel.getSize();
    let sizeOfCurrentHotel=currentHotel.getSize();
    if (sizeOfCurrentHotel>=sizeOfLargerHotel) {
      return currentHotel;
    }
    return largerHotel;
  }
  getLargeHotels(mergerBetween){
    let self = this;
    let dummyHotel={occupiedTiles:[],
      getSize:function(){
        return 0;
      }
    };
    let largerHotel= mergerBetween.reduce(self.reduceHotelsBySize,dummyHotel);
    let sizeOfLargerHotel=largerHotel.getSize();
    return mergerBetween.filter(hotel=>{
      return hotel.getSize()==sizeOfLargerHotel;
    });
  }
  getState(){
    let response={
      status:false
    };
    response.activeHotels=this.getActiveHotels();
    response.inactiveHotels=this.getInactiveHotels();
    return response;
  }
  startHotel(hotelName,tiles){
    let response=this.getState();
    let hotel = this.getHotel(hotelName);
    hotel.status=true;
    tiles.forEach((tile)=>{
      hotel.occupyTile(tile);
    });
    response.status="starting hotel";
    response.hotelName=hotel.name;
    return response;
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
  getBonusAmountsOf(hotelName){
    let sharePrice=this.getSharePriceOfHotel(hotelName);
    let bonusAmounts={};
    bonusAmounts.majority=sharePrice*10;
    bonusAmounts.minority=sharePrice*5;
    return bonusAmounts;
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
  addMergingsHotelsToSurvivor(mergingHotels,survivorHotel){
    mergingHotels.forEach((mergingHotel)=>{
      let hotelToBeMerged=this.getHotel(mergingHotel.name);
      let hotelGoingToSurvive=this.getHotel(survivorHotel.name);
      let tiles=hotelToBeMerged.getAllOccupiedTiles();
      hotelToBeMerged.removeAllOccupiedTiles();
      hotelToBeMerged.status=false;
      hotelGoingToSurvive.addTilesToOccupiedTiles(tiles);
    });
  }
  placeMergingTile(tile){
    this.addTileToExistingHotel(tile);
  }
}


module.exports = Market;
