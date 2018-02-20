const placeTile = function (req,res,next) {
  let game = req.app.game;
  let id=req.cookies.playerId;
  let tile= req.body.tile;
  let response=game.placeTile(id,tile);
  res.json(response);
};

module.exports=placeTile;
