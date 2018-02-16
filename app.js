const express = require('express');

const cookieParser =require('cookie-parser');
const app = express();
const getWaitingPage = require('./src/routes/wait.js');
const haveAllPlayersJoined = require('./src/routes/haveAllPlayersJoined.js');
const logRequest = require('./src/utils/logger');
const joinGame = require('./src/routes/join.js').joinGame;
const createGame = require('./src/routes/create');
const playerDetails = require('./src/routes/playerDetails');

const redirectToHomeIfGameNotCreated=function(req,res,next){
  let urls =['/join.html','/wait','/game.html','/join'];
  if(urls.includes(req.url)&&!req.app.game){
    res.redirect('/');
    return ;
  }
  next();
};

const redirectToJoinIfGameExists=function(req,res,next){
  let game=req.app.game;
  let urls=['/','/index.html'];
  if(urls.includes(req.url) && game &&game.isVacancy() ){
    res.redirect('/join.html');
    return ;
  }
  next();
};

const redirectToWaitIfPlayerIsValid=function(req,res,next){
  let game = req.app.game;
  let id =req.cookies.playerId;
  if(req.url=='/join.html' && game.isValidPlayer(id) ){
    res.redirect('/wait');
    return ;
  }
  next();
};

const startGame = function(req,res,next){
  let game=req.app.game;
  if(req.url=='/game.html' && game && !game.isInPlayMode() ){
    game.start();
  }
  next();
};

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(logRequest);
app.use(redirectToHomeIfGameNotCreated);
app.use(redirectToJoinIfGameExists);
app.use(redirectToWaitIfPlayerIsValid);
app.use(startGame);
app.get('/wait',getWaitingPage);
app.get('/haveAllPlayersJoined',haveAllPlayersJoined);
app.post('/join',joinGame);
app.post('/create',createGame);
app.get('/playerDetails',playerDetails);
app.use(express.static('public'));
module.exports=app;
