const TileBox = require('./tileBox');
const Bank = require('./bank');
const Market = require('./market');
const Turn = require('./turn');
const INITIAL_SHARES = 25;
const INITIAL_MONEY = 100000;
const STARTING_BALANCE = 6000;

const HOTEL_DATA=[
  {name: 'Sackson',color: 'rgb(205, 61, 65)'},
  {name: 'Zeta',color: 'rgb(236, 222, 34)'},
  {name: 'Hydra',color: 'orange'},
  {name: 'Fusion',color: 'green'},
  {name: 'America',color: 'rgb(23, 60, 190)'},
  {name: 'Phoenix',color: 'violet'},
  {name: 'Quantum',color: 'rgb(83, 161, 149)'}
];
class Game {
  constructor(maxPlayers,bank=new Bank(INITIAL_MONEY)) {
    this.maxPlayers=maxPlayers;
    this.minPlayers=3;
    this.players=[];
    this.tileBox = new TileBox(12,9);
    this.bank=bank;
    this.MODE='wait';
    this.market = new Market();
  }
  isVacancy(){
    return this.getPlayerCount()<this.maxPlayers;
  }
  addPlayer(player){
    if(this.isVacancy()){
      HOTEL_DATA.forEach(function(hotel){
        let hotelName = hotel.name;
        player.addShares(hotelName,0);
      });
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
    this.turn=new Turn(this.getPlayersOrder());
    this.MODE='play';
  }
  createHotels(hotelsData){
    let self=this;
    hotelsData.forEach((hotel)=>{
      this.market.createHotel(hotel);
      this.bank.createSharesOfHotel(hotel.name,INITIAL_SHARES);
    });
  }
  getHotel(hotelName){
    return this.market.getHotel(hotelName);
  }
  getPlayerDetails(id){
    let player=this.findPlayerBy(id);
    return player.getDetails();
  }
  isInPlayMode(){
    return this.MODE=='play';
  }
  getAllHotelsDetails(){
    let hotelsData=this.market.getAllHotelsDetails();
    let availableSharesOfHotels=this.bank.getAvailableSharesOfHotels();
    hotelsData.forEach((hotel)=>{
      hotel.shares=availableSharesOfHotels[hotel.name];
    });
    return hotelsData;
  }
  getAllPlayerNames(){
    return this.players.map((player)=>{
      return player.name;
    });
  }
  addSharesToPlayer(id,hotelName,noOfShares){
    let player = this.findPlayerBy(id);
    player.addShares(hotelName,noOfShares);
  }
  getPlayerSharesDetails(id){
    let player = this.findPlayerBy(id);
    return player.getShareDetails();
  }
  placeTile(id,tile){
    let player = this.findPlayerBy(id);
    let playerTile = player.getTile(tile);
    let isTilePlaced=this.market.placeTile(playerTile);
    if(isTilePlaced) {
      player.removeTile(tile);
    }
  }
  giveIndependentTiles(){
    return this.market.giveIndependentTiles();
  }
  getPlayersOrder(){
    return this.players.map((player)=>{
      return player.id;
    });
  }
  getAllPlayerDetails(){
    return this.players.map((player)=>{
      return player.getDetails();
    });
  }
  getCurrentPlayer(){
    let currentPlayerID=this.turn.getCurrentPlayerID();
    return this.getPlayerDetails(currentPlayerID);
  }
  changeCurrentPlayer(){
    let tiles=this.tileBox.getNTiles(1);
    let currentPlayerID=this.turn.getCurrentPlayerID();
    let currentPlayer=this.findPlayerBy(currentPlayerID);
    currentPlayer.addTile(tiles[0]);
    this.turn.updateTurn();
  }
}
module.exports=Game;
