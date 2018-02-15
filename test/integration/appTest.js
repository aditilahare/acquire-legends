const request = require('supertest');
const chai = require('chai');
const assert=chai.assert;
const app = require('../../app.js');
const MockFs = require('../helpers/fsSimulator.js');
const Game = require('../../src/models/game.js');

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
describe('/areAllPlayersJoined', function(){
  it('should respond with true if all players have joined', function(done){
    app.game=new Game(0);
    request(app)
      .get('/areAllPlayersJoined')
      .expect(200)
      .expect(/true/)
      .end(done);
  });
  it('should respond with false if all players have not joined', function(done){
    app.game=new Game(1);
    request(app)
      .get('/areAllPlayersJoined')
      .expect(200)
      .expect(/false/)
      .end(done);
  });
  it('should respond with true if all players have not joined', function(done){
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
