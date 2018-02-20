const assert = require('chai').assert;
const Market = require('../../src/models/market.js');
const Hotel = require('../../src/models/hotel.js');

describe('Market', () => {
  describe('place a independent tile',()=>{
    it('can place a tile as a independent tile',()=>{
      let market = new Market();
      market.placeAsIndependentTile('2B');
      let actual = market.giveIndependentTiles();
      assert.deepEqual(actual,['2B']);
      market.placeAsIndependentTile('5A');
      actual = market.giveIndependentTiles();
      assert.deepEqual(actual,['2B','5A']);
    });
  });
  describe('get Neighbour Hotels Of Tile',()=>{
    it('should return a list of hotels that are adjacent to given tile',()=>{
      let market = new Market();
      let zeta = new Hotel('Zeta','yellow');
      zeta.occupiedTiles=['1A','2A','1B','2B'];
      market.activeHotels.push(zeta);
      let expected = [zeta];
      assert.deepEqual(market.getNeighbourHotelsOfTile('1C'),expected);
      assert.deepEqual(market.getNeighbourHotelsOfTile('2C'),expected);
      assert.deepEqual(market.getNeighbourHotelsOfTile('3A'),expected);
      assert.deepEqual(market.getNeighbourHotelsOfTile('3B'),expected);
      assert.notDeepEqual(market.getNeighbourHotelsOfTile('3C'),expected);
    });
  });
  describe('add tile to existing hotel',()=>{
    it('should add tile to occupied tiles of ajacent hotel of given tile',()=>{
      let market = new Market();
      let zeta = new Hotel('Zeta','yellow');
      zeta.occupiedTiles=['1A','2A','1B','2B'];
      market.activeHotels.push(zeta);
      market.addTileToExistingHotel('1C');
      market.addTileToExistingHotel('3C');
      let  expected = 5;
      assert.deepEqual(market.activeHotels[0].occupiedTiles.length,expected);
    });
  })
});
