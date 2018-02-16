/*eslint max-len: ["error", { "ignoreStrings": true }]*/
const assert = require('chai').assert;
const Game = require('../../src/models/game.js');
const Player = require('../../src/models/player.js');


describe('game test', () => {
  describe('getPlayerCount', () => {
    it('should return the number of players', () => {
      let game = new Game(3);
      let actual = game.getPlayerCount();
      assert.equal(actual, 0);
    });
  });
  describe('addPlayer', () => {
    it('should add given player to game when maximum players are not there', () => {
      let game = new Game(3);
      let player = {
        name: 'pragya',
        id: 0
      };
      let actual = game.addPlayer(player);
      assert.isOk(actual);
    });
    it('should not  add given player to game when maximum \
     players reached', () => {
      let game = new Game(0);
      let player = {
        name: 'pragya',
        id: 0
      };
      let actual = game.addPlayer(player);
      assert.isNotOk(actual);
    });
  });
  describe('isVacancy', () => {
    it('should return false if maximum players are  reached', () => {
      let game = new Game(0);
      assert.isNotOk(game.isVacancy());
    });
    it('should return true if maximum players are not reached', () => {
      let game = new Game(1);
      assert.isOk(game.isVacancy());
    });
  });
  describe('haveAllPlayersJoined', () => {
    it('should return true if all players have joined', () => {
      let game = new Game(0);
      assert.isOk(game.haveAllPlayersJoined());
    });
    it('should return false if all players have not joined', () => {
      let game = new Game(1);
      assert.isNotOk(game.haveAllPlayersJoined());
    });
  });
  describe('getPlayerNameOf', () => {
    it('should return player name of given id', () => {
      let game = new Game(3);
      let player1 = {
        name: 'pragya',
        id: 0
      };
      let player2 = {
        name: 'gupta',
        id: 1
      };
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.equal('pragya', game.getPlayerNameOf(0));
      assert.equal('gupta', game.getPlayerNameOf(1));
      assert.equal('', game.getPlayerNameOf(2));
    });
  });
  describe('distributeInitialTiles', () => {
    it('should give 6 tiles to all players', () => {
      let game = new Game(2);
      let veera = new Player(0, 'veera');
      let aditi = new Player(0, 'aditi');
      game.addPlayer(veera);
      game.addPlayer(aditi);
      game.distributeInitialTiles();
      assert.deepEqual(veera.getTiles(), ['1A', '2A', '3A', '4A', '5A', '6A']);
      assert.deepEqual(aditi.getTiles(), ['7A', '8A', '9A', '10A', '11A', '12A']);
    });
  });
  describe('findPlayerBy', () => {
    it('should return player of given id', () => {
      let game = new Game(3);
      let player1 = {
        name: 'pragya',
        id: 0
      };
      let player2 = {
        name: 'gupta',
        id: 1
      };
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.deepEqual(player1, game.findPlayerBy(0));
      assert.deepEqual(player2, game.findPlayerBy(1));
      assert.deepEqual(undefined, game.findPlayerBy(2));
    });
  });
  describe('disrtibuteMoneyToPlayer', () => {
    it('should give money to player of given id', () => {
      let game = new Game(3);
      let player1 = {
        name: 'pragya',
        id: 0,
        availableMoney: 0,
        getAvailableCash: function() {
          return this.availableMoney;
        },
        addMoney: function(money) {
          this.availableMoney += money;
        }
      };
      game.addPlayer(player1);
      assert.equal(game.getAvailableCashOf(0), 0);
      game.disrtibuteMoneyToPlayer(0, 4000);
      assert.equal(game.getAvailableCashOf(0), 4000);
    });
  });
  describe('distributeInitialMoney', () => {
    it('should disribute money to all players', () => {
      let game = new Game(3);
      let player1 = {
        name: 'pragya',
        id: 0,
        availableMoney: 0,
        getAvailableCash: function() {
          return this.availableMoney;
        },
        addMoney: function(money) {
          this.availableMoney += money;
        }
      };
      let player2 = {
        name: 'sree',
        id: 1,
        availableMoney: 0,
        getAvailableCash: function() {
          return this.availableMoney;
        },
        addMoney: function(money) {
          this.availableMoney += money;
        }
      };
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.equal(game.getAvailableCashOf(0), 0);
      assert.equal(game.getAvailableCashOf(1), 0);
      game.distributeInitialMoney(6000);
      assert.equal(game.getAvailableCashOf(0), 6000);
      assert.equal(game.getAvailableCashOf(1), 6000);
    });
  });
  describe('start', () => {
    it('should disribute money and tiles to all players and create hotels', () => {
      let game = new Game(2);
      let player1 = new Player(0, 'veera');
      let player2 = new Player(1, 'pragya');
      let hotelsData = [{
        name: 'zeta',
        color: 'yellow'
      }];
      let zetaHotel = {
        name: 'zeta',
        color: 'yellow'
      }

      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.equal(game.getAvailableCashOf(0), 0);
      assert.equal(game.getAvailableCashOf(1), 0);
      game.start();
      assert.deepEqual(game.getHotel('zeta'),zetaHotel);
      assert.equal(game.getAvailableCashOf(0), 6000);
      assert.equal(game.getAvailableCashOf(1), 6000);
      assert.deepEqual(player1.getTiles(), ['1A', '2A', '3A', '4A', '5A', '6A']);
      assert.deepEqual(player2.getTiles(), ['7A', '8A', '9A', '10A', '11A', '12A']);
    });
  });
  describe('createHotels', () => {
    it('should create hotels for the given names and colors', () => {
      let game = new Game(2);
      let hotelsData = [{
        name: 'zeta',
        color: 'yellow'
      }];
      let zetaHotel = {
        name: 'zeta',
        color: 'yellow'
      }
      game.createHotels(hotelsData);
      assert.deepEqual(game.getHotel('zeta'),zetaHotel);
    });
  });
});
