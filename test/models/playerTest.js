const assert = require('chai').assert;
const Player = require('../../src/models/player.js');

describe('Player', () => {
  describe('addTile',()=>{
    it('should add given tile to player tiles',()=>{
      let player = new Player(0,'random');
      player.addTile('4A');
      assert.include(player.tiles,'4A');
    });
  });
  describe('addTiles',()=>{
    it('should add given tiles to player tiles',()=>{
      let player = new Player(0,'random');
      player.addTiles(['4A','4B']);
      assert.deepEqual(player.tiles,['4A','4B']);
    });
  });
  describe('getTiles',()=>{
    it('should return tiles of player',()=>{
      let player = new Player(0,'random');
      player.addTile('4A');
      player.addTile('4B');
      let tiles=player.getTiles();
      assert.deepEqual(tiles,['4A','4B']);
    });
  });
  describe('getAvalibleCash',()=>{
    it('should return 0 when a player is created',()=>{
      let pragya=new Player(0,'pragya');
      let actual = pragya.getAvalibleCash();
      assert.equal(actual,0);
    });
    it('should return currently available money in player\'s account',()=>{
      let pragya=new Player(0,'pragya');
      let actual = pragya.getAvalibleCash();
      assert.equal(actual,0);
      pragya.addMoney(6000);
      actual = pragya.getAvalibleCash();
      assert.equal(actual,6000);
    });
  });
});
