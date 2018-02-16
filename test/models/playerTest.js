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
});
