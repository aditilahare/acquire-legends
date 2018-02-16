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
});
