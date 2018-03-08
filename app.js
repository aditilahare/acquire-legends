const express = require('express');

const cookieParser =require('cookie-parser');
const app = express();
const getWaitingPage = require('./src/routes/wait.js');
const haveAllPlayersJoined = require('./src/routes/haveAllPlayersJoined.js');
const logRequest = require('./src/utils/logger');
const joinGame = require('./src/routes/joinGame.js').joinGame;
const createGame = require('./src/routes/createGame');
const playerDetails = require('./src/routes/playerDetails');
const currentPlayerRoute = require('./src/routes/currentPlayerRoute');
const getAllPlayerNames = require('./src/routes/getAllPlayerNames');
const isGameExisted = require('./src/routes/isGameExisted');
const gameStatus = require('./src/routes/gameStatus');
const changeDetails =require('./src/routes/changeDetails');

const redirectToIndexForNoGame = function(req, res, next) {
  let game = req.app.game;
  let urls=['/create','/isGameExisted','/','/index.html','/favicon.ico'];
  if(!game && !urls.includes(req.url)){

    console.log(req.url);
    res.redirect('/');
    return;
  }
  next();
};

const redirectInvalidPlayer= function(req, res, next) {
  let game = req.app.game;
  let playerId = req.cookies.playerId;
  let urls=['/create','/isGameExisted','/','/index.html','/join'];
  if(game && !game.isValidPlayer(playerId) && !urls.includes(req.url)){
    res.redirect('/');
    return;
  }
  next();
};


const startGame = function(req,res,next){
  let game=req.app.game;
  if(game && !game.isInPlayMode() && game.haveAllPlayersJoined()){
    game.start();
  }
  next();
};

const redirectToWait = function(req, res, next) {
  let game = req.app.game;
  let urls = ['/game.html', '/index.html', '/'];
  let status =game && urls.includes(req.url) && !game.isInPlayMode();
  if(status){
    res.redirect('/wait');
    return;
  }
  next();
};

const forbidActionsForWait = function(req, res, next) {
  let game = req.app.game;
  let invalidUrls = ['/gameStatus', '/playerDetails', '/actions',
    '/changeDetails', '/merge/disposeShares'];
  if(game && !game.isInPlayMode() && invalidUrls.includes(req.url)) {
    res.sendStatus(403);
    return;
  }
  next();
};

const redirectValidPlayer = function(req, res, next) {
  let game = req.app.game;
  let playerId = req.cookies.playerId;
  let urls = ['/', '/index.html', '/create', '/join','/wait'];
  let status = game && game.isInPlayMode() && game.isValidPlayer(playerId);
  if(status && urls.includes(req.url)) {
    res.redirect('/game.html');
    return;
  }
  next();
};

app.use('/css',express.static('public/css'));
app.use('/js',express.static('public/js'));
app.use('/images',express.static('public/images'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(logRequest);
app.use(redirectToIndexForNoGame);
app.use(redirectInvalidPlayer);
app.use(startGame);
app.use(redirectToWait);
app.use(forbidActionsForWait);
app.use(redirectValidPlayer);
app.use('/actions',currentPlayerRoute);
app.get('/isGameExisted',isGameExisted);
app.get('/wait',getWaitingPage);
app.get('/haveAllPlayersJoined',haveAllPlayersJoined);
app.get('/getAllPlayerNames',getAllPlayerNames);
app.post('/join',joinGame);
app.post('/create',createGame);
app.get('/playerDetails',playerDetails);
app.get('/gameStatus',gameStatus);
app.get('/changeDetails',changeDetails);
app.post('/merge/disposeShares',(req,res)=>{
  let game=req.app.game;
  let playerId=req.cookies.playerId;
  let sharesToDispose=req.body;
  if(game.canSharesBeDeployed(playerId, sharesToDispose)){
    game.disposeShares(playerId,sharesToDispose);
  }
  res.send(game.getStatus(playerId));
});
app.use(express.static('public'));
module.exports=app;
