const assert = require('chai').assert;
const Bank = require('../../src/models/bank.js');

describe('Bank test', () => {
  describe('getAvailableCash',()=>{
    it('should return currently available cash in bank',()=>{
      let kotakMahindra=new Bank(100000);
      let actual = kotakMahindra.getAvalibleCash();
      assert.equal(actual,100000);
    });
  });
  describe('reduceMoney', function(){
    it('should reduce cash from bank',()=>{
      let kotakMahindra=new Bank(100000);
      let actual = kotakMahindra.getAvalibleCash();
      assert.equal(actual,100000);
      kotakMahindra.reduceMoney(1);
      actual = kotakMahindra.getAvalibleCash();
      assert.equal(actual,99999);
    });
  });
});
