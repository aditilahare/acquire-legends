const assert = require('chai').assert;
const Turn = require('../../src/models/turn.js');

describe('Turn ',()=>{
  describe('getCurrentPlayerID',()=>{
    it('should give current player id',()=>{
      let playerIDSequence=['180','200'];
      let turn = new Turn(playerIDSequence);
      let currentPlayer = turn.getCurrentPlayerID();
      assert.equal(currentPlayer,'180');
    });
  });
  describe('updateTurn',()=>{
    it('should change player turn',()=>{
      let playerIDSequence=['180','200'];
      let turn = new Turn(playerIDSequence);
      turn.updateTurn();
      assert.equal( turn.getCurrentPlayerID(),'200');
    });
  });
});
