const chai = require('chai');
const assert = chai.assert;

let TileBox = require('../../src/models/tileBox.js')
const Game = require('../../src/models/game.js');
const GameManager = require('../../src/models/gameManager.js');
const MockDate = require('../helpers/mockDate.js');
const mockRandomTiles = require('../helpers/mockRandomTiles.js').getTiles;


describe('GameManager', () => {
  describe('addGame()', () => {
    it('should add the game and increment currentGameId', () => {
      let tileBox = new TileBox(12, 9, mockRandomTiles);
      let manager = new GameManager(MockDate);
      manager.addGame(new Game(2, tileBox), 'Frank');
      let expectedGames = {
        '1':{
          gameId: 1,
          createdBy: 'Frank',
          date: '11/11/1111',
          game: new Game(2, tileBox),
          playersJoined: 0,
          maxPlayers : 2
        }
      };
      assert.equal(manager.currentGameId, 2);
      assert.deepEqual(manager.games, expectedGames);
    });
  });
  describe('getGameById()', () => {
    it('should get the game for valid id', () => {
      let tileBox = new TileBox(12, 9, mockRandomTiles);
      let manager = new GameManager(MockDate);
      manager.addGame(new Game(2, tileBox), 'Frank');
      manager.addGame(new Game(1, tileBox), 'Martin');
      let expectedGame = new Game(2, tileBox);
      assert.deepEqual(manager.getGameById(1), expectedGame);
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
        playersJoined: 0,
        maxPlayers : 1
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
          playersJoined: 0,
          maxPlayers : 1
        },
        {
          gameId: "2",
          createdBy: 'Martin',
          date: '11/11/1111',
          playersJoined: 0,
          maxPlayers : 2
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
          playersJoined: 0,
          maxPlayers : 2
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
  describe('getAvailableGamesInfo()',()=>{
    it('should return information of game which is in wait mode',()=>{
      let manager = new GameManager(MockDate);
      let game1 = new Game(1);
      game1.MODE = 'play';
      let game2 = new Game(1);
      let game3 = new Game(1);
      manager.addGame(game1, 'Sachin');
      manager.addGame(game2, 'Sachu');
      manager.addGame(game3, 'Into');
      let expected = [
        {
          gameId:'2',
          createdBy:'Sachu',
          date:'11/11/1111',
          playersJoined: 0,
          maxPlayers : 1
        },
        {
          gameId:'3',
          createdBy:'Into'
          ,date:'11/11/1111',
          playersJoined: 0,
          maxPlayers : 1
        }];
      assert.deepEqual(manager.getAvailableGamesInfo(),expected);

    })
  })
});
