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
  describe('createSharesOfHotel', function(){
    it('should create shares of given hotel',()=>{
      let kotakMahindra=new Bank(100000);
      let expected = kotakMahindra.getAvailableSharesOfHotels();
      let actual = [];
      assert.deepEqual(actual,expected);
      kotakMahindra.createSharesOfHotel('zeta',23);
      expected = kotakMahindra.getAvailableSharesOfHotels();
      actual = [{hotelName:'zeta',shares:23,shareHolders:[]}];
      assert.deepEqual(actual,expected);
    });
  });
  describe('getHotelByName', function(){
    it('should get hotel by name',()=>{
      let kotakMahindra=new Bank(100000);
      kotakMahindra.createSharesOfHotel('sackson',23);
      let actual = kotakMahindra.findHotelBy("sackson");
      let expected = {hotelName:"sackson",shares:23,shareHolders:[]};
      assert.deepEqual(actual,expected);
    });
  });
  describe('giveOneFreeShare', function(){
    it('should give a free share to the player who starts the hotel',()=>{
      let kotakMahindra=new Bank(100000);
      kotakMahindra.createSharesOfHotel('sackson',23);
      let actual = kotakMahindra.getAvailableSharesOfHotels();
      let expected = [{hotelName:"sackson",shares:23,shareHolders:[]}];
      assert.deepEqual(actual,expected);
      kotakMahindra.giveOneFreeShare("sackson",'pragya');
      actual = kotakMahindra.getAvailableSharesOfHotels();
      expected = [{hotelName:"sackson",shares:22,shareHolders:['pragya']}];
      assert.deepEqual(actual,expected);
    });
  });
});
