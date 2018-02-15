const chai = require('chai');
const assert = chai.assert;
const app = require('../../app.js');
const Game = require('../../src/models/game.js');
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

  describe('/wait', function(){
    it('should serve the waiting page for /wait', function(done){
      let fs=new MockFs();
      let fileName = './public/waitingPage.html';
      let content = 'Waiting For Other Players To Join';
      fs.addFile(fileName,content);
      app.fs=fs;
      request(app)
        .get('/wait')
        .expect(200)
        .expect(/Waiting For Other Players To Join/)
        .end(done);
    });
  });
});
