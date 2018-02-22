class TileBox {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.tiles=this.generateTiles();
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
  getTiles(noOfTiles) {
    let nTiles=this.tiles.splice(0,noOfTiles);
    return nTiles;
  }
}
module.exports=TileBox;
