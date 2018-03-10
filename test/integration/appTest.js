/*eslint max-len: ["error", { "ignoreStrings": true }]*/
/*eslint max-statements: ["error", 20, { "ignoreTopLevelFunctions": true }]*/
/*eslint-env es6*/
const chai = require('chai');
const assert = chai.assert;
const app = require('../../app.js');
let Game = require('../../src/models/game.js');
const GameManager = require('../../src/models/gameManager.js');


let TileBox = require('../../src/models/tileBox.js');
const Player = require('../../src/models/player.js');
const request = require('supertest');
const shouldHaveIdCookie = require('../helpers/rh.js').shouldHaveIdCookie;
const MockFs = require('../helpers/fsSimulator.js');
const mockRandomTiles = require('../helpers/mockRandomTiles.js').getTiles;

describe('App Test', () => {
  let tileBox;
  beforeEach(() => {
    app.gameManager = new GameManager();
    tileBox = new TileBox(12, 9, mockRandomTiles);
  });
  describe('/join', () => {
    it('should add player and redirect to waiting page', (done) => {
      let manager = app.gameManager;
      let game = new Game(3, tileBox);
      manager.addGame(game,'Aditi');
      request(app)
        .post('/join')
        .send('playerName=Aditi&gameId=1')
        .expect(302)
        .expect('Location', '/wait')
        .expect(shouldHaveIdCookie)
        .end(done);
    });
    it('should not allow players to join if  maximum players joined', (done) => {
      let manager = app.gameManager;
      let game = new Game(1, tileBox);
      game.addPlayer(new Player(1, 'veera'));
      manager.addGame(game,'veera');

      request(app)
        .post('/join')
        .send('playerName=Aditi')
        .expect(/Maximum number of players joined/)
        .end(done);
    });
  });
  describe('/create', () => {
    it('should display error message when game is already created ', (done) => {
      request(app)
        .post('/create')
        .send('playerName=Aditi&numberOfPlayers=3')
        .expect(302)
        .expect('Location','/wait')
        .end(done);
    });
    it('should create game and add the payer to game ', (done) => {
      delete app.game;
      request(app)
        .post('/create')
        .send('playerName=Aditi&numberOfPlayers=3')
        .expect(302)
        .expect('Location', '/wait')
        .expect(shouldHaveIdCookie)
        .end(done);
    });
  });
  describe('/haveAllPlayersJoined', function() {
    it('should respond with true if all players have joined', function(done) {
      let manager = app.gameManager;
      let game = new Game(1, tileBox);
      game.addPlayer(new Player(0, 'Frank'));
      manager.addGame(game, 'Frank');

      request(app)
        .get('/haveAllPlayersJoined')
        .set('Cookie', ['playerId=0', 'gameId=1'])
        .expect(200)
        .expect(/true/)
        .end(done);
    });
    it('should respond with 302 if all players have joined\
     \and bad cookie', function(done) {
      let manager = app.gameManager;
      let game = new Game(1, tileBox);
      game.addPlayer(new Player(0, 'Frank'));
      manager.addGame(game, 'Frank');

      request(app)
        .get('/haveAllPlayersJoined')
        .set('Cookie',['playerId=555','gameId=1'])
        .expect(302)
        .end(done);
    });
    it('should respond with false if all players\
       have not joined', function(done) {
      let manager = app.gameManager;
      let game = new Game(2, tileBox);
      game.addPlayer(new Player(0, 'Frank'));
      manager.addGame(game, 'Frank');

      request(app)
        .get('/haveAllPlayersJoined')
        .set('Cookie',['playerId=0','gameId=1'])
        .expect(200)
        .expect(/false/)
        .end(done);
    });
    it('should respond with true if all players\
       have not joined', function(done) {
      let manager = app.gameManager;
      let game = new Game(2, tileBox);
      game.addPlayer(new Player(0, 'Frank'));
      game.addPlayer(new Player(1, 'Martin'));
      manager.addGame(game, 'Frank');

      request(app)
        .get('/haveAllPlayersJoined')
        .set('Cookie', ['playerId=0', 'gameId=1'])
        .expect(200)
        .expect(/true/)
        .end(done);
    });
  });
  describe('/wait', function() {
    it('should serve the waiting page', function(done) {
      let fs = new MockFs();
      let fileName = './public/waitingPage.html';
      let content = 'Waiting For Other Players To Join';
      let manager = app.gameManager;
      let game = new Game(2, tileBox);
      fs.addFile(fileName, content);
      game.addPlayer(new Player(0, 'pragya'));
      manager.addGame(game, 'Frank');

      app.fs = fs;
      request(app)
        .get('/wait')
        .set('Cookie', ['playerId=0', 'gameId=1'])
        .expect(200)
        .expect(/waiting for Other Players to join/i)
        .end(done);
    });
    it('should be redirected to /game.html\
    \ if game has started', function(done) {
      let manager = app.gameManager;
      let game = new Game(2, tileBox);
      game.addPlayer(new Player(0, 'Frank'));
      game.addPlayer(new Player(1, 'Martin'));
      game.start();
      manager.addGame(game, 'Frank');

      request(app)
        .get('/wait')
        .set('Cookie', ['playerId=1', 'gameId=1'])
        .expect(302)
        .expect('Location', '/game.html')
        .end(done);
    })
    it('should be redirected to /\
    \ if game is not created', function(done) {
      app.manager = new GameManager();
      let manager = app.gameManager;
      console.log(manager,"hi");

      request(app)
        .get('/wait')
        .set('Cookie', ['playerId=1'])
        .expect(302)
        .expect('Location', '/')
        .end(done);
    })
    it('should be redirected to /\
    \ for valid cookie if game has not started', function(done) {
      let manager = app.gameManager;
      let game = new Game(2, tileBox);
      app.fs = new MockFs();
      let content = 'Waiting For Other Players To Join';
      app.fs.addFile('./public/waitingPage.html', content);
      game.addPlayer(new Player(0, 'Frank'));
      manager.addGame(game, 'Frank');

      request(app)
        .get('/wait')
        .set('Cookie', ['playerId=0', 'gameId=1'])
        .expect(200)
        .expect(/Waiting For Other Players To Join/)
        .end(done);
    })
    it('should be redirected to /\
    \ for invalid cookie if game is not created', function(done) {
      let manager = app.gameManager;
      request(app)
        .get('/wait')
        .set('Cookie', ['playerId=56556'])
        .expect(302)
        .end(done);
    })
  });
  describe('/join.html /wait /game', function() {
    it('should redirect to / when game is not created', function(done) {
      delete app.game;
      let manager = app.gameManager;
      request(app)
        .get('/wait')
        .expect(302)
        .expect('Location', '/')
        .end(done);
    });
  });
  describe('/', function() {
    it('should redirect to /wait when\
    \ already registered player comes to', function(done) {
      game = new Game(2, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      app.gameManager.addGame(game, 'veera');
      request(app)
        .get('/')
        .set('Cookie', ['playerId=0','gameId=1'])
        .expect(302)
        .expect('Location', '/wait')
        .end(done);
    });
  });
  describe('/getPlayerDetails', function() {
    it('should give details of player with given valid id\
     when game has started', function(done) {
      let manager = app.gameManager;
      game = new Game(1, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      manager.addGame(game, 'veera')
      // app.game.start();
      request(app)
        .get('/playerDetails')
        .set('Cookie', ['playerId=0', 'gameId=1'])
        .expect(200)
        .expect(/tiles/i)
        .end(done);
    });
    it('should give 403 for player with given id\
     when game is in wait mode', function(done) {
      let manager = app.gameManager;
      let game = new Game(2, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      manager.addGame(game, 'veera');
      request(app)
        .get('/playerDetails')
        .set('Cookie', ['playerId=0', 'gameId=1'])
        .expect(403)
        .end(done);
    });
    it('should give tiles of player with given id', function(done) {
      let manager = app.gameManager;
      let game = new Game(1, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      manager.addGame(game, 'veera');
      request(app)
        .get('/playerDetails')
        .set('Cookie', ['playerId=0', 'gameId=1'])
        .expect(200)
        .expect(/availableMoney/i)
        .end(done);
    });
    it('should give name of player with given id', function(done) {
      let manager = app.gameManager;
      let game = new Game(1, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      manager.addGame(game, 'veera');
      request(app)
        .get('/playerDetails')
        .set('Cookie', ['playerId=0', 'gameId=1'])
        .expect(200)
        .expect(/"name":/i)
        .end(done);
    });
  });
  describe('/game.html', function() {
    it('should get game page once all players join', function(done) {
      let manager = app.gameManager;
      let game = new Game(1, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      manager.addGame(game, 'veera');
      request(app)
        .get('/game.html')
        .set('Cookie', ['playerId=0', 'gameId=1'])
        .expect(200)
        .expect(/hotels/i)
        .end(done);
    });
  });
  describe('/getAllPlayerNames', function() {
    it('can give all player names who have joined the game', function(done) {
      let manager = app.gameManager;
      let game = new Game(1, tileBox);
      game.addPlayer(new Player(0, 'pragya'));
      manager.addGame(game, 'pragya');
      request(app)
        .get('/getAllPlayerNames')
        .set('Cookie', ['playerId=0', 'gameId=1'])
        .expect(200)
        .expect(/pragya/)
        .end(done);
    });
  });
  describe('/placeTile', function() {
    it('should allow player to place own tile', function(done) {
      let manager = app.gameManager;
      let game = new Game(1, tileBox);
      game.addPlayer(new Player(0, 'pragya'));
      game.start();
      manager.addGame(game, 'pragya');
      request(app)
        .post('/actions/placeTile')
        .set('Cookie', ['playerId=0', 'gameId=1'])
        .send("tile=2A")
        .expect(200)
        .end(done);
    });
    it('should respond with disposeShares status when merger tile is placed', function(done) {
      let manager = app.gameManager;
      let game = new Game(4,tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      let player4 = new Player(3, 'specailPlayer');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.addPlayer(player4);
      manager.addGame(game,'pragya');
      game.start();

      game.placeTile(0, '5A');
      game.startHotel('Zeta', 0);
      game.purchaseShares('Zeta', 2, 0)
      game.changeCurrentPlayer();
      game.placeTile(0, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.changeCurrentPlayer();
      game.placeTile(2, '8B');
      game.changeCurrentPlayer();
      game.placeTile(0, '8A');
      game.startHotel('Sackson', 1);
      game.purchaseShares('Zeta', 1, 1)
      game.purchaseShares('Sackson', 1, 1)
      game.changeCurrentPlayer();
      game.placeTile(1, '4B');
      game.changeCurrentPlayer();
      game.placeTile(2, '9B');
      game.changeCurrentPlayer();
      game.placeTile(1, '6C');
      game.startHotel('Fusion', 1);
      game.changeCurrentPlayer();
      game.placeTile(1, '1B');
      game.changeCurrentPlayer();
      game.placeTile(2, '10B');
      game.changeCurrentPlayer();
      game.changeCurrentPlayer();
      game.changeCurrentPlayer();
      app.game = game;
      request(app)
        .post('/actions/placeTile')
        .set('Cookie', ['playerId=0', 'gameId=1'])
        .send(`tile=6A`)
        .expect(/disposeShares/i)
        .expect(200)
        .end(done);
    });
  });
  describe('/placeTile', function() {
    it('should restrict invalid player to place tile', function(done) {
      let manager = app.gameManager;
      let game = new Game(3, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      manager.addGame(game, 'veera');

      game.start();
      app.game = game;
      request(app)
        .post('/actions/placeTile')
        .set('Cookie', ['playerId=3', 'gameId=1'])
        .expect(302)
        .end(done);
    });
  });
  describe('/gameStatus', function() {
    it('should respond with current game status', function(done) {
      let manager = app.gameManager;
      let game = new Game(2, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      manager.addGame(game, 'veera');
      request(app)
        .get('/gameStatus')
        .set('Cookie', ['playerId=0', 'gameId=1'])
        .expect(/otherPlayers/i)
        .expect(200)
        .expect(/gupta/i)
        .expect(/Zeta/i)
        .end(done);
    });
    it('should respond 401 when game is running\
    \ but no cookie is sent ', function(done) {
      let manager = app.gameManager;
      let game = new Game(2, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      manager.addGame(game, 'veera');
      request(app)
        .get('/gameStatus')
        .set('Cookie','gameId=1')
        .expect(302)
        .expect('Location','/')
        .end(done);
    });
    it('should respond 302 when game is running\
    \ but invalid cookie is sent', function(done) {
      let manager = app.gameManager;
      let game = new Game(2, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      manager.addGame(game, 'veera');
      request(app)
        .get('/gameStatus')
        .set('Cookie', ['playerId=555', 'gameId=1'])
        .expect(302)
        .expect('Location','/')
        .end(done);
    });
    it('should respond 302 when game is not created\
    \ and not cookie is sent', function(done) {
      request(app)
        .get('/gameStatus')
        .expect(302)
        .expect('Location','/')
        .end(done);
    });
    it('should respond 302 when game is not created\
    \ and invalid cookie is sent', function(done) {
      request(app)
        .get('/gameStatus')
        .set('Cookie', 'playerId=5555')
        .expect(302)
        .expect('Location','/')
        .end(done);
    });
    it('should respond 302 when game is created, not all players joined,\
    \ no cookie is sent', function(done) {
      let manager = app.gameManager;
      let game = new Game(2, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      manager.addGame(game, 'veera');
      request(app)
        .get('/gameStatus')
        .expect(302)
        .expect('Location','/')
        .end(done);
    });
    it('should respond 403 when game is created, not all players joined,\
    \ valid cookie is sent', function(done) {
      let manager = app.gameManager;
      let game = new Game(3, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      manager.addGame(game, 'veera');
      request(app)
        .get('/gameStatus')
        .set('Cookie', ['playerId=0','gameId=1'])
        .expect(403)
        .end(done);
    });
    it('should respond 302 when game is created, not all players joined,\
    \ invalid cookie is sent', function(done) {
      let manager = app.gameManager;
      let game = new Game(3, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      manager.addGame(game, 'veera');
      request(app)
        .get('/gameStatus')
        .set('Cookie', ['playerId=455654654','gameId=1'])
        .expect(302)
        .expect('Location','/')
        .end(done);
    });

  });
  describe('/chooseHotel', function() {
    it('should respond with inactive hotels', function(done) {
      let manager = app.gameManager;
      let game = new Game(3, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      game.addPlayer(new Player(2, 'sachin'));
      manager.addGame(game, 'veera');
      game.start();
      game.placeTile(0, '6A');
      game.placeTile(0,'7A');
      request(app)
        .post('/actions/chooseHotel')
        .set('Cookie', ['playerId=1','gameId=1'])
        .send('hotelName=Zeta')
        .expect(/purchaseShare/i)
        .expect(200)
        .end(done);
    });
  });
  describe('/purchaseShares', function() {
    it('should allow current player to purchase shares', function(done) {
      let manager = app.gameManager;
      let game = new Game(3, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      game.addPlayer(new Player(2, 'sachin'));
      manager.addGame(game, 'veera');
      game.start();
      let cart = {
        Zeta: 3
      }
      game.placeTile(0, '6A');
      game.placeTile(0,'7A');
      game.startHotel('Zeta',1);
      request(app)
        .post('/actions/purchaseShares')
        .set('Cookie', ['playerId=1','gameId=1'])
        .send(`cart=${JSON.stringify(cart)}`)
        .expect(/placeTile/i)
        .expect(200)
        .end(done);
    });
  });
  describe('merge', function() {
    it('merge for two equal hotels', (done) => {
      let manager = app.gameManager;
      let game = new Game(3, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      game.addPlayer(new Player(2, 'sachin'));
      manager.addGame(game, 'veera');
      game.start();

      game.placeTile(0, '5A');
      game.changeCurrentPlayer();
      game.placeTile(0, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '5B');
      game.startHotel('Zeta', 2);
      game.changeCurrentPlayer();
      game.placeTile(2, '7B');
      game.startHotel('Sackson',0);
      game.changeCurrentPlayer();
      game.placeTile(0, '9A');
      game.changeCurrentPlayer();
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      request(app)
        .post('/actions/chooseHotelForMerge')
        .set('Cookie', ['playerId=2','gameId=1'])
        .send('hotelName=Sackson')
        .expect(200)
        .end(done)
    })
  })
  describe('/disposeShares', function() {
    it('should allow current player to purchase shares', function(done) {
      let manager = app.gameManager;
      let game = new Game(4, tileBox);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      game.addPlayer(new Player(2, 'sachin'));
      game.addPlayer(new Player(3, 'special player'));
      manager.addGame(game, 'veera');
      game.start();
      game.placeTile(0, '5A');
      game.startHotel('Zeta', 0);
      game.purchaseShares('Zeta', 3, 0)
      game.changeCurrentPlayer();
      game.placeTile(0, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.changeCurrentPlayer();
      game.placeTile(2, '8B');
      game.changeCurrentPlayer();
      game.placeTile(0, '8A');
      game.startHotel('Sackson', 1);
      game.purchaseShares('Zeta', 1, 1)
      game.purchaseShares('Sackson', 1, 1)
      game.changeCurrentPlayer();
      game.placeTile(1, '4B');
      game.changeCurrentPlayer();
      game.placeTile(2, '9B');
      game.changeCurrentPlayer();
      game.changeCurrentPlayer();
      game.placeTile(1, '6C');
      game.startHotel('Fusion', 1)
      game.changeCurrentPlayer();
      game.placeTile(1, '1B');
      game.changeCurrentPlayer();
      game.placeTile(2, '10B');
      game.changeCurrentPlayer();
      let response = game.placeTile(0, '6A');
      request(app)
        .post('/actions/merge/disposeShares')
        .set('Cookie', ['playerId=1','gameId=1'])
        .send(`hotelName=Zeta&noOfSharesToSell=2&noOfSharesToExchange=2`)
        .expect(/"currentMergingHotel":{"name":"sackson"/i)
        .expect(/"survivorHotel":{"name":"zeta/i)
        .expect(/"status":"disposeShares"/i)
        .expect(200)
        .end(done);
    })
  });
});
