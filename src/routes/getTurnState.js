const getTurnState = function (req,res,next) {
  let game = req.app.game;
  let id =req.cookies.playerId;
  if(game.isCurrentPlayer(id)) {
    res.send(game.getTurnState());
  }
};

module.exports=getTurnState;
