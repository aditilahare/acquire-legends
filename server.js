const http=require('http');
const app = require('./app');
const PORT=8000;
const Game = require('./src/models/game');
app.game=new Game(3);
const server = http.createServer(app);

server.on('listening',()=>{
  console.log(`Server started at ${server.address().port}`);
});

server.on('error',(err)=>{
  console.log(err.message);
});


server.listen(PORT);
