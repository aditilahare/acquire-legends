const TileBox = require('./tileBox');
const Bank = require('./bank');
const Market = require('./market');
const Turn = require('./turn');

let HOTEL_DATA = require('../../data/hotelsData.json');

const INITIAL_SHARES = 25;
const INITIAL_MONEY = 100000;
const STARTING_BALANCE = 6000;
class Game {
  constructor(maxPlayers,bank=new Bank(INITIAL_MONEY)) {
    this.maxPlayers=maxPlayers;
    this.minPlayers=3;
    this.players=[];
    this.tileBox = new TileBox(12,9);
    this.bank=bank;
    this.MODE='wait';
    this.market = new Market();
    this.actions = {
      'Independent':function(response){
        response.expectedActions=['buyShares','changeTurn'];
        if(response.activeHotels.length==0) {
          response.status="changeTurn";
        }
        return response;
      },
      'Added to hotel':function(response){
        response.expectedActions=['buyShares','changeTurn'];
        return response;
      },
      'merge':function (response) {
        response.expectedActions=['sellKeepOrTradeShares'];
        response.status='sellKeepOrTradeShares';
        let mergingHotels=response.mergingHotels;
        let surviourHotel=response.surviourHotel;
        this.giveBonus(mergingHotels[0].name);
        return response;
      },
      'chooseHotel':function(response){
        response.expectedActions=['buyShares','changeTurn'];
        if(response.inactiveHotels.length>0){
          response.expectedActions=['chooseHotel'];
          response.status="chooseHotel";
        }
        return response;
      },
      'starting hotel':function(response){
        response.expectedActions=['buyShares','changeTurn'];
        response.status="buyShares";
        return response;
      }
    };
  }
  isVacancy() {
    return this.getPlayerCount() < this.maxPlayers;
  }
  addPlayer(player) {
    if (this.isVacancy()) {
      HOTEL_DATA.forEach(function(hotel) {
        let hotelName = hotel.name;
        player.addShares(hotelName, 0);
      });
      this.players.push(player);
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
  findPlayerBy(id) {
    return this.players.find(player => {
      return player.id == id;
    });
  }
  getPlayerNameOf(id) {
    if (this.findPlayerBy(id)) {
      return this.findPlayerBy(id).name;
    }
    return '';
  }
  deductMoneyFromPlayer(playerId,money){
    let player = this.findPlayerBy(playerId);
    player.deductMoney(money);
  }
  distributeMoneyToPlayer(id, money) {
    let player = this.findPlayerBy(id);
    player.addMoney(money);
  }
  getAvailableCashOf(id) {
    let player = this.findPlayerBy(id);
    return player.getAvailableCash();
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
      player.addTiles(tileBox.getNTiles(6));
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
  }
  createHotels(hotels){
    hotels.forEach((hotel) => {
      this.market.createHotel(hotel);
      this.bank.createSharesOfHotel(hotel.name,INITIAL_SHARES);
    });
  }
  giveBonus(hotelName){
    // this part is forcing us to think about our data_structure again
    let shareHolders=this.bank.getShareHoldersInDescending(hotelName);
    let majorityShareHolder=Object.keys(shareHolders[0])[0];
    let bonusAmounts=this.market.getBonusAmountsOf(hotelName);
    if (shareHolders.length>1) {
      let minorityShareHolder=Object.keys(shareHolders[1])[0];
      this.distributeMoneyToPlayer(minorityShareHolder,bonusAmounts.minority);
    }else {
      this.distributeMoneyToPlayer(majorityShareHolder,bonusAmounts.minority);
    }
    this.distributeMoneyToPlayer(majorityShareHolder,bonusAmounts.majority);
  }
  getHotel(hotelName){
    return this.market.getHotel(hotelName);
  }
  getPlayerDetails(id) {
    let player = this.findPlayerBy(id);
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
    let player = this.findPlayerBy(id);
    player.addShares(hotelName, noOfShares);
  }
  getPlayerSharesDetails(id) {
    let player = this.findPlayerBy(id);
    return player.getShareDetails();
  }
  placeTile(id, tile) {
    let currentPlayerId = this.turn.getCurrentPlayerID();
    let player = this.findPlayerBy(id);
    let playerTile = player.getTile(tile);
    let response=this.market.placeTile(playerTile);
    if(response.status){
      player.removeTile(tile);
      response.player=player;
      this.setState(response);
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
    let tiles = this.tileBox.getNTiles(1);
    let currentPlayerID = this.turn.getCurrentPlayerID();
    let currentPlayer = this.findPlayerBy(currentPlayerID);
    currentPlayer.addTile(tiles[0]);
    this.turn.setState({
      expectedActions:['placeTile']
    });
    this.turn.updateTurn();
    debugger;
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
      turnDetails:this.getTurnDetails(playerId)
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
    this.bank.giveOneFreeShare(hotelName,playerId);
    this.addSharesToPlayer(playerId,hotelName,1);
    this.setState(response);
    return response;
  }
  purchaseShares(hotelName,noOfShares,playerId){
    let player = this.findPlayerBy(playerId);
    let sharePrice = this.market.getSharePriceOfHotel(hotelName);
    let cartValue = sharePrice * noOfShares;
    if(this.bank.doesHotelhaveEnoughShares(hotelName,noOfShares)){
      player.deductMoney(cartValue);
      this.addSharesToPlayer(playerId, hotelName, noOfShares);
      this.bank.sellSharesToPlayer(hotelName,noOfShares,playerId,cartValue);
    }
    return;
  }
  getAvailableCashOfPlayer(playerId){
    let player = this.findPlayerBy(playerId);
    return player.getAvailableCash();
  }
}
module.exports = Game;
