const assert = require('chai').assert;
const areTilesAdjacent = require('../../src/utils/tileUtilities.js').areTilesAdjacent;

describe('areTilesAdjacent is one of tileUtilities', () => {
  describe('areTilesAdjacent',()=>{
    it('should return true when given 1A & 1B',()=>{
      assert.ok(areTilesAdjacent('1A','1B'));
    });
    it('should return false when given 1A & 2B',()=>{
      assert.notOk(areTilesAdjacent('1A','2B'));
    });
  });
});
