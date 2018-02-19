class Market{
  constructor(){
    this.independentTiles=[];
  }
  placeAsIndependentTile(tile){
    this.independentTiles.push(tile);
  }
  giveIndependentTiles(){
    return this.independentTiles;
  }
}

module.exports = Market;
