const express = require('express');
const fs=require('fs');

const cookieParser =require('cookie-parser');
const app = express();
const getWaitingPage = require('./src/routes/wait.js');
const areAllPlayersJoined = require('./src/routes/areAllPlayersJoined.js');
const logRequest = require('./src/utils/logger');
app.fs=fs;

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(logRequest);

app.get('/wait',getWaitingPage);
app.get('/areAllPlayersJoined',areAllPlayersJoined);

app.use(express.static('public'));
module.exports=app;
