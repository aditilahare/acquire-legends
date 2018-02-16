const assert = require('chai').assert;
const Player = require('../../src/models/player.js');

describe('player test', () => {
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
