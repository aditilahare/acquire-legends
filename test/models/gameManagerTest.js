const chai = require('chai');
const assert = chai.assert;

const Game = require('../../src/models/game.js');
const GameManager = require('../../src/models/gameManager.js');
const MockDate = require('../helpers/mockDate.js');

describe('GameManager', () => {
  describe('addGame()', () => {
    it('should add the game and increment currentGameId', () => {
      let manager = new GameManager(MockDate);
      manager.addGame(new Game(2), 'Frank');
      let expectedGames = {
        '1':{
          gameId: 1,
          createdBy: 'Frank',
          date: '11/11/1111',
          game: new Game(2),
          playersJoined: 0
        }
      };
      assert.equal(manager.currentGameId, 2);
      assert.deepEqual(manager.games, expectedGames);
    });
  });
  describe('getGameById()', () => {
    it('should get the game for valid id', () => {
      let manager = new GameManager(MockDate);
      manager.addGame(new Game(2), 'Frank');
      manager.addGame(new Game(1), 'Martin');
      let expectedGame = new Game(2);
      assert.deepEqual(manager.getGameById(1), new Game(2));
    });
  });
  describe('getGameInfoById', () => {
    it('should return game info for valid game id', () => {
      let manager = new GameManager(MockDate);
      manager.addGame(new Game(1), 'Frank');
      manager.addGame(new Game(2), 'Martin');
      let expectedInfo = {
        gameId: 1,
        createdBy: 'Frank',
        date: '11/11/1111',
        playersJoined: 0
      };
      assert.deepEqual(manager.getGameInfoById(1), expectedInfo)
    });
  });
  describe('getAllGamesInfo', () => {
    it('should return all games info', () => {
      let manager = new GameManager(MockDate);
      manager.addGame(new Game(1), 'Frank');
      manager.addGame(new Game(2), 'Martin');
      let expectedInfo =[
        {
          gameId: "1",
          createdBy: 'Frank',
          date: '11/11/1111',
          playersJoined: 0
        },
        {
          gameId: "2",
          createdBy: 'Martin',
          date: '11/11/1111',
          playersJoined: 0
        } ];
        assert.deepEqual(manager.getAllGamesInfo(), expectedInfo);
    });
  });

  describe('quitGame()', () => {
    it('should delete the game when game has ended', () => {
      let manager = new GameManager(MockDate);
      let game1 = new Game(1);
      let game2 = new Game(2);
      game1.MODE='END';
      manager.addGame(game1, 'Frank');
      manager.addGame(game2, 'Martin');

      let expectedInfo =[
        {
          gameId: "2",
          createdBy: 'Martin',
          date: '11/11/1111',
          playersJoined: 0
        } ];
        manager.quitGame(1);
        assert.deepEqual(manager.getAllGamesInfo(), expectedInfo);
    });
  });
  describe('getAvailableIdForGame()', () => {
    it('should return the game id', () => {
      let manager = new GameManager(MockDate);
      let game1 = new Game(1);
      assert.equal(manager.getAvailableIdForGame(),1);
      manager.addGame(game1, 'Frank');
      let game2 = new Game(1);
      assert.equal(manager.getAvailableIdForGame(),2);
      manager.addGame(game2, 'Harshad');
      assert.equal(manager.getAvailableIdForGame(),3);

    });
  });
  describe('isValidGame()', () => {
    it('should return true when game is valid', () => {
      let manager = new GameManager(MockDate);
      let game1 = new Game(1);
      manager.addGame(game1, 'Frank');
      assert.isOk(manager.isValidGame(1));
    });
    it('should return false when game is invalid', () => {
      let manager = new GameManager(MockDate);
      assert.isNotOk(manager.isValidGame(1));
    });
  });
});
