const getTiles = function(tileCount) {
  let tiles=this.tiles.splice(0,tileCount);
  return tiles;
};

exports.getTiles = getTiles;
