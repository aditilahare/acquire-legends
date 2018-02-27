const assert = require('chai').assert;
let TileBox = require('../../src/models/tileBox.js');
const mockRandomTiles = require('../helpers/mockRandomTiles.js').getTiles;

describe('TileBox', () => {
  describe('getTiles',()=>{
    beforeEach(() => {
      tileBox=new TileBox(12,9,mockRandomTiles);
    });
    it('should return specified n number of tiles ',()=>{

      let firstTile=tileBox.tiles[0];
      let actual=tileBox.getTiles(6);
      assert.equal(actual.length,6);
      assert.deepEqual(actual[0],firstTile);
    });
    it('should return n random tiles', () => {
      assert.equal(tileBox.tiles.length,108);
      tileBox.getTiles(6);
      assert.equal(tileBox.tiles.length, 102);
    });
  });
  describe('generateTiles',()=>{
    it('should generate all tiles',()=>{
      let tileBox=new TileBox(1,1);
      let expected=['1A'];
      assert.deepEqual(tileBox.generateTiles(),expected);
    });
  });
  describe('removeTile', () => {
    it('should remove a specific tile from the tiles', () => {
      let tileBox = new TileBox(1,1);
      assert.deepEqual(tileBox.tiles.length,1);
      assert.isOk(tileBox.removeTile(0));
      assert.deepEqual(tileBox.tiles.length,0);
    });
    it('should not remove tile from the tiles for invalid index', () => {
      let tileBox = new TileBox(1,1);
      assert.deepEqual(tileBox.tiles.length,1);
      assert.isNotOk(tileBox.removeTile(10));
      assert.deepEqual(tileBox.tiles.length,1);
    });
  })

});
