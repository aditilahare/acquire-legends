const getTurnState = function (req,res,next) {
  let game = req.app.game;
  res.send(game.getTurnState());
};

module.exports=getTurnState;
