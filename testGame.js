const http=require('http');
const fs=require('fs');
const app = require('./app');
const PORT=process.env.PORT || 8000;
const GameManager = require('./src/models/gameManager.js');
app.gameManager = new GameManager();
app.fs=fs;
app.gameManager.addGame(require('./test/helpers/sampleGame'),'veera');
const server = http.createServer(app);

server.on('listening',()=>{
  console.log(`Server started at ${server.address().port}`);
});

server.on('error',(err)=>{
  console.log(err.message);
  debugger;
});


server.listen(PORT);
