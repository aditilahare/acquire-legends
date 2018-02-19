const areTilesAdjacent = require('../utils/tileUtilities.js').areTilesAdjacent;

class Hotel {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.totalShares=shares;
    this.occupiedTiles = [];
  }
  getDetails() {
    let hotelDetails = {
      name: this.name,
      color: this.color,
      totalShares:this.totalShares
    };
    return hotelDetails;
  }
  getName(){
    return this.name;
  }
  occupyTile(tile){
    this.occupiedTiles.push(tile);
  }
  doesOccupiedTilesInclude(tile){
    let placedTile = tile;
    return this.occupiedTiles.includes(tile);
  }
}

module.exports = Hotel;
