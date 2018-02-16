class Player {
  constructor(playerId,playerName) {
    this.name = playerName;
    this.id = playerId;
    this.tiles=[];
  }
  addTile(tile){
    this.tiles.push(tile);
  }
  getTiles(){
    return this.tiles;
  }
  addTiles(tiles){
    this.tiles=tiles;
  }
}

module.exports = Player;
