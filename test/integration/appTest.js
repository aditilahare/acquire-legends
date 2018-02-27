/*eslint max-len: ["error", { "ignoreStrings": true }]*/
/*eslint max-statements: ["error", 20, { "ignoreTopLevelFunctions": true }]*/
/*eslint-env es6*/
const chai = require('chai');
const assert = chai.assert;
const app = require('../../app.js');
const Game = require('../../src/models/game.js');
const Player = require('../../src/models/player.js');
const request = require('supertest');
const shouldHaveIdCookie = require('../helpers/rh.js').shouldHaveIdCookie;
const MockFs = require('../helpers/fsSimulator.js');

describe('App Test', () => {
  describe('/join', () => {
    let game = new Game(3);
    app.game = game;
    it('should add player and redirect to waiting page', (done) => {
      request(app)
        .post('/join')
        .send('playerName=Aditi')
        .expect(302)
        .expect('Location', '/wait')
        .expect(shouldHaveIdCookie)
        .end(done);
    });
    it('should not allow players to join if  maximum players joined', (done) => {
      game = new Game(1);
      game.addPlayer(new Player(1, 'veera'));
      app.game = game;
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
        .expect(200)
        .expect(/Number of players/i)
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
      app.game = new Game(0);
      request(app)
        .get('/haveAllPlayersJoined')
        .expect(200)
        .expect(/true/)
        .end(done);
    });
    it('should respond with false if all players\
       have not joined', function(done) {
      app.game = new Game(1);
      request(app)
        .get('/haveAllPlayersJoined')
        .expect(200)
        .expect(/false/)
        .end(done);
    });
    it('should respond with true if all players\
       have not joined', function(done) {
      app.game = new Game(2);
      let player = new Player(0, 'veera');
      app.game.addPlayer(player);
      app.game.addPlayer(player);
      request(app)
        .get('/haveAllPlayersJoined')
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
      fs.addFile(fileName, content);
      app.fs = fs;
      app.game = new Game(1);
      let player = new Player(0, 'pragya');
      app.game.addPlayer(player);
      request(app)
        .get('/wait')
        .set('Cookie', 'playerId=0')
        .expect(200)
        .expect(/Waiting For Other Players To Join/)
        .end(done);
    });
  });
  describe('/join.html /wait /game', function() {
    it('should redirect to / when game is not created', function(done) {
      delete app.game;
      request(app)
        .get('/wait')
        .expect(302)
        .expect('Location', '/')
        .end(done);
    });
  });
  describe('/', function() {
    it('should redirect to /wait when already registered player comes to  ', function(done) {
      app.game = new Game(2);
      app.game.addPlayer(new Player(0, 'veera'));
      request(app)
        .get('/')
        .set('Cookie', 'playerId=0')
        .expect(302)
        .expect('Location', '/wait')
        .end(done);
    });
  });
  describe('/getPlayerDetails', function() {
    it('should give tiles of player with given id', function(done) {
      app.game = new Game(1);
      let veera = new Player(0, 'veera');
      app.game.addPlayer(veera);
      app.game.distributeInitialTiles();
      request(app)
        .get('/playerDetails')
        .set('Cookie', 'playerId=0')
        .expect(200)
        .expect(/tiles/i)
        .end(done);
    });
    it('should give tiles of player with given id', function(done) {
      app.game = new Game(1);
      let veera = new Player(0, 'veera');
      app.game.addPlayer(veera);
      app.game.distributeInitialTiles();
      request(app)
        .get('/playerDetails')
        .set('Cookie', 'playerId=0')
        .expect(200)
        .expect(/availableMoney/i)
        .end(done);
    });
    it('should give name of player with given id', function(done) {
      app.game = new Game(1);
      let veera = new Player(0, 'veera');
      app.game.addPlayer(veera);
      app.game.distributeInitialTiles();
      request(app)
        .get('/playerDetails')
        .set('Cookie', 'playerId=0')
        .expect(200)
        .expect(/"name":/i)
        .end(done);
    });
  });
  describe('/game.html', function() {
    it('should start game if game exists but not started', function(done) {
      app.game = new Game(1);
      let veera = new Player(0, 'veera');
      app.game.addPlayer(veera);
      request(app)
        .get('/game.html')
        .set('Cookie', 'playerId=0')
        .expect(200)
        .expect(/hotels/i)
        .end(done);
    });
  });
  describe('/getAllPlayerNames', function() {
    it('can give all player names who have joined the game', function(done) {
      app.game = new Game(1);
      let player = new Player(0, 'pragya');
      app.game.addPlayer(player);
      request(app)
        .get('/getAllPlayerNames')
        .set('Cookie', 'playerId=0')
        .expect(200)
        .expect(/pragya/)
        .end(done);
    });
  });
  describe('/isGameExisted', function() {
    it('should respond with true if game existed', function(done) {
      app.game = new Game(0);
      request(app)
        .get('/isGameExisted')
        .expect(200)
        .expect(/true/)
        .end(done);
    });
    it('should respond with true if game existed', function(done) {
      delete app.game;
      request(app)
        .get('/isGameExisted')
        .expect(200)
        .expect(/false/)
        .end(done);
    });
  });
  describe('/placeTile', function() {
    it('can place a tile on market', function(done) {
      app.game = new Game(1);
      let player = new Player(0, 'pragya');
      app.game.addPlayer(player);
      app.game.start();
      request(app)
        .post('/actions/placeTile')
        .set('Cookie', 'playerId=0')
        .send("tile=1A")
        .expect(200)
        .end(done);
    });
    it('should respond with deployShares status when merger tile is placed', function(done) {
      let game = new Game(4);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      let player4 = new Player(3, 'specailPlayer');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.addPlayer(player4);
      game.start();
      game.placeTile(0, '5A');
      game.changeCurrentPlayer();
      game.placeTile(1, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.changeCurrentPlayer();
      game.placeTile(3, '8B');
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.startHotel('Zeta',0);
      game.purchaseShares('Zeta',2,0)
      game.changeCurrentPlayer();
      game.placeTile(1, '8A');
      game.startHotel('Sackson',1);
      game.purchaseShares('Zeta',1,1)
      game.purchaseShares('Sackson',1,1)
      game.changeCurrentPlayer();
      game.placeTile(2, '4B');
      game.changeCurrentPlayer();
      game.placeTile(3, '9B');
      game.changeCurrentPlayer();
      game.placeTile(0, '1A');
      game.changeCurrentPlayer();
      game.placeTile(1, '6C');
      game.startHotel('Fusion',1);
      game.changeCurrentPlayer();
      game.placeTile(2, '1B');
      game.changeCurrentPlayer();
      game.placeTile(3, '10B');
      game.changeCurrentPlayer();
      app.game = game;
      request(app)
        .post('/actions/placeTile')
        .set('Cookie','playerId=0')
        .send(`tile=6A`)
        .expect(/deployShares/i)
        .expect(200)
        .end(done);
    });
  });
  describe('/changeTurn', function() {
    it('change turn to next player', function(done) {
      let game = new Game(3);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      game.addPlayer(new Player(2, 'raj'));
      game.start();
      game.turn.setState({expectedActions:['changeTurn']})
      app.game = game;
      request(app)
        .get('/actions/changeTurn')
        .set('Cookie','playerId=0')
        .expect(200)
        .end(done);
    });
    it('should respond withn 401 for unauthorized player for changing turn', function(done) {
      let game = new Game(3);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      game.addPlayer(new Player(2, 'raj'));
      game.start();
      app.game = game;
      request(app)
        .get('/actions/changeTurn')
        .expect(403)
        .end(done);
    });
  });
  describe('/placeTile', function() {
    it('should restrict invalid player to place tile', function(done) {
      let game = new Game(3);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      game.start();
      app.game = game;
      request(app)
        .post('/actions/placeTile')
        .set('Cookie', 'playerId=3')
        .expect(403)
        .end(done);
    });
  });
  describe('/gameStatus', function() {
    it('should respond with current game status', function(done) {
      let game = new Game(3);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      game.start();
      app.game = game;
      request(app)
        .get('/gameStatus')
        .set('Cookie', 'playerId=0')
        .expect(/otherPlayers/i)
        .expect(200)
        .expect(/gupta/i)
        .expect(/Zeta/i)
        .end(done);
    });
  });
  describe('/turnState', function() {
    it('should respond with current turn state', function(done) {
      let game = new Game(2);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      game.start();
      app.game = game;
      request(app)
        .get('/actions/turnState')
        .set('Cookie','playerId=0')
        .expect(/placeTile/i)
        .expect(200)
        .end(done);
    });
  });
  describe('/chooseHotel', function() {
    it('should respond with inactive hotels', function(done) {
      let game = new Game(3);
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      game.addPlayer(new Player(2, 'sachin'));
      game.start();
      game.placeTile(0,'6A');
      game.changeCurrentPlayer();
      game.placeTile(1,'7A');
      app.game = game;
      request(app)
        .post('/actions/chooseHotel')
        .set('Cookie','playerId=1')
        .send('hotelName=Zeta')
        .expect(/purchaseShares/i)
        .expect(200)
        .end(done);
    });
  });
  describe('/purchaseShares', function() {
    it('should allow current player to purchase shares', function(done) {
      let game = new Game(3);
      let cart={
        Zeta:3
      }
      game.addPlayer(new Player(0, 'veera'));
      game.addPlayer(new Player(1, 'gupta'));
      game.addPlayer(new Player(2, 'sachin'));
      game.start();
      game.placeTile(0,'6A');
      game.changeCurrentPlayer();
      game.placeTile(1,'7A');
      game.startHotel('Zeta',1);
      app.game = game;
      request(app)
        .post('/actions/purchaseShares')
        .set('Cookie','playerId=1')
        .send(`cart=${JSON.stringify(cart)}`)
        .expect(/placeTile/i)
        .expect(200)
        .end(done);
    });
  });
  describe('/deployShares', function() {
    it('should allow current player to purchase shares', function(done) {
      let game = new Game(4);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      let player4 = new Player(3, 'specailPlayer');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.addPlayer(player4);
      game.start();
      game.placeTile(0, '5A');
      game.changeCurrentPlayer();
      game.placeTile(1, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.changeCurrentPlayer();
      game.placeTile(3, '8B');
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.startHotel('Zeta',0);
      game.purchaseShares('Zeta',2,0)
      game.changeCurrentPlayer();
      game.placeTile(1, '8A');
      game.startHotel('Sackson',1);
      game.purchaseShares('Zeta',1,1)
      game.purchaseShares('Sackson',1,1)
      game.changeCurrentPlayer();
      game.placeTile(2, '4B');
      game.changeCurrentPlayer();
      game.placeTile(3, '9B');
      game.changeCurrentPlayer();

      game.placeTile(0, '1A');
      game.changeCurrentPlayer();
      game.placeTile(1, '6C');
      game.startHotel('Fusion',1)
      game.changeCurrentPlayer();
      game.placeTile(2, '1B');
      game.changeCurrentPlayer();
      game.placeTile(3, '10B');
      game.changeCurrentPlayer();
      let response=game.placeTile(0, '6A');
      app.game = game;
      request(app)
        .post('/merge/deployShares')
        .set('Cookie','playerId=0')
        .send(`hotelName=Zeta&noOfSharesToSell=2`)
        .expect(/"currentMergingHotel":{"name":"Zeta"/i)
        .expect(/"activeHotels":\[{"name":"Sackson"/i)
        .expect(/"survivorHotel":{"name":"Sackson/i)
        .expect(/"expectedActions":\["deployShares"]/i)
        .expect(/"status":"merge"/i)
        .expect(/"shouldIDeploy":false/i)
        .expect(200)
        .end(done);
    });
  });
});
