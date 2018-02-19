const getTurnDetails=function (req,res) {
  let game=req.app.game;
  let turnDetails={};
  let currentPlayer=game.getCurrentPlayer();
  let otherPlayers=game.getAllPlayerDetails().filter((player)=>{
    return currentPlayer.id!=player.id;
  });
  turnDetails.currentPlayer = currentPlayer.name;
  turnDetails.otherPlayers = otherPlayers.map((player)=>{
    return player.name;
  });
  res.json(turnDetails);
};

module.exports=getTurnDetails;
