const assert = require('chai').assert;
const orderPlayers = require('../../src/utils/orderPlayers.js').orderPlayers;

describe('OrderPlayers', () => {
  describe('#orderPlayers', () => {
    it('should return the ordered player list for single player', () => {
      let player = [{name:'harshad',id:1,tiles:['5A']}];
      let expectedOrder = [1];
      assert.deepEqual(orderPlayers(player),expectedOrder);
    });
    it('should return the ordered players list for multiple players', () => {
      let players = [
        {name:'harshad',id:1,tiles:['5A']},
        {name:'omkar',id:2,tiles:['3A']},
        {name:'harshad',id:3,tiles:['1B']},
        {name:'sachin',id:4,tiles:['1A']}
      ];
      let expectedOrder = [4,3,2,1];
      assert.deepEqual(orderPlayers(players),expectedOrder);
    });
    it('should return empty list for empty players list', () => {
      let player = [];
      let expectedOrder = [];
      assert.deepEqual(orderPlayers(player),expectedOrder);
    });
  });
});
