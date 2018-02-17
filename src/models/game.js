const TileBox = require('./tileBox');
const Bank = require('./bank');
const Hotel = require('./hotel');
const INITIAL_MONEY = 100000;
const STARTING_BALANCE = 6000;
const HOTEL_DATA=[
  {name: 'Sackson',color: 'rgb(205, 61, 65)'},
  {name: 'Zeta',color: 'rgb(236, 222, 34)'},
  {name: 'Hydra',color: 'orange'},
  {name: 'Fusion',color: 'green'},
  {name: 'America',color: 'rgb(23, 60, 190)'},
  {name: 'Phoenix',color: 'violet'},
  {name: 'Quantum',color: 'cyan'}
];
class Game {
  constructor(maxPlayers,bank=new Bank(INITIAL_MONEY)) {
    this.maxPlayers=maxPlayers;
    this.minPlayers=3;
    this.players=[];
    this.hotels=[];
    this.tileBox = new TileBox(12,9);
    this.bank=bank;
    this.MODE='wait';
  }
  isVacancy(){
    return this.getPlayerCount()<this.maxPlayers;
  }
  addPlayer(player){
    if(this.isVacancy()){
      this.players.push(player);
      return true;
    }
    return false;
  }
  getPlayerCount(){
    return this.players.length;
  }
  haveAllPlayersJoined(){
    return this.maxPlayers==this.getPlayerCount();
  }
  findPlayerBy(id){
    return this.players.find(player=>{
      return player.id==id;
    });
  }
  getPlayerNameOf(id){
    if (this.findPlayerBy(id)) {
      return this.findPlayerBy(id).name;
    }
    return '';
  }
  disrtibuteMoneyToPlayer(id,money){
    let player=this.findPlayerBy(id);
    player.addMoney(money);
  }
  getAvailableCashOf(id){
    let player=this.findPlayerBy(id);
    return player.getAvailableCash();
  }
  distributeInitialMoney(initialMoney){
    this.players.forEach(player=>{
      this.disrtibuteMoneyToPlayer(player.id,initialMoney);
      this.bank.reduceMoney(initialMoney);
    });
  }
  isValidPlayer(id){
    return this.players.some(function(player){
      return id==player.id;
    });
  }
  distributeInitialTiles(){
    let tileBox=this.tileBox;
    this.players.forEach(function(player){
      player.addTiles(tileBox.getNTiles(6));
    });
  }
  start(){
    this.distributeInitialTiles();
    this.distributeInitialMoney(STARTING_BALANCE);
    this.createHotels(HOTEL_DATA);
    this.MODE='play';
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
  getPlayerDetails(id){
    let player=this.findPlayerBy(id);
    return player.getDetails();
  }
  isInPlayMode(){
    return this.MODE=='play';
  }
  getAllHotelsDetails(){
    return this.hotels;
  }
  getAllPlayerNames(){
    return this.players.map((player)=>{
      return player.name;
    });
  }
}
module.exports=Game;
