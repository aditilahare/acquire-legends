const getWaitingPage=function (req,res) {
  let waitingPage=req.app.fs.readFileSync('./public/waitingPage.html','utf8');
  let playerName=req.app.game.getPlayerNameOf(req.cookies.playerId);
  waitingPage=waitingPage.replace('{{playerName}}',playerName);
  res.send(waitingPage);
};

module.exports=getWaitingPage;
