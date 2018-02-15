const express = require('express');

const cookieParser =require('cookie-parser');
const app = express();
const getWaitingPage = require('./src/routes/wait.js');
const areAllPlayersJoined = require('./src/routes/areAllPlayersJoined.js');
const logRequest = require('./src/utils/logger');
const joinGame = require('./src/routes/join.js').joinGame;
const createGame = require('./src/routes/create');

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(logRequest);

app.get('/wait',getWaitingPage);
app.get('/areAllPlayersJoined',areAllPlayersJoined);
app.post('/join',joinGame);
app.post('/create',createGame);
app.use(express.static('public'));
module.exports=app;
