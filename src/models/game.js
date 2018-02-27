const TileBox = require('./tileBox');
const Bank = require('./bank');
const Market = require('./market.js');
const Turn = require('./turn');
const actions = require('../utils/actions.js');
const isGameOver = require('../utils/endGame.js').isGameOver;

let HOTEL_DATA = require('../../data/hotelsData.json');

const INITIAL_SHARES = 25;
const INITIAL_MONEY = 100000;
const STARTING_BALANCE = 6000;
let tilebox = new TileBox(12,9);
class Game {
  constructor(maxPlayers,tileBox=tilebox,bank=new Bank(INITIAL_MONEY)) {
    this.maxPlayers=maxPlayers;
    this.minPlayers=3;
    this.players=[];
    this.tileBox = tileBox;
    this.bank=bank;
    this.MODE='wait';
    this.activityLog=[];
    this.market = new Market();
    this.actions = actions;
  }
  isVacant() {
    return this.getPlayerCount() < this.maxPlayers;
  }
  addPlayer(player) {
    if (this.isVacant()) {
      HOTEL_DATA.forEach(function(hotel) {
        let hotelName = hotel.name;
        player.addShares(hotelName, 0);
      });
      this.players.push(player);
      this.logActivity(`${player.name} has joined the game.`);
      return true;
    }
    return false;
  }
  getPlayerCount() {
    return this.players.length;
  }
  haveAllPlayersJoined() {
    return this.maxPlayers == this.getPlayerCount();
  }
  findPlayerById(id) {
    return this.players.find(player => {
      return player.id == id;
    });
  }
  getPlayerNameById(id) {
    if (this.findPlayerById(id)) {
      return this.findPlayerById(id).name;
    }
    return '';
  }
  deductMoneyFromPlayer(playerId,money){
    let player = this.findPlayerById(playerId);
    player.deductMoney(money);
  }
  distributeMoneyToPlayer(id, money) {
    let player = this.findPlayerById(id);
    player.addMoney(money);
  }
  distributeInitialMoney(initialMoney) {
    this.players.forEach(player => {
      this.distributeMoneyToPlayer(player.id, initialMoney);
      this.bank.reduceMoney(initialMoney);
    });
  }
  isValidPlayer(id) {
    return this.players.some(function(player) {
      return id == player.id;
    });
  }
  distributeInitialTiles() {
    let tileBox = this.tileBox;
    this.players.forEach(function(player) {
      player.addTiles(tileBox.getTiles(6));
    });
  }
  start() {
    this.distributeInitialTiles();
    this.distributeInitialMoney(STARTING_BALANCE);
    this.createHotels(HOTEL_DATA);
    this.turn = new Turn(this.getPlayersOrder());
    this.MODE = 'play';
    this.turn.setState({
      expectedActions:['placeTile']
    });
    this.logActivity(`Game has started.`);
  }
  createHotels(hotels){
    hotels.forEach((hotel) => {
      this.market.createHotel(hotel);
      this.bank.createSharesOfHotel(hotel.name,INITIAL_SHARES);
    });
  }
  giveMajorityMinorityBonus(hotelName){
    // this part is forcing us to think about our data_structure again
    let shareHolders=this.bank.getShareHoldersForBonus(hotelName);
    let bonusAmounts=this.market.getBonusAmountsOf(hotelName);
    if (shareHolders.minority.length==0) {
      this.giveBonus(shareHolders.majority,bonusAmounts.majority,'majority');
      this.giveBonus(shareHolders.majority,bonusAmounts.minority,'minority');
    }else {
      this.giveBonus(shareHolders.majority,bonusAmounts.majority,'majority');
      this.giveBonus(shareHolders.minority,bonusAmounts.minority,'minority');
    }
  }
  giveBonus(shareHolders,totalBonus,bonusType){
    let self=this;
    let bonusAmount=totalBonus/(shareHolders.length);
    shareHolders.forEach((shareHolder)=>{
      self.distributeMoneyToPlayer(shareHolder.id,bonusAmount);
      self.logActivity(`${self.getPlayerNameById(shareHolder.id)}\
       got ${bonusAmount} as ${bonusType} bonus`);
    });
  }
  getHotel(hotelName){
    return this.market.getHotel(hotelName);
  }
  getPlayerDetails(id) {
    let player = this.findPlayerById(id);
    return player.getDetails();
  }
  isInPlayMode() {
    return this.MODE == 'play';
  }
  getAllHotelsDetails(){
    let hotelsData=this.market.getAllHotelsDetails();
    let availableSharesOfHotels=this.bank.getAvailableSharesOfHotels();
    hotelsData.forEach((hotel)=>{
      hotel.shares=availableSharesOfHotels[hotel.name];
    });
    return hotelsData;
  }
  getAllPlayerNames() {
    return this.players.map((player) => {
      return player.name;
    });
  }
  addSharesToPlayer(id, hotelName, noOfShares) {
    let player = this.findPlayerById(id);
    player.addShares(hotelName, noOfShares);
  }
  getPlayerSharesDetails(id) {
    let player = this.findPlayerById(id);
    return player.getShareDetails();
  }
  placeTile(id, tile) {
    let player = this.findPlayerById(id);
    let playerTile = player.getTile(tile);
    let response=this.market.placeTile(playerTile);
    if(response.status){
      player.removeTile(tile);
      response.player=player;
      this.setState(response);
      this.logActivity(`${player.name} has placed ${playerTile}.`);
    }
    if(isGameOver(response.activeHotels)){
      response.status="gameOver";
    }
    return response;
  }
  setState(response){
    let state=this.actions[response.status].call(this,response);
    this.turn.setState(state);
  }
  giveIndependentTiles() {
    return this.market.giveIndependentTiles();
  }
  getPlayersOrder() {
    return this.players.map((player) => {
      return player.id;
    });
  }
  getAllPlayerDetails() {
    return this.players.map((player) => {
      return player.getDetails();
    });
  }
  getCurrentPlayer() {
    let currentPlayerID = this.turn.getCurrentPlayerID();
    return this.getPlayerDetails(currentPlayerID);
  }
  isCurrentPlayer(playerId){
    return playerId == this.turn.getCurrentPlayerID();
  }
  changeCurrentPlayer() {
    let tiles = this.tileBox.getTiles(1);
    let currentPlayerID = this.turn.getCurrentPlayerID();
    let currentPlayer = this.findPlayerById(currentPlayerID);
    currentPlayer.addTile(tiles[0]);
    this.turn.setState({
      expectedActions:['placeTile']
    });
    this.turn.updateTurn();
  }
  getTurnDetails(id){
    let turnDetails={};
    let currentPlayer=this.getCurrentPlayer();
    let otherPlayers=this.getAllPlayerDetails().filter((player)=>{
      return currentPlayer.id!=player.id;
    });
    turnDetails.currentPlayer = currentPlayer.name;
    turnDetails.otherPlayers = otherPlayers.map((player)=>{
      return player.name;
    });
    turnDetails.isMyTurn=false;
    if(currentPlayer.id==id) {
      turnDetails.isMyTurn=true;
    }
    return turnDetails;
  }
  getStatus(playerId){
    return {
      independentTiles:this.giveIndependentTiles(),
      hotelsData:this.getAllHotelsDetails(),
      turnDetails:this.getTurnDetails(playerId),
      gameActivityLog:this.activityLog
    };
  }
  getTurnState(){
    return this.turn.getState();
  }
  isExpectedAction(action){
    return this.getTurnState().expectedActions.includes(action);
  }
  startHotel(hotelName,playerId){
    let tiles=this.getTurnState().tiles;
    let response=this.market.startHotel(hotelName,tiles);
    let playerName= this.getPlayerNameById(playerId);
    this.bank.giveOneFreeShare(hotelName,playerId);
    this.addSharesToPlayer(playerId,hotelName,1);
    this.setState(response);
    this.logActivity(`${playerName} has started ${hotelName} hotel.`);
    return response;
  }
  purchaseShares(hotelName,noOfShares,playerId){
    let player = this.findPlayerById(playerId);
    let sharePrice = this.market.getSharePriceOfHotel(hotelName);
    let cartValue = sharePrice * noOfShares;
    let hotelStatus = this.bank.doesHotelhaveEnoughShares(hotelName,noOfShares);
    let playerStatus = player.doesPlayerHasEnoughMoney(cartValue);
    if(hotelStatus && playerStatus){
      player.deductMoney(cartValue);
      this.addSharesToPlayer(playerId, hotelName, noOfShares);
      this.bank.sellSharesToPlayer(hotelName,noOfShares,playerId,cartValue);
      this.logActivity(`${player.name} has bought ${noOfShares}\
        shares of ${hotelName}.`);
    }
    return;
  }
  getAvailableCashOfPlayer(playerId){
    return this.findPlayerById(playerId).getAvailableCash();
  }
  logActivity(activity){
    this.activityLog.push(`> ${new Date().toLocaleTimeString()}: ${activity}`);
  }
  getActivityLog(){
    return this.activityLog;
  }
  performMergeAction(surviourHotels,mergingHotels,response){
    let surviourHotel=surviourHotels[0];
    mergingHotels.forEach((mergingHotel)=>{
      this.giveMajorityMinorityBonus(mergingHotel.name);
      this.market.addMergingHotelToSurviour(mergingHotel,surviourHotel);
      this.logActivity(`${surviourHotel.name} acquired ${mergingHotel.name}`);
    });
    response.activeHotels=this.market.getActiveHotels();
    response.inactiveHotels.concat(mergingHotels);
  }
  tieBreaker(surviourHotel){
    let oldResponse=this.getTurnState();
    let oldSurviourHotels=oldResponse.surviourHotels;
    let surviourHotels=[this.getHotel(surviourHotel)];
    oldResponse.surviourHotels = surviourHotels;
    let mergingHotels = oldSurviourHotels.filter(hotel=>{
      return !surviourHotels.includes(hotel);
    });
    mergingHotels.forEach(hotel=>{
      oldResponse.mergingHotels.push(hotel);
    });
    this.logActivity(`${this.getCurrentPlayer().name} has\
     choosen ${surviourHotel} to stay`);
    this.actions['merge'].call(this,oldResponse);
    return 200;
  }
}
module.exports = Game;
