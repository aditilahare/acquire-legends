class Player {
  constructor(playerId,playerName) {
    this.name = playerName;
    this.id = playerId;
    this.tiles=[];
  }
  addTile(tile){
    this.tiles.push(tile);
  }
}

module.exports = Player;
