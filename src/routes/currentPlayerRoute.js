const express = require('express');
const router = express.Router;
const app= router();

const placeTile = require('./placeTile');

const chooseHotel = require('./chooseHotel');
const mergingForTieCase = require('./merging.js');

const purchaseShares = require('./purchaseShares');
const disposeShares = require('./disposeShares.js');
const isCurrentPlayer = function(req){
  let game=req.app.game;
  let id=req.cookies.playerId;
  return game.isCurrentPlayer(id);
};

const isExpectedAction = function(req){
  let game=req.app.game;
  let id=req.cookies.playerId;
  let action=req.url.lastIndexOf('/');
  action=req.url.slice(action+1);
  return game.isExpectedAction(action);
};

const verifyCurrentPlayer = function(req,res,next){
  if(!isCurrentPlayer(req) || !isExpectedAction(req)) {
    res.sendStatus(403);
    return;
  }
  next();
};

app.use(verifyCurrentPlayer);
app.post('/purchaseShares',purchaseShares);
app.post('/placeTile',placeTile);
app.post('/chooseHotel',chooseHotel);
app.post('/chooseHotelForMerge',mergingForTieCase);
app.post('/merge/disposeShares',disposeShares);


module.exports=app;
