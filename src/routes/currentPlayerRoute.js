const express = require('express');
const router = express.Router;
const app= router();

const placeTile = require('./placeTile');

const chooseHotel = require('./chooseHotel');
const mergingForTieCase = require('./merging.js');

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
  let action=req.url.lastIndexOf('/');
  action=req.url.slice(action+1);
  return game.isExpectedAction(action);
};

const verifyCurrentPlayer = function(req,res,next){
  if(doesGameExist(req)&&isCurrentPlayer(req)&& isExpectedAction(req)) {
    next();
  } else {
    res.sendStatus(403);
  }
};

app.use(verifyCurrentPlayer);
app.post('/purchaseShares',purchaseShares);
app.post('/placeTile',placeTile);
app.post('/chooseHotel',chooseHotel);
app.post('/chooseHotelForMerge',mergingForTieCase);
app.post('/merge/disposeShares',(req,res)=>{
  let game=req.app.game;
  let playerId=req.cookies.playerId;
  let sharesToDispose=req.body;
  console.log(req.body);
  debugger;
  if(game.canSharesBeDeployed(playerId,sharesToDispose)){
    console.log(sharesToDispose);
    game.disposeShares(playerId,sharesToDispose);
  } res.send(game.getStatus(playerId));
});


module.exports=app;
