let getTiles = function(noOfTiles) {
  let randomTiles=[];
  for(let iter = 0; iter < noOfTiles; iter++) {
    let maxTilesIndex = this.tiles.length-1;
    let tileIndex = Math.floor(Math.random() * maxTilesIndex);
    randomTiles.push(this.tiles[tileIndex]);
    this.removeTile(tileIndex);
  }
  return randomTiles;
};

class TileBox {
  constructor(cols, rows, shufflingMechanism=getTiles) {
    this.cols = cols;
    this.rows = rows;
    this.tiles=this.generateTiles();
    this.getTiles = shufflingMechanism.bind(this);
  }
  generateTiles() {
    let tiles=[];
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      for (let colIndex = 1; colIndex <= this.cols; colIndex++) {
        let tile=`${colIndex}${String.fromCharCode(65+rowIndex)}`;
        tiles.push(tile);
      }
    }
    return tiles;
  }
  removeTile(tileIndex) {
    if(tileIndex >= this.tiles.length) {
      return false;
    }
    this.tiles.splice(tileIndex, 1);
    return true;
  }

}
module.exports=TileBox;
