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
    it('should not allow players to join if  maximum players joined',
     (done) => {
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
    it('should create game, add the player to game and redirect to wait',
     (done) => {
      request(app)
        .post('/create')
        .send('playerName=Aditi&numberOfPlayers=3')
        .expect(302)
        .expect('Location', '/wait')
        .expect(shouldHaveIdCookie)
        .end(done);
    });
    it('should not create game when invalid number of players has given', (done) => {
      delete app.game;
      request(app)
        .post('/create')
        .send('playerName=Aditi&numberOfPlayers=3.5')
        .expect(422)
        .end(done);
    });
  });
  describe('/haveAllPlayersJoined', () => {
    it('should respond with true if all players have joined', (done) => {
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
     \and bad cookie', (done) => {
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
       have not joined', (done) => {
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
       have not joined', (done) => {
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
  describe('/wait', () => {
    it('should serve the waiting page', (done) => {
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
    \ if game has started', (done) => {
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
    \ if game is not created and invalid cookie is sent',
     (done) => {
      app.manager = new GameManager();
      let manager = app.gameManager;
      request(app)
        .get('/wait')
        .set('Cookie', ['playerId=555', 'gameId=555'])
        .expect(302)
        .expect('Location', '/')
        .end(done);
    })
    it('should be redirected to /\
    \ if game is not created and no cookie is sent',
     (done) => {
      app.manager = new GameManager();
      let manager = app.gameManager;
      request(app)
        .get('/wait')
        .expect(302)
        .expect('Location', '/')
        .end(done);
    })
    it('should be redirected to /\
    \ for valid cookie if game has not started', (done) => {
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
    \ for invalid cookie if game is not created', (done) => {
      let manager = app.gameManager;
      request(app)
        .get('/wait')
        .set('Cookie', ['playerId=56556'])
        .expect(302)
        .end(done);
    })
  });
  describe('/join.html /wait /game', () => {
    it('should redirect to / when game is not created', (done) => {
      delete app.game;
      let manager = app.gameManager;
      request(app)
        .get('/wait')
        .expect(302)
        .expect('Location', '/')
        .end(done);
    });
  });
  describe('/', () => {
    it('should redirect to /wait when\
    \ already registered player comes to', (done) => {
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
  describe('/getPlayerDetails', () => {
    it('should give details of player with given valid id\
     when game has started', (done) => {
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
    it('should respond with disposeShares status when merger tile is placed',
    function(done) {
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
  describe('/actions/', () => {
    it('should send 403 for all valid players '+
    'other than current player', (done) => {
      let manager = app.gameManager;
      let game = new Game(3, tileBox);
      game.addPlayer(new Player(1, 'Frank'));
      game.addPlayer(new Player(2, 'Martin'));
      game.addPlayer(new Player(3, 'Nameless'));
      game.start();
      manager.addGame(game, 'Frank');
      request(app)
      .post('/actions/chooseHotel')
      .set('Cookie', ['playerId=3','gameId=1'])
      .send('hotelName=Zeta')
      .expect(403)
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
    it('should allow current player to dispose shares', function(done) {
      let manager = app.gameManager;
      let game = new Game(4, tileBox);
      game.addPlayer(new Player(1, 'veera'));
      game.addPlayer(new Player(2, 'gupta'));
      game.addPlayer(new Player(3, 'sachin'));
      manager.addGame(game, 'veera');
      game.start();
      game.placeTile(1, '4A');
      game.startHotel('Zeta', 1);
      game.purchaseShares('Zeta', 3, 1);
      game.changeCurrentPlayer();
      game.placeTile(2, '12A');
      game.changeCurrentPlayer();
      game.placeTile(3, '8B');
      game.changeCurrentPlayer();
      game.placeTile(1, '5A');
      game.purchaseShares('Zeta', 1, 1);
      game.changeCurrentPlayer();
      game.placeTile(2, '11A');
      game.startHotel('Sackson', 2);
      game.changeCurrentPlayer();
      game.placeTile(3, '12B');
      game.changeCurrentPlayer();
      game.placeTile(1, '6A');
      game.purchaseShares('Sackson', 2, 1)
      game.changeCurrentPlayer();
      game.placeTile(2, '10A');
      game.changeCurrentPlayer();
      game.placeTile(3, '3C');
      game.changeCurrentPlayer();
      game.placeTile(1, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '2B');
      game.changeCurrentPlayer();
      game.placeTile(3, '4B');
      game.changeCurrentPlayer();
      game.placeTile(1, '8A');
      game.changeCurrentPlayer();
      game.placeTile(2, '3B');
      game.changeCurrentPlayer();
      game.placeTile(3, '5B');
      game.changeCurrentPlayer();
      game.placeTile(1, '9A');
      request(app)
        .post('/actions/merge/disposeShares')
        .set('Cookie', ['playerId=1','gameId=1'])
        .send(`hotelName=Sackson&noOfSharesToSell=1&noOfSharesToExchange=0`)
        .expect(/"currentPlayer":"gupta",/i)
        .expect(/"message":"Waiting for gupta to dispose shares."/i)
        .expect(200)
        .end(done);
    })
  });
  describe('/gamesInfo', () => {
    it('Should provide the list of games in wait mode', (done) => {
      let manager = app.gameManager;
      let game1 = new Game(2, tileBox);
      let game2 = new Game(2, tileBox);
      game2.addPlayer(new Player(1, 'Frank'));
      let game3 = new Game(2, tileBox);
      game1.MODE = 'play';
      game3.MODE = 'END';
      manager.addGame(game1, 'Frank');
      manager.addGame(game2, 'Martin');
      manager.addGame(game3, 'Wolverine');
      let expected = '[{"gameId":"2","createdBy":"Martin",'+
      'date":"3/12/2018, 6:58:26 PM","playersJoined":293238230982083}]';
      let expected1 = '[{"gameId":"2","createdBy":"Martin",'+
      'date":"3/12/2018, 6:58:26 PM","playersJoined":1}]';
      request(app)
        .get('/gamesInfo')
        .expect((res)=>{
          assert.ok(res.text.match(/playersJoined":1/g));
          assert.ok(res.text.match(/gameId":"2"/g));
          assert.ok(res.text.match(/"createdBy":"Martin"/g));
        })
        .end(done);
    });
  });
  describe('/endGame', () => {
    it('game manager should delete the game and clear all cookies', (done) => {
      let manager = app.gameManager;
      let game1 = new Game(2, tileBox);
      let game2 = new Game(2, tileBox);
      game1.addPlayer(new Player(1, 'Frank'));
      game1.addPlayer(new Player(2, 'Unknown'));
      game1.start();
      game1.MODE = 'END';
      manager.addGame(game1, 'Frank');
      manager.addGame(game2, 'Martin');
      request(app)
        .get('/endGame')
        .set('Cookie', ['playerId=1', 'gameId=1'])
        .expect(302)
        .expect('Location','/')
        .expect((res)=>{
          const keys = Object.keys(res.header);
          let key = keys.find(k=>k.match(/set-cookie/i));
          let message=res.headers[key].find(k=>k.match(/playerId=;/));
          let errorMsg = `Didnot expect Set-Cookie in header of ${keys}`;
          if(!message) throw new Error(errorMsg);
        })
        .expect((res)=>{
          const keys = Object.keys(res.header);
          let key = keys.find(k=>k.match(/set-cookie/i));
          let message=res.headers[key].find(k=>k.match(/gameId=;/));
          let errorMsg = `Didnot expect Set-Cookie in header of ${keys}`;
          if(!message) throw new Error(errorMsg);
        })
        .expect((res) => {
          assert.equal(game1.getPlayerCount(), 1);
          assert.isOk(manager.getGameById(1));
          assert.isNotOk(game1.isValidPlayer(1));
          assert.isOk(game1.isValidPlayer(2));
        })
        .end(done);
    });
    it('should clear all cookies and remove player from the game', (done) => {
      let manager = app.gameManager;
      let game1 = new Game(2, tileBox);
      game1.addPlayer(new Player(1, 'Frank'));
      game1.addPlayer(new Player(2, 'Unknown'));
      game1.start();
      game1.MODE = 'END';
      manager.addGame(game1, 'Frank');
      request(app)
        .get('/endGame')
        .set('Cookie', ['playerId=1', 'gameId=1'])
        .expect(302)
        .expect('Location','/')
        .expect((res)=>{
          const keys = Object.keys(res.header);
          let key = keys.find(k=>k.match(/set-cookie/i));
          let message=res.headers[key].find(k=>k.match(/playerId=;/));
          let errorMsg = `Didnot expect Set-Cookie in header of ${keys}`;
          if(!message) throw new Error(errorMsg);
        })
        .expect((res)=>{
          const keys = Object.keys(res.header);
          let key = keys.find(k=>k.match(/set-cookie/i));
          let message=res.headers[key].find(k=>k.match(/gameId=;/));
          let errorMsg = `Didnot expect Set-Cookie in header of ${keys}`;
          if(!message) throw new Error(errorMsg);
        })
        .expect((res) => {
          assert.equal(game1.getPlayerCount(), 1);
          assert.isOk(manager.getGameById(1));
          assert.isNotOk(game1.isValidPlayer(1));
          assert.isOk(game1.isValidPlayer(2));
        })
        .end(done);
    });
    it('should clear all cookies, remove player from the game and remove game '+
    'from game manager when all players have requested for end game',
     (done) => {
      let manager = app.gameManager;
      let game1 = new Game(1, tileBox);
      game1.addPlayer(new Player(1, 'Frank'));
      game1.start();
      game1.MODE = 'END';
      manager.addGame(game1, 'Frank');
      request(app)
        .get('/endGame')
        .set('Cookie', ['playerId=1', 'gameId=1'])
        .expect(302)
        .expect('Location','/')
        .expect((res)=>{
          const keys = Object.keys(res.header);
          let key = keys.find(k=>k.match(/set-cookie/i));
          let message=res.headers[key].find(k=>k.match(/playerId=;/));
          let errorMsg = `Didnot expect Set-Cookie in header of ${keys}`;
          if(!message) throw new Error(errorMsg);
        })
        .expect((res)=>{
          const keys = Object.keys(res.header);
          let key = keys.find(k=>k.match(/set-cookie/i));
          let message=res.headers[key].find(k=>k.match(/gameId=;/));
          let errorMsg = `Didnot expect Set-Cookie in header of ${keys}`;
          if(!message) throw new Error(errorMsg);
        })
        .expect((res) => {
          assert.equal(game1.getPlayerCount(), 0);
          assert.isNotOk(manager.getGameById(1));
        })
        .end(done);
    });
  });
});
