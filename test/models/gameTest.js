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
        id:0
      };
      let actual=game.addPlayer(player);
      assert.isOk(actual);
    });
    it('should not  add given player to game when maximum \
     players reached',()=>{
      let game = new Game(0);
      let player={
        name:'pragya',
        id:0
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
  ;
  describe('areAllPlayersJoined',()=>{
    it('should return true if all players have joined',()=>{
      let game = new Game(0);
      assert.isOk(game.areAllPlayersJoined());
    });
    it('should return false if all players have not joined',()=>{
      let game = new Game(1);
      assert.isNotOk(game.areAllPlayersJoined());
    });
  });
  describe('getPlayerNameOf',()=>{
    it('should return player name of given id',()=>{
      let game = new Game(3);
      let player1={
        name:'pragya',
        id:0
      };
      let player2={
        name:'gupta',
        id:1
      };
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.equal('pragya',game.getPlayerNameOf(0));
      assert.equal('gupta',game.getPlayerNameOf(1));
      assert.equal('',game.getPlayerNameOf(2));
    });
  });
  describe('findPlayerBy',()=>{
    it('should return player of given id',()=>{
      let game = new Game(3);
      let player1={
        name:'pragya',
        id:0
      };
      let player2={
        name:'gupta',
        id:1
      };
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.deepEqual(player1,game.findPlayerBy(0));
      assert.deepEqual(player2,game.findPlayerBy(1));
      assert.deepEqual(undefined,game.findPlayerBy(2));
    });
  });
  describe('giveMoneyToPlayer',()=>{
    it('should give money to player of given id',()=>{
      let game = new Game(3);
      let player1={
        name:'pragya',
        id:0,
        availableMoney: 0,
        getAvalibleCash:function(){
          return this.availableMoney;
        },
        addMoney:function(money) {
          this.availableMoney += money;
        }
      };
      game.addPlayer(player1);
      assert.equal(game.getAvalibleCashOf(0),0);
      game.giveMoneyToPlayer(0,4000);
      assert.equal(game.getAvalibleCashOf(0),4000);
    });
  });
  describe('distributeInitialMoney',()=>{
    it('should disribute money to all players',()=>{
      let game = new Game(3);
      let player1={
        name:'pragya',
        id:0,
        availableMoney: 0,
        getAvalibleCash:function(){
          return this.availableMoney;
        },
        addMoney:function(money) {
          this.availableMoney += money;
        }
      };
      let player2={
        name:'sree',
        id:1,
        availableMoney: 0,
        getAvalibleCash:function(){
          return this.availableMoney;
        },
        addMoney:function(money) {
          this.availableMoney += money;
        }
      };
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.equal(game.getAvalibleCashOf(0),0);
      assert.equal(game.getAvalibleCashOf(1),0);
      game.distributeInitialMoney(6000);
      assert.equal(game.getAvalibleCashOf(0),6000);
      assert.equal(game.getAvalibleCashOf(1),6000);
    });
  });
});
