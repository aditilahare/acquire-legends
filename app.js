const express = require('express');

const cookieParser =require('cookie-parser');
const app = express();
const PATH = './src/routes/';
const logRequest = require('./src/utils/logger');
const getWaitingPage = require(PATH + 'wait.js');
const haveAllPlayersJoined = require(PATH + 'haveAllPlayersJoined.js');
const joinGame = require(PATH + 'joinGame.js').joinGame;
const createGame = require(PATH + 'createGame.js');
const playerDetails = require(PATH + 'playerDetails.js');
const currentPlayerRoute = require(PATH + 'currentPlayerRoute.js');
const getAllPlayerNames = require(PATH + 'getAllPlayerNames.js');
const gameStatus = require(PATH + 'gameStatus.js');
const gamesInfo = require(PATH + 'availableGames.js');
const endGame = require(PATH + 'endGame.js');

const redirectInvalidGameReq = function(req, res, next) {
  let gameId = req.app.game;
  let playerId = req.cookies.playerId;
  let urls=['/','/index.html','/create','/join','/gamesInfo','/joinPage.html'];
  if( !req.cookies.gameId && !urls.includes(req.url)){
    res.redirect('/');
    return;
  }
  next();
};

const provideGame = function(req, res, next) {
  let gameManager = req.app.gameManager;
  let gameId = req.cookies.gameId;
  let urls = ['/create','/join','/joinPage.html'];
  if(gameId && !urls.includes(req.url)){
    req.app.game = gameManager.getGameById(gameId);
  }
  next();
};

const redirectToIndexForNoGame = function(req, res, next) {
  let game = req.app.game;
  let urls=['/','/index.html','/favicon.ico'];
  if(!game && !urls.includes(req.url)){
    res.redirect('/');
    return;
  }
  next();
};

const redirectInvalidPlayer= function(req, res, next) {
  let game = req.app.game;
  let playerId = req.cookies.playerId;
  let urls=['/','/index.html','/join','/gamesInfo','/joinPage.html'];
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
  let urls = ['/game.html', '/index.html', '/','/joinPage.html'];
  let status =game && game.isValidPlayer(playerId) && game.isInWaitMode();
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
  let urls = ['/', '/index.html', '/create', '/join','/wait','/joinPage.html'];
  let status = game && game.isValidPlayer(playerId) && game.isInPlayMode();
  if(status && urls.includes(req.url)) {
    res.redirect('/game.html');
    return;
  }
  next();
};
// app.use("/joinPage.html",express.static('public'));
app.use(logRequest);
app.use('/css',express.static('public/css'));
app.use('/js',express.static('public/js'));
app.use('/images',express.static('public/images'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.post('/create',createGame);
app.get('/gamesInfo',gamesInfo);
app.post('/join',joinGame);
app.use(redirectInvalidGameReq);
app.use(provideGame);
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
app.get('/endGame', endGame);
app.get('/gameStatus',gameStatus);
app.use(express.static('public'));
module.exports=app;
