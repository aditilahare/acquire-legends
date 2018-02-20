const express = require('express');

const cookieParser =require('cookie-parser');
const app = express();
const getWaitingPage = require('./src/routes/wait.js');
const haveAllPlayersJoined = require('./src/routes/haveAllPlayersJoined.js');
const logRequest = require('./src/utils/logger');
const joinGame = require('./src/routes/join.js').joinGame;
const createGame = require('./src/routes/create');
const playerDetails = require('./src/routes/playerDetails');
const getAllPlayerNames = require('./src/routes/getAllPlayerNames');
const isGameExisted = require('./src/routes/isGameExisted');
const placeTile = require('./src/routes/placeTile');
const changeTurn = require('./src/routes/changeTurn');
const gameStatus = require('./src/routes/GameStatus');
const verifyGameReq = function(game,id){
  return game && game.isValidPlayer(id) && !game.isInPlayMode();
};

const redirectToHomeIfGameNotCreated=function(req,res,next){
  let urls =['/wait','/game.html','/join'];
  if(urls.includes(req.url)&&!req.app.game){
    res.redirect('/');
    return ;
  }
  next();
};

const restrictInvalidPlayerToPlay = function(req,res,next){
  let game = req.app.game;
  let id =req.cookies.playerId;
  let urls = ['/placeTile','/buyShares'];
  if(urls.includes(req.url) && !game.isCurrentPlayer(id)){
    res.send(401);
  }
  next();
};


const redirectToWaitIfPlayerIsValid=function(req,res,next){
  let game = req.app.game;
  let id =req.cookies.playerId;
  let urls = ['/','/game.html'];
  if(urls.includes(req.url) && verifyGameReq(game,id) &&
  !game.haveAllPlayersJoined()){
    res.redirect('/wait');
    return ;
  }
  next();
};

const startGame = function(req,res,next){
  let game=req.app.game;
  let id=req.cookies.playerId;
  if(req.url=='/game.html' && verifyGameReq(game,id)&&
  game.haveAllPlayersJoined()){
    game.start();
  }
  next();
};

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(logRequest);
app.use(redirectToHomeIfGameNotCreated);
app.use(redirectToWaitIfPlayerIsValid);
app.use(startGame);
app.use(restrictInvalidPlayerToPlay);
app.get('/isGameExisted',isGameExisted);
app.get('/wait',getWaitingPage);
app.get('/haveAllPlayersJoined',haveAllPlayersJoined);
app.get('/getAllPlayerNames',getAllPlayerNames);
app.post('/join',joinGame);
app.post('/create',createGame);
app.post('/placeTile',placeTile);
app.get('/playerDetails',playerDetails);
app.get('/changeTurn',changeTurn);
app.get('/gameStatus',gameStatus);
app.use(express.static('public'));
module.exports=app;
