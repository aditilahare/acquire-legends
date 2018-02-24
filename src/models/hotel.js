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
  getAllOccupiedTiles(){
    return this.occupiedTiles;
  }
  removeAllOccupiedTiles(){
    this.occupiedTiles=[];
    return ;
  }
  doesOccupiedTilesInclude(tile){
    let placedTile = tile;
    return this.occupiedTiles.includes(tile);
  }
  addTilesToOccupiedTiles(tiles){
    this.occupiedTiles=this.occupiedTiles.concat(tiles);
  }
  getSize(){
    return this.occupiedTiles.length;
  }
}

module.exports = Hotel;
