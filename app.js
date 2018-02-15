const express = require('express');
const cookieParser =require('cookie-parser');
const app = express();
const logRequest = require('./src/utils/logger');
const joinGame = require('./src/routes/join.js').joinGame;


app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(logRequest);

app.use(express.static('public'));
app.post('/join',joinGame);
module.exports=app;
