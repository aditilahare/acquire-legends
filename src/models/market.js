const Hotel = require('./hotel');
const neighbourTilesOf = require('../utils/tileUtilities').neighbourTilesOf;

class Market{
  constructor(){
    this.occupiedTiles=[];
    this.independentTiles=[];
    this.hotels=[];
  }
  addTileToExistingHotel(tile){
    let neighbourOccupiedTiles=this.getNeighbourOccupiedTiles(tile);
    let neighbourHotelsOfTile = this.getNeighbourHotelsOfTile(tile);
    if (neighbourHotelsOfTile[0].getAllOccupiedTiles().includes(tile)) {
      return;
    }
    this.removeFromIndependentTiles(neighbourOccupiedTiles);
    let sanitizedNeighbourTiles=neighbourOccupiedTiles.filter((tile)=>{
      return !this.doesHotelContainsTile(neighbourHotelsOfTile[0],tile);
    });
    neighbourHotelsOfTile[0].occupyTile(tile);
    sanitizedNeighbourTiles.forEach((neighbourTile)=>{
      this.addTileToExistingHotel(neighbourTile);
    });
  }
  addMergingHotelsToSurvivor(mergingHotels,survivorHotel){
    mergingHotels.forEach((mergingHotel)=>{
      let hotelToBeMerged=this.getHotel(mergingHotel.name);
      let hotelGoingToSurvive=this.getHotel(survivorHotel.name);
      let tiles=hotelToBeMerged.getAllOccupiedTiles();
      hotelToBeMerged.removeAllOccupiedTiles();
      hotelToBeMerged.status=false;
      hotelGoingToSurvive.addTilesToOccupiedTiles(tiles);
    });
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
  createHotel(hotel){
    this.hotels.push(new Hotel(hotel.name,hotel.color,hotel.level));
  }
  doesHotelContainsTile(hotel,tile){
    return neighbourTilesOf(tile).reduce((bool,testTile)=>{
      return bool || hotel.doesOccupiedTilesInclude(testTile);
    },false);
  }
  getActiveHotels(){
    return this.hotels.filter((hotel)=>{
      return hotel.status == true;
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
  getBonusAmountsOf(hotelName){
    let sharePrice=this.getSharePriceOfHotel(hotelName);
    let bonusAmounts={};
    bonusAmounts.majority=sharePrice*10;
    bonusAmounts.minority=sharePrice*5;
    return bonusAmounts;
  }
  getHotel(hotelName){
    return this.hotels.find(hotel=>{
      return hotel.getName()==hotelName;
    });
  }
  getInactiveHotels(){
    return this.hotels.filter((hotel)=>{
      return hotel.status != true;
    });
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
  getLowestCostPerShare() {
    let costsPerShares = this.getActiveHotels().map(hotel=>{
      return this.getSharePriceOfHotel(hotel.getName());
    });
    if(!costsPerShares.length){
      return 0;
    }
    return costsPerShares.reduce((highestPrice,currentPrice) => {
      return highestPrice>currentPrice? currentPrice:highestPrice;
    });
  }
  getMergingHotels(mergerBetween,survivorHotels){
    return mergerBetween.filter((hotel)=>{
      return !survivorHotels.includes(hotel);
    });
  }
  getNeighbourHotelsOfTile(tile){
    let hotelsList = [];
    hotelsList = this.getActiveHotels().filter(hotel=>{
      return this.doesHotelContainsTile(hotel,tile);
    });
    return hotelsList;
  }
  getNeighbourOccupiedTiles(tile){
    let self = this;
    let neighbourTiles=neighbourTilesOf(tile);
    return neighbourTiles.filter(cur=>{
      return self.isOccupied(cur);
    });
  }
  getSharePriceOfActiveHotel(hotelName){
    let hotel = this.getHotel(hotelName);
    let hotelSize = hotel.occupiedTiles.length;
    let hotelLevel = hotel.level;
    let sharePrice = this.calculateSharePrice(hotelSize,hotelLevel);
    return sharePrice;
  }
  getSharePriceOfHotel(hotelName){
    return this.getSharePriceOfActiveHotel(hotelName);
  }
  getState(){
    let response={
      status:false
    };
    response.activeHotels=this.getActiveHotels();
    response.inactiveHotels=this.getInactiveHotels();
    return response;
  }
  giveIndependentTiles(){
    return this.occupiedTiles;
  }
  isAdjecentToAnyHotel(tile){
    let neighbourHotelsOfTile = this.getNeighbourHotelsOfTile(tile);
    return neighbourHotelsOfTile.length>0;
  }
  isIndependentTile(tile){
    let self=this;
    let neighbourOccupiedTiles=this.getNeighbourOccupiedTiles(tile);
    return neighbourOccupiedTiles.length==0;
  }
  isOccupied(tile){
    return this.occupiedTiles.includes(tile);
  }
  isStartingHotel(tile){
    let neighbourOccupiedTiles = this.getNeighbourOccupiedTiles(tile);
    let neighbourHotelsOfTile = this.getNeighbourHotelsOfTile(tile);
    return neighbourOccupiedTiles.length>0
    && neighbourHotelsOfTile.length==0;
  }
  mergeManager(tile,neighbourHotelsOfTile){
    let response={};
    let stableHotels = neighbourHotelsOfTile.filter(hotel=>{
      return hotel.getSize()>10;
    });
    if (stableHotels.length>1) {
      response.status="invalidTile";
    }else {
      response=this.mergerOfHotel(neighbourHotelsOfTile,tile);
    }
    return response;
  }
  mergerOfHotel(neighbourHotelsOfTile,tile){
    let response={};
    response.status="merge";
    response.mergingTile=tile;
    let mergerBetween=neighbourHotelsOfTile;
    let survivorHotels=this.getLargeHotels(mergerBetween);
    let mergingHotels=this.getMergingHotels(mergerBetween,survivorHotels);
    response.survivorHotels=survivorHotels;
    response.mergingHotels=mergingHotels;
    return response;
  }
  placeAsIndependentTile(tile){
    this.independentTiles.push(tile);
  }
  placeMergingTile(tile){
    this.addTileToExistingHotel(tile);
  }
  placeTile(tile){
    let response=this.getState();
    if (this.isIndependentTile(tile)) {
      this.placeAsIndependentTile(tile);
      response.status="independentTile";
    }
    if(this.isAdjecentToAnyHotel(tile)) {
      let neighbourHotelsOfTile=this.getNeighbourHotelsOfTile(tile);
      if (neighbourHotelsOfTile.length==1) {
        this.addTileToExistingHotel(tile);
        response.status="addedToHotel";
      }
      if (neighbourHotelsOfTile.length>1) {
        return this.mergeManager(tile,neighbourHotelsOfTile);
      }
    }else if(this.isStartingHotel(tile)){
      response=this.startingOfHotel(response,tile);
    }
    this.occupiedTiles.push(tile);
    return response;
  }
  reduceHotelsBySize(largerHotel,currentHotel){
    let sizeOfLargerHotel=largerHotel.getSize();
    let sizeOfCurrentHotel=currentHotel.getSize();
    if (sizeOfCurrentHotel>=sizeOfLargerHotel) {
      return currentHotel;
    }
    return largerHotel;
  }
  removeFromIndependentTiles(tiles){
    tiles.forEach(tile=>{
      let index = this.independentTiles.indexOf(tile);
      this.independentTiles.splice(index,1);
    });
  }
  startHotel(hotelName,tiles){
    let hotel = this.getHotel(hotelName);
    hotel.status=true;
    hotel.occupyTile(tiles.pop());
    tiles.forEach((tile)=>{
      this.addTileToExistingHotel(tile);
    });
    let response=this.getState();
    response.status="startHotel";
    response.hotelName=hotel.name;
    return response;
  }
  startingOfHotel(response,tile){
    response.tiles=this.getNeighbourOccupiedTiles(tile);
    response.tiles.push(tile);
    response.status="chooseHotel";
    return response;
  }
}


module.exports = Market;
