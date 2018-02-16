const chai = require('chai');
const assert = chai.assert;
const app = require('../../app.js');
const Game = require('../../src/models/game.js');
const Player = require('../../src/models/player.js');
const request = require('supertest');
const shouldHaveIdCookie = require('../helpers/rh.js').shouldHaveIdCookie;
const MockFs = require('../helpers/fsSimulator.js');

describe('App Test',()=>{
  describe('/join',()=>{
    let game = new Game(3);
    app.game=game;

    it('should add player and redirect to waiting page',(done)=>{
      request(app)
        .post('/join')
        .send('playerName=Aditi')
        .expect(302)
        .expect('Location','/wait')
        .expect(shouldHaveIdCookie)
        .end(done);
    });
    it('should not allow players to join if  maximum players joined',(done)=>{
      game=new Game(1);
      game.addPlayer({name:'veera',id:1});
      app.game=game;
      request(app)
        .post('/join')
        .send('playerName=Aditi')
        .expect(/Maximum number of players joined/)
        .end(done);
    });
  });
  describe('/create',()=>{
    it('should create game and add the payer to game ',(done)=>{
      request(app)
        .post('/create')
        .send('playerName=Aditi&numberOfPlayers=3')
        .expect(302)
        .expect('Location','/wait')
        .expect(shouldHaveIdCookie)
        .end(done);
    });
  });
  describe('/areAllPlayersJoined', function(){
    it('should respond with true if all players have joined', function(done){
      app.game=new Game(0);
      request(app)
        .get('/areAllPlayersJoined')
        .expect(200)
        .expect(/true/)
        .end(done);
    });
    it('should respond with false if all players\
     have not joined', function(done){
      app.game=new Game(1);
      request(app)
        .get('/areAllPlayersJoined')
        .expect(200)
        .expect(/false/)
        .end(done);
    });
    it('should respond with true if all players\
     have not joined', function(done){
      app.game=new Game(2);
      let player={
        name:'pragya',
        ID:0
      };
      app.game.addPlayer(player);
      app.game.addPlayer(player);
      request(app)
        .get('/areAllPlayersJoined')
        .expect(200)
        .expect(/true/)
        .end(done);
    });
  });
  describe('/wait', function(){
    it('should serve the waiting page', function(done){
      let fs=new MockFs();
      let fileName = './public/waitingPage.html';
      let content = 'Waiting For Other Players To Join';
      fs.addFile(fileName,content);
      app.fs=fs;
      app.game=new Game(1);
      let player={
        name:'pragya',
        ID:0
      };
      app.game.addPlayer(player);
      request(app)
        .get('/wait')
        .set('Cookie','playerId=0')
        .expect(200)
        .expect(/Waiting For Other Players To Join/)
        .end(done);
    });
  });

  describe('/join.html /wait /game', function(){
    it('should redirect to / when game is not created', function(done){
      delete app.game;
      request(app)
        .get('/wait')
        .expect(302)
        .expect('Location','/')
        .end(done);
    });
  });

  describe('/', function(){
    it('should redirect to /join when game is  created\
         and there is vacancy', function(done){
      app.game=new Game(1);
      request(app)
        .get('/')
        .expect(302)
        .expect('Location','/join.html')
        .end(done);
    });
  });
  describe('/join', function(){
    it('should redirect to /wait when already \
    registered player comes to /\/ /join.html ', function(done){
      app.game=new Game(1);
      app.game.addPlayer({name:'veera',id:0});
      request(app)
        .get('/join.html')
        .set('Cookie','playerId=0')
        .expect(302)
        .expect('Location','/wait')
        .end(done);
    });
  });
  describe('/getPlayerDetails', function(){
    it('should give tiles of player with given id', function(done){
      app.game=new Game(1);
      let veera=new Player(0,'veera');
      app.game.addPlayer(veera);
      app.game.distributeInitialTiles();
      request(app)
        .get('/playerDetails')
        .set('Cookie','playerId=0')
        .expect(200)
        .expect(/tiles/i)
        .end(done);
    });
  });
});
