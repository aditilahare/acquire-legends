const assert = require('chai').assert;
const TileBox = require('../../src/models/tileBox.js');

describe('TileBox', () => {
  describe('getTiles',()=>{
    it('should return specified n number of tiles ',()=>{
      let tileBox=new TileBox(12,9);
      let firstTile=tileBox.tiles[0];
      let actual=tileBox.getTiles(6);
      assert.equal(actual.length,6);
      assert.deepEqual(actual[0],firstTile);
    });
  });
  describe('generateTiles',()=>{
    it('should generate all tiles',()=>{
      let tileBox=new TileBox(1,1);
      let expected=['1A'];
      assert.deepEqual(tileBox.generateTiles(),expected);
    });
  });
});
