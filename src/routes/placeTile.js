const placeTile = function (req,res,next) {
  let game = req.app.game;
  let id=req.cookies.playerId;
  let tile= req.body.tile;
  game.placeTile(id,tile);
  res.send(game.getTurnState());
};

module.exports=placeTile;
