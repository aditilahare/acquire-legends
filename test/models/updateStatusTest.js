const assert = require('chai').assert;
const UpdateStatus = require('../../src/models/updateStatus.js');

describe('updateStatus',function () {
  describe('getUpdationId',function () {
    it('should return 0 updation id is not set',function () {
      let updateStatus = new UpdateStatus();
      assert.equal(updateStatus.getUpdationId('1'),0);
    });
    it('should return updation id  which is set',function () {
      let updateStatus = new UpdateStatus();
      updateStatus.setUpdationId(2);
      assert.equal(updateStatus.getUpdationId(),2);
    });
    it('should return updation id  as 0 if player is already served',
    function () {
      let updateStatus = new UpdateStatus();
      updateStatus.setUpdationId(2);
      assert.equal(updateStatus.getUpdationId(1),2);
      assert.equal(updateStatus.getUpdationId(1),0);
    });
  });
  describe('setUpdationId',function(){
    it('should set UpdationId',function () {
      let updateStatus = new UpdateStatus();
      updateStatus.setUpdationId(1)
      assert.equal(updateStatus.updationId,1);
    });
    it('should set UpdationId',function () {
      let updateStatus = new UpdateStatus();
      updateStatus.setUpdationId(2)
      assert.equal(updateStatus.updationId,2);
    });
    it('should clear the served players list when UpdationId is set',
    function () {
      let updateStatus = new UpdateStatus();
      updateStatus.setUpdationId(2)
      updateStatus.getUpdationId(1);
      updateStatus.getUpdationId(2);
      updateStatus.setUpdationId(1)
      assert.equal(updateStatus.playersRequestedChange.length,0);
    });
  })
  describe('isPlayerServedBefore',function(){
    it('should return true if player is not served',function () {
      let updateStatus = new UpdateStatus();
      updateStatus.setUpdationId(1);
      updateStatus.getUpdationId(1);
      assert.isOk(updateStatus.hasPlayerServedBefore(1));
    });
    it('should return false if player is served',function () {
      let updateStatus = new UpdateStatus();
      updateStatus.setUpdationId(1);
      assert.isNotOk(updateStatus.hasPlayerServedBefore(1));
    })
  });
  describe('rememberPlayerIsServed',function(){
    it('should enlist player that is served',function () {
      let updateStatus = new UpdateStatus();
      updateStatus.rememberPlayerIsServed(1);
      assert.include(updateStatus.playersRequestedChange,1);
    });
  });
});
