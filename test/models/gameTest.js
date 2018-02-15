const assert = require('chai').assert;
const Game = require('../../src/models/game.js');

describe('game test', () => {
  describe('getPlayerCount',()=>{
    it('should return the number of players',()=>{
      let game = new Game(3);
      let actual=game.getPlayerCount();
      assert.equal(actual,0);
    });
  });
  describe('addPlayer',()=>{
    it('should add given player to game when maximum players are \
    not there',()=>{
      let game = new Game(3);
      let player={
        name:'pragya',
        ID:0
      };
      let actual=game.addPlayer(player);
      assert.isOk(actual);
    });
    it('should not  add given player to game when maximum \
     players reached',()=>{
      let game = new Game(0);
      let player={
        name:'pragya',
        ID:0
      };
      let actual=game.addPlayer(player);
      assert.isNotOk(actual);
    });
  });
  describe('isVacancy',()=>{
    it('should return false if maximum players are  reached',()=>{
      let game = new Game(0);
      assert.isNotOk(game.isVacancy());
    });
    it('should return true if maximum players are not reached',()=>{
      let game = new Game(1);
      assert.isOk(game.isVacancy());
    });
  })
  ;describe('areAllPlayersJoined',()=>{
    it('should return true if all players have joined',()=>{
      let game = new Game(0);
      assert.isOk(game.areAllPlayersJoined());
    });
    it('should return false if all players have not joined',()=>{
      let game = new Game(1);
      assert.isNotOk(game.areAllPlayersJoined());
    });
  });
});