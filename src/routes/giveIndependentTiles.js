const giveIndependentTiles = function (req,res,next) {
 let game = req.app.game;
 res.send(JSON.stringify(game.giveIndependentTiles()));
 res.end();
};

module.exports=giveIndependentTiles;
