const assert = require('chai').assert;
const Market = require('../../src/models/market.js');

describe('Market', () => {
  describe('place a independent tile',()=>{
    it('can place a tile as a independent tile',()=>{
      let market = new Market();
      market.placeAsIndependentTile('2B');
      let actual = market.giveIndependentTiles();
      assert.deepEqual(actual,['2B']);
      market.placeAsIndependentTile('5A');
      actual = market.giveIndependentTiles();
      assert.deepEqual(actual,['2B','5A']);
    });
  });
});
