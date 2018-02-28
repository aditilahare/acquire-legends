const assert = require('chai').assert;
const Player = require('../../src/models/player.js');

describe('Player', () => {
  describe('addTile', () => {
    it('should add given tile to player tiles', () => {
      let player = new Player(0, 'random');
      player.addTile('4A');
      assert.include(player.tiles, '4A');
    });
  });
  describe('addTiles', () => {
    it('should add given tiles to player tiles', () => {
      let player = new Player(0, 'random');
      player.addTiles(['4A', '4B']);
      assert.deepEqual(player.tiles, ['4A', '4B']);
    });
  });
  describe('getTiles', () => {
    it('should return tiles of player', () => {
      let player = new Player(0, 'random');
      player.addTile('4A');
      player.addTile('4B');
      let tiles = player.getTiles();
      assert.deepEqual(tiles, ['4A', '4B']);
    });
  });
  describe('getAvailableCash', () => {
    it('should return 0 when a player is created', () => {
      let pragya = new Player(0, 'pragya');
      let actual = pragya.getAvailableCash();
      assert.equal(actual, 0);
    });
    it('should return currently available money in player\'s account', () => {
      let pragya = new Player(0, 'pragya');
      let actual = pragya.getAvailableCash();
      assert.equal(actual, 0);
      pragya.addMoney(6000);
      actual = pragya.getAvailableCash();
      assert.equal(actual, 6000);
    });
  });
  describe('getDetails', () => {
    it('should return player detail by given id', () => {
      let expected = ['1A', '2A', '3A', '4A', '5A', '6A'];
      let pragya = new Player(0, 'pragya');
      pragya.addTiles(['1A', '2A', '3A', '4A', '5A', '6A']);
      assert.deepEqual(expected, pragya.getDetails(0).tiles);
    });
  });
  describe('getTiles', () => {
    it('should get given tile from player tiles', () => {
      let pragya = new Player(0, 'pragya');
      pragya.addTiles(['1A', '2A', '3A', '4A', '5A', '6A']);
      let expected = ['1A', '2A', '3A', '4A', '5A', '6A'];
      assert.deepEqual(expected, pragya.getTiles());
      pragya.getTile('2A');
      expected = ['1A','2A' ,'3A', '4A', '5A', '6A'];
      assert.deepEqual(expected, pragya.getTiles());
    });
  });
  describe('removeTile', () => {
    it('should remove Tile from player tiles', () => {
      let pragya = new Player(0, 'pragya');
      pragya.addTiles(['1A', '2A', '3A', '4A', '5A', '6A']);
      let expected = ['1A', '2A', '3A', '4A', '5A', '6A'];
      assert.deepEqual(expected, pragya.getTiles());
      pragya.removeTile('2A');
      expected = ['1A' ,'3A', '4A', '5A', '6A'];
      assert.deepEqual(expected, pragya.getTiles());
    });
  });
  describe('getShareDetails',()=>{
    it('should return players share details by given id',()=>{
      let expected = {phoenix:4,fusion:7};
      let Aditi = new Player(0,'Aditi');
      Aditi.addShares("phoenix",2);
      Aditi.addShares("fusion",3);
      Aditi.addShares("phoenix",2);
      Aditi.addShares("fusion",4);
      let actual = Aditi.getShareDetails();
      assert.deepEqual(expected,actual);
    });
  });
  describe('doesPlayerHasEnoughMoney',()=>{
    it('should return true if player has money enough.',()=>{
      let harvar = new Player(0,'Harvar');
      harvar.addMoney(2500);
      assert.isOk(harvar.doesPlayerHasEnoughMoney(1500));
    });
  });
  describe('deductMoney',()=>{
    it('should deduct given money from player account',()=>{
      let harvar = new Player(0,'Harvar');
      harvar.addMoney(2500);
      assert.equal(harvar.getAvailableCash(),2500);
      harvar.deductMoney(1500);
      assert.equal(harvar.getAvailableCash(),1000);
    });
  });
  describe('removeShares',()=>{
    it('it should remove given noOf shares of given hotel',()=>{
      let harvar = new Player(0,'Harvar');
      harvar.addMoney(2500);
      harvar.addShares('Zeta',3);
      assert.equal(harvar.shares.Zeta,3)
      harvar.removeShares('Zeta',2);
      assert.equal(harvar.shares.Zeta,1);
    })
  })
});
