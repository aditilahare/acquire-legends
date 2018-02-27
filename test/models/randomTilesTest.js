const assert = require('chai').assert;
const TileBox = require('../../src/models/tileBox.js');

describe('TileBox.getTiles()', ()=> {
  it('should give valid tiles',()=>{
    let tileBox = new TileBox(12,9);
    let initialTiles = tileBox.tiles.slice();
    let tiles = tileBox.getTiles(1);
    assert.includeMembers(initialTiles, tiles);
  });
});
