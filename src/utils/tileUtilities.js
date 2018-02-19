const tileAbove = function(tile) {
  let seperatedCharAndNum = seperateCharFromNum(tile);
  let number = (+seperatedCharAndNum.number)-1;
  let alphabet=seperatedCharAndNum.alphabet;
  let aboveTile = number+alphabet;
  return aboveTile;
};
const tileBelow = function(tile) {
  let seperatedCharAndNum = seperateCharFromNum(tile);
  let number = (+seperatedCharAndNum.number)+1;
  let alphabet=seperatedCharAndNum.alphabet;
  let belowTile = number+alphabet;
  return belowTile;
};

const tileOnRight = function(tile) {
  let seperatedCharAndNum = seperateCharFromNum(tile);
  let number = seperatedCharAndNum.number;
  let alphabet = nextChar(seperatedCharAndNum.alphabet);
  let tileOnRight = number+alphabet;
  return tileOnRight;
};

const tileOnLeft = function(tile) {
  let seperatedCharAndNum = seperateCharFromNum(tile);
  let number = seperatedCharAndNum.number;
  let alphabet = previousChar(seperatedCharAndNum.alphabet);
  let tileOnLeft = number+alphabet;
  return tileOnLeft;
};

const nextChar = function (alphabet) {
  let charCode = alphabet.charCodeAt(0);
  return String.fromCharCode(charCode+1);
};

const previousChar = function(alphabet) {
  let charCode = alphabet.charCodeAt(0);
  return String.fromCharCode(charCode-1);
};

const seperateCharFromNum = function(tile){
  tile = tile.split('');
  let alphabet = tile.pop();
  let number=tile.join('');
  return {
    number : number,
    alphabet : alphabet
  };
};

const neighbourTilesOf = function(tile){
  let tiles = [];
  tiles.push(tileAbove(tile));
  tiles.push(tileBelow(tile));
  tiles.push(tileOnRight(tile));
  tiles.push(tileOnLeft(tile));
  return tiles;
};
const areTilesAdjacent = function(placedTile,occupiedTile){
  return neighbourTilesOf(placedTile).includes(occupiedTile);
};


exports.areTilesAdjacent=areTilesAdjacent;
exports.neighbourTilesOf=neighbourTilesOf;
