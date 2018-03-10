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
const gameStatus = require('./src/routes/gameStatus');

const redirectInvalidGameReq = function(req, res, next) {
  let gameId = req.app.game;
  let playerId = req.cookies.playerId;
  let urls=['/','/index.html','/create','/join','/gamesInfo'];
  if( !req.cookies.gameId && !urls.includes(req.url)){
    res.redirect('/');
    return;
  }
  next();
};

const provideGame = function(req, res, next) {
  let gameManager = req.app.gameManager;
  let gameId = req.cookies.gameId;
  let urls = ['/create','/join'];
  if(gameId && !urls.includes(req.url)){
    req.app.game = gameManager.getGameById(gameId);
  }
  next();
};

const redirectToIndexForNoGame = function(req, res, next) {
  let game = req.app.game;
  let urls=['/isGameExisted','/','/index.html','/favicon.ico'];
  if(!game && !urls.includes(req.url)){
    res.redirect('/');
    return;
  }
  next();
};

const redirectInvalidPlayer= function(req, res, next) {
  let game = req.app.game;
  let playerId = req.cookies.playerId;
  let urls=['/','/index.html','/join'];
  if(game && !game.isValidPlayer(playerId) && !urls.includes(req.url)){
    res.redirect('/');
    return;
  }
  next();
};

const startGame = function(req,res,next){
  let game=req.app.game;
  if(game && game.isInWaitMode() && game.haveAllPlayersJoined()){
    game.start();
  }
  next();
};

const redirectToWait = function(req, res, next) {
  let game = req.app.game;
  let playerId = req.cookies.playerId;
  let urls = ['/game.html', '/index.html', '/'];
  let status =game && game.isValidPlayer(playerId) && !game.isInPlayMode();
  if(status && urls.includes(req.url)){
    res.redirect('/wait');
    return;
  }
  next();
};

const forbidActionsForWait = function(req, res, next) {
  let game = req.app.game;
  let invalidUrls = ['/gameStatus', '/playerDetails', '/actions',
    '/changeDetails', '/merge/disposeShares'];
  if(game && game.isInWaitMode() && invalidUrls.includes(req.url)) {
    res.sendStatus(403);
    return;
  }
  next();
};

const redirectValidPlayer = function(req, res, next) {
  let game = req.app.game;
  let playerId = req.cookies.playerId;
  let urls = ['/', '/index.html', '/create', '/join','/wait'];
  let status = game && game.isValidPlayer(playerId) && game.isInPlayMode();
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
app.post('/create',createGame);
//app.get('/gamesInfo',gamesInfo);
app.post('/join',joinGame);
app.use(redirectInvalidGameReq);
app.use(provideGame);
app.use(logRequest);
app.use(redirectToIndexForNoGame);
app.use(redirectInvalidPlayer);
app.use(startGame);
app.use(redirectToWait);
app.use(forbidActionsForWait);
app.use(redirectValidPlayer);
app.use('/actions',currentPlayerRoute);
app.get('/wait',getWaitingPage);
app.get('/haveAllPlayersJoined',haveAllPlayersJoined);
app.get('/getAllPlayerNames',getAllPlayerNames);
app.get('/playerDetails',playerDetails);
app.get('/gameStatus',gameStatus);
app.use(express.static('public'));
module.exports=app;
