const request = require('supertest');
const chai = require('chai');
const assert=chai.assert;
const app = require('../../app.js');
const MockFs = require('../helpers/fsSimulator.js');

describe('waiting page', function(){
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
