const chai = require('chai');
const assert = chai.assert;

const MockDate = require('../helpers/mockDate.js');

describe('MockDate', () => {
  describe('toLocaleString', () => {
    it('should return \'11/11/1111\'', () => {
      let date = new MockDate('11/11/1111');
      let expectedDate = '11/11/1111';
      assert.equal(date.toLocaleString(), expectedDate);
    });
  });
});
