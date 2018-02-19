/*eslint max-len: ["error", { "ignoreStrings": true }]*/
const assert = require('chai').assert;
const Game = require('../../src/models/game.js');
const Player = require('../../src/models/player.js');
const Hotel = require('../../src/models/hotel.js');


describe('game test', function(){
  describe('getPlayerCount', () => {
    it('should return the number of players', () => {
      let game = new Game(3);
      let actual = game.getPlayerCount();
      assert.equal(actual, 0);
    });
  });
  describe('addPlayer', () => {
    it('should add given player to game when maximum players are not there', () => {
      let game = new Game(3);
      let player = new Player(0,'pragya');
      let actual = game.addPlayer(player);
      assert.isOk(actual);
    });
    it('should not  add given player to game when maximum \
     players reached', () => {
      let game = new Game(0);
      let player = {
        name: 'pragya',
        id: 0
      };
      let actual = game.addPlayer(player);
      assert.isNotOk(actual);
    });
  });
  describe('isVacancy', () => {
    it('should return false if maximum players are  reached', () => {
      let game = new Game(0);
      assert.isNotOk(game.isVacancy());
    });
    it('should return true if maximum players are not reached', () => {
      let game = new Game(1);
      assert.isOk(game.isVacancy());
    });
  });
  describe('haveAllPlayersJoined', () => {
    it('should return true if all players have joined', () => {
      let game = new Game(0);
      assert.isOk(game.haveAllPlayersJoined());
    });
    it('should return false if all players have not joined', () => {
      let game = new Game(1);
      assert.isNotOk(game.haveAllPlayersJoined());
    });
  });
  describe('getPlayerNameOf', () => {
    it('should return player name of given id', () => {
      let game = new Game(3);
      let player1 = new Player(0,'pragya');
      let player2 = new Player(1,'gupta');
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.equal('pragya', game.getPlayerNameOf(0));
      assert.equal('gupta', game.getPlayerNameOf(1));
      assert.equal('', game.getPlayerNameOf(2));
    });
  });
  describe('distributeInitialTiles', () => {
    it('should give 6 tiles to all players', () => {
      let game = new Game(2);
      let veera = new Player(0, 'veera');
      let aditi = new Player(0, 'aditi');
      game.addPlayer(veera);
      game.addPlayer(aditi);
      game.distributeInitialTiles();
      assert.deepEqual(veera.getTiles(), ['1A', '2A', '3A', '4A', '5A', '6A']);
      assert.deepEqual(aditi.getTiles(), ['7A', '8A', '9A', '10A', '11A', '12A']);
    });
  });
  describe('findPlayerBy', () => {
    it('should return player of given id', () => {
      let game = new Game(3);
      let player1 = new Player(0,'pragya');
      let player2 = new Player(1,'gupta');
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.deepEqual(player1, game.findPlayerBy(0));
      assert.deepEqual(player2, game.findPlayerBy(1));
      assert.deepEqual(undefined, game.findPlayerBy(2));
    });
  });
  describe('disrtibuteMoneyToPlayer', () => {
    it('should give money to player of given id', () => {
      let game = new Game(3);
      let player1 = new Player(0,'pragya');
      game.addPlayer(player1);
      assert.equal(game.getAvailableCashOf(0), 0);
      game.disrtibuteMoneyToPlayer(0, 4000);
      assert.equal(game.getAvailableCashOf(0), 4000);
    });
  });
  describe('distributeInitialMoney', () => {
    it('should disribute money to all players', () => {
      let game = new Game(3);
      let player1 = new Player(0,'pragya');
      let player2 = new Player(1,'sree');
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.equal(game.getAvailableCashOf(0), 0);
      assert.equal(game.getAvailableCashOf(1), 0);
      game.distributeInitialMoney(6000);
      assert.equal(game.getAvailableCashOf(0), 6000);
      assert.equal(game.getAvailableCashOf(1), 6000);
    });
  });
  describe('start', () => {
    it('should disribute money and tiles to all players and create hotels', () => {
      let game = new Game(2);
      let player1 = new Player(0, 'veera');
      let player2 = new Player(1, 'pragya');
      let hydraHotel = {
        name: 'Hydra',
        color: 'orange'
      };

      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.equal(game.getAvailableCashOf(0), 0);
      assert.equal(game.getAvailableCashOf(1), 0);
      game.start();
      assert.deepEqual(game.getHotel('Hydra'),hydraHotel);
      assert.equal(game.getAvailableCashOf(0), 6000);
      assert.equal(game.getAvailableCashOf(1), 6000);
      assert.deepEqual(player1.getTiles(), ['1A', '2A', '3A', '4A', '5A', '6A']);
      assert.deepEqual(player2.getTiles(), ['7A', '8A', '9A', '10A', '11A', '12A']);
    });
  });
  describe('createHotels', () => {
    it('should create hotels for the given names and colors', () => {
      let game = new Game(2);
      let hotelsData = [{
        name: 'zeta',
        color: 'yellow'
      }];
      let zetaHotel = {
        name: 'zeta',
        color: 'yellow'
      };
      game.createHotels(hotelsData);
      assert.deepEqual(game.getHotel('zeta'),zetaHotel);
    });
  });
  describe('getPlayerDetails',()=>{
    it('should return an object containig player details',()=>{
      let game = new Game(2);
      let expected = ['1A','2A','3A','4A','5A','6A'];
      let player1=new Player(0,'veera');
      let player2=new Player(1,'pragya');
      game.addPlayer(player1);
      game.addPlayer(player2);
      player1.addTiles(['1A','2A','3A','4A','5A','6A']);
      assert.deepEqual(game.getPlayerDetails(0).tiles,expected);
    });
    it('should return an object containing share details of player',()=>{
      let game = new Game(2);
      let aditi = new Player(0,'aditi');
      let harvar = new Player(1,'harvar');
      let expected = {phoenix:2,hydra:5};
      game.addPlayer(aditi);
      game.addPlayer(harvar);
      aditi.addShares('Phoenix',5);
      harvar.addShares('Hydra',2);
      assert.include(game.getPlayerSharesDetails(0),{Phoenix:5});
      assert.include(game.getPlayerSharesDetails(1),{Hydra:2});
    });
  });
  describe('isInPlayMode',()=>{
    it('should return false when game is not in play mode ',()=>{
      let game = new Game(2);
      let player1=new Player(0,'veera');
      let player2=new Player(1,'pragya');
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.isNotOk(game.isInPlayMode());
    });
    it('should return true if game is in play mode ',()=>{
      let game = new Game(2);
      let player1=new Player(0,'veera');
      let player2=new Player(1,'pragya');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.start();
      assert.isOk(game.isInPlayMode());
    });
  });
  describe('getAllHotelsDetails', function(){
    it('can tell all the hotel details in game', function(){
      let game = new Game(2);
      let hotelsData = [{
        name: 'zeta',
        color: 'yellow'
      }];
      let expected = [new Hotel('zeta','yellow')];
      game.createHotels(hotelsData);
      assert.deepEqual(game.getAllHotelsDetails(),expected);
    });
  });
  describe('getAllPlayerNames',()=>{
    it('can give empty list if no player is present',()=>{
      let game = new Game(2);
      assert.deepEqual(game.getAllPlayerNames(),[]);
    });
    it('can give all player names',()=>{
      let game = new Game(2);
      let player1=new Player(0,'veera');
      let player2=new Player(1,'pragya');
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.deepEqual(game.getAllPlayerNames(),['veera','pragya']);
    });
  });
  describe('addSharesToPlayer',()=>{
    it('should add shares to player by given id',()=>{
      let game = new Game(2);
      let player1=new Player(0,'aditi');
      let player2=new Player(1,'harvar');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addSharesToPlayer(0,'Phoenix',2);
      game.addSharesToPlayer(1,'Hydra',5);
      assert.include(game.getPlayerSharesDetails(0),{Phoenix:2});
      assert.include(game.getPlayerSharesDetails(1),{Hydra:5});
    });
  });
});
