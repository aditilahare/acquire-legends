const express = require('express');

const cookieParser =require('cookie-parser');
const app = express();
const getWaitingPage = require('./src/routes/wait.js');
const areAllPlayersJoined = require('./src/routes/areAllPlayersJoined.js');
const logRequest = require('./src/utils/logger');
const joinGame = require('./src/routes/join.js').joinGame;

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(logRequest);

app.get('/wait',getWaitingPage);
app.get('/areAllPlayersJoined',areAllPlayersJoined);

app.use(express.static('public'));
app.post('/join',joinGame);
module.exports=app;
