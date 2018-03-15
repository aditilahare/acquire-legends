const availableGamesInfo = function (req,res) {
  let gameManager = req.app.gameManager;
  let info=gameManager.getAvailableGamesInfo();
  res.send(JSON.stringify(info));
};
module.exports=availableGamesInfo;
