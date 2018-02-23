const express = require('express');
const router = express.Router;
const app= router();

const placeTile = require('./placeTile');
const changeTurn = require('./changeTurn');
const chooseHotel = require('./chooseHotel');
const getTurnState = require('./getTurnState');
const purchaseShares = require('./purchaseShares');
const isCurrentPlayer = function(req){
  let game=req.app.game;
  let id=req.cookies.playerId;
  return game.isCurrentPlayer(id);
};

const doesGameExist = function(req){
  return req.app.game;
};

const isExpectedAction = function(req){
  let game=req.app.game;
  let id=req.cookies.playerId;
  return game.isExpectedAction(req.url.slice(1));
};

const verifyCurrentPlayer = function(req,res,next){
  if(doesGameExist(req)&&isCurrentPlayer(req)&& isExpectedAction(req)) {
    next();
  } else {
    res.sendStatus(403);
  }
};
app.get('/turnState',getTurnState);
app.use(verifyCurrentPlayer);
app.post('/purchaseShares',purchaseShares);
app.post('/placeTile',placeTile);
app.post('/chooseHotel',chooseHotel);
app.get('/changeTurn',changeTurn);

module.exports=app;
