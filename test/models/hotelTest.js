const assert = require('chai').assert;
const Hotel = require('../../src/models/hotel.js');

describe('Hotel test', function(){
  describe('getDetails', function(){
    it('should return object of hotel name and color', function(){
      let zeta=new Hotel('zeta','yellow');
      let expected={
        name:'zeta',
        color:'yellow',
        shares:25
      };
      assert.deepEqual(zeta.getDetails(),expected);
    });
    it('should return object of hotel name and color', function(){
      let zeta=new Hotel('zeta','yellow',100);
      let expected={
        name:'zeta',
        color:'yellow',
        shares:100
      };
      assert.deepEqual(zeta.getDetails(),expected);
    });
  });
});
