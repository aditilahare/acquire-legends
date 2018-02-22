const areTilesAdjacent = require('../utils/tileUtilities.js').areTilesAdjacent;

class Hotel {
  constructor(name, color, level) {
    this.name = name;
    this.color = color;
    this.occupiedTiles = [];
    this.level = level;
  }
  getDetails() {
    let hotelDetails = {
      name: this.name,
      color: this.color
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
  getSize(){
    return this.occupiedTiles.length;
  }
}

module.exports = Hotel;
