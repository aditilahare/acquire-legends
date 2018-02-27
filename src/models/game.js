const TileBox = require('./tileBox');
const Bank = require('./bank');
const Market = require('./market.js');
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
    this.activityLog=[];
    this.market = new Market();
    this.actions = {
      'Independent':function(response){
        response.expectedActions=['purchaseShares','changeTurn'];
        response.status="purchaseShares";
        if(response.activeHotels.length==0) {
          response.status="changeTurn";
        }
        return response;
      },
      'Added to hotel':function(response){
        response.expectedActions=['purchaseShares','changeTurn'];
        response.status="purchaseShares";
        return response;
      },
      'merge':function (response) {
        response.expectedActions=['deployShares'];
        response.status='merge';

        let mergingHotels=response.mergingHotels;
        let survivorHotels=response.survivorHotels;
        if (survivorHotels.length==1) {
          let survivorHotel=survivorHotels[0];
          response.survivorHotel=survivorHotel;
          let currentMergingHotel=mergingHotels[0];
          response.currentMergingHotel=currentMergingHotel
          this.mergingTurn=this.createMergingTurn(currentMergingHotel.name);
          mergingHotels.forEach((mergingHotel)=>{
            this.giveMajorityMinorityBonus(mergingHotel.name);
            // this.market.addMergingHotelToSurvivor(mergingHotel,survivorHotel);
          });
        }
        return response;
      },
      'chooseHotel':function(response){
        response.expectedActions=['purchaseShares','changeTurn'];
        if(response.inactiveHotels.length>0){
          response.expectedActions=['chooseHotel'];
          response.status="chooseHotel";
        }
        return response;
      },
      'starting hotel':function(response){
        response.expectedActions=['purchaseShares','changeTurn'];
        response.status="purchaseShares";
        return response;
      }
    };
  }
  createMergingTurn(hotelName){
    let deployers=this.bank.getAllShareHolderIds(hotelName);
    let playerSequence=this.turn.getPlayerIdSequence();
    let currentPlayerIndex=this.turn.getCurrentPlayerIndex();
    let playersBeforeCurrentPlayer=playerSequence.slice(0,currentPlayerIndex);
    let playersFromCurrentPlayer=playerSequence.slice(currentPlayerIndex);
    let sequence=playersFromCurrentPlayer.concat(playersBeforeCurrentPlayer);
    let deployersSequence=sequence.filter((id)=>{
      return deployers.includes(id);
    });
    let mergingTurn=new Turn(deployersSequence);
    return mergingTurn;
  }
  deployShares(playerId,sharesToDeploy){
    let hotelName=sharesToDeploy.hotelName;
    let state=this.turn.getState();
    let mergingHotelName=state.mergingHotels[0].name;
    let isSameHotel=(hotelName==mergingHotelName);//validate player turn
    if (isSameHotel&&this.canSharesBeDeployed(playerId,sharesToDeploy)) {
      let noOfSharesToSell=sharesToDeploy.noOfSharesToSell;
      this.playerSellsShares(playerId,noOfSharesToSell,hotelName)
      this.mergingTurn.updateTurn();
      let haveAllPlayersDeployed=(this.mergingTurn.getCurrentPlayerIndex()==0);
      if (haveAllPlayersDeployed) {
        this.endMergingProcess();
      }
    }
  }
  endMergingProcess(){
    let currentGameState=this.turn.getState();
    let survivorHotel=currentGameState.survivorHotel;
    let mergingHotels=currentGameState.mergingHotels;
    this.market.addMergingHotelsToSurvivor(mergingHotels,survivorHotel);
    this.market.placeMergingTile(currentGameState.mergingTile);
    let state={
      expectedActions:['purchaseShares'],
      status:'purchaseShares'
    }
    this.mergingTurn.clearTurn();//test
    this.turn.setState(state)
  }
  canSharesBeDeployed(playerId,sharesToDeploy){
    let hotelName=sharesToDeploy.hotelName;
    let playerShares=this.getPlayerSharesDetails(playerId);
    return playerShares[hotelName]>=sharesToDeploy.noOfSharesToSell;
  }
  playerSellsShares(playerId,noOfSharesToSell,hotelName){
    this.bank.removeSharesOfPlayer(playerId,noOfSharesToSell,hotelName);
    let player=this.findPlayerById(playerId);
    player.removeShares(hotelName,noOfSharesToSell);
    let currentSharePrice=this.market.getSharePriceOfHotel(hotelName);
    let totalMoney=currentSharePrice*noOfSharesToSell;
    this.distributeMoneyToPlayer(playerId,totalMoney);
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
      this.giveBonus(shareHolders.majority,bonusAmounts.majority);
      this.giveBonus(shareHolders.majority,bonusAmounts.minority);
    }else {
      this.giveBonus(shareHolders.majority,bonusAmounts.majority);
      this.giveBonus(shareHolders.minority,bonusAmounts.minority);
    }
  }
  giveBonus(shareHolders,totalBonus){
    let self=this;
    let bonusAmount=totalBonus/(shareHolders.length);
    shareHolders.forEach((shareHolder)=>{
      self.distributeMoneyToPlayer(shareHolder.id,bonusAmount);
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
      // response.player=player;
      this.setState(response);
    }
    this.logActivity(`${player.name} has placed ${playerTile}.`);
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
    debugger;
  }
  getTurnDetails(id){
    let turnDetails={};
    let currentPlayer=this.getCurrentPlayer();
    let otherPlayers=this.getAllPlayerDetails().filter((player)=>{
      return currentPlayer.id!=player.id;
    });
    let state=this.turn.getState();
    if (state.status=="merge") {
      turnDetails.shouldIDeploy=this.mergingTurn.isTurnOf(id);
    }
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
    let status={
      independentTiles:this.giveIndependentTiles(),
      hotelsData:this.getAllHotelsDetails(),
      turnDetails:this.getTurnDetails(playerId),
      gameActivityLog:this.activityLog,
      state:this.turn.getState()
    }
    return status;
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
    if(this.bank.doesHotelhaveEnoughShares(hotelName,noOfShares)){
      player.deductMoney(cartValue);
      this.addSharesToPlayer(playerId, hotelName, noOfShares);
      this.bank.sellSharesToPlayer(hotelName,noOfShares,playerId,cartValue);
    }
    this.logActivity(`${player.name} has bought ${noOfShares}\
       shares of ${hotelName}.`);
    // this.changeCurrentPlayer();
    return;
  }
  getAvailableCashOfPlayer(playerId){
    return this.findPlayerById(playerId).getAvailableCash();
  }
  logActivity(activity){
    this.activityLog.push(activity);
  }
  getActivityLog(){
    return this.activityLog;
  }
}
module.exports = Game;
