const assert = require('chai').assert;
const Hotel = require('../../src/models/hotel.js');

describe('Hotel test', function(){
  describe('getDetails', function(){
    it('should return object of hotel name and color', function(){
      let zeta=new Hotel('zeta','yellow');
      let expected={
        name:'zeta',
        color:'yellow'
      };
      assert.deepEqual(zeta.getDetails(),expected);
    });
  });
});
