const getWaitingPage=function (req,res) {
  let waitingPage=req.app.fs.readFileSync('./public/waitingPage.html','utf8');
  res.send(waitingPage);
};

module.exports=getWaitingPage;
