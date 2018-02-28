const seperateCharFromNum = function(tile){
  let number = +tile.slice(0,-1);
  let alphabet = tile.slice(-1);
  return {
    number : number,
    alphabet : alphabet
  };
};
const getNameAndTile = function(player) {
  return {
    id: player.id,
    tile: seperateCharFromNum(player.tiles[0])
  };
};
const sortOrder = function(player1, player2) {
  if(+player1.tile.number==+player2.tile.number){
    let tileAlphabetOfPlayer1 = player1.tile.alphabet.charCodeAt(0);
    let tileAlphabetOfPlayer2 = player2.tile.alphabet.charCodeAt(0);
    return tileAlphabetOfPlayer1>tileAlphabetOfPlayer2;
  }
  return +player1.tile.number > +player2.tile.number;
};
const getId = function(player) {
  return player.id;
};
const orderPlayers = function(players){
  let namesAndTiles = players.map(getNameAndTile);
  let orderedPlayers = namesAndTiles.sort(sortOrder);
  let orderedPlayersId = orderedPlayers.map(getId);
  return orderedPlayersId;
};
exports.orderPlayers = orderPlayers;
