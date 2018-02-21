const assert = require('chai').assert;
const Market = require('../../src/models/market.js');
const Hotel = require('../../src/models/hotel.js');

describe('Market', () => {
  describe('place a independent tile',()=>{
    it('can place a tile as a independent tile',()=>{
      let market = new Market();
      market.placeTile('2B');
      let actual = market.giveIndependentTiles();
      assert.deepEqual(actual,['2B']);
      market.placeTile('5A');
      actual = market.giveIndependentTiles();
      assert.deepEqual(actual,['2B','5A']);
    });
  });
  describe('get Neighbour Hotels Of Tile',()=>{
    it('should return a list of hotels that are adjacent to given tile',()=>{
      let market = new Market();
      let zeta = new Hotel('Zeta','yellow');
      zeta.occupiedTiles=['1A','2A','1B','2B'];
      market.hotels.push(zeta);
      let expected = [zeta];
      assert.deepEqual(market.getNeighbourHotelsOfTile('2C'),[]);
      assert.deepEqual(market.getNeighbourHotelsOfTile('3A'),[]);
      assert.deepEqual(market.getNeighbourHotelsOfTile('3B'),[]);
      assert.deepEqual(market.getNeighbourHotelsOfTile('3C'),[]);
    });
  });
  describe('getInactiveHotels',()=>{
    it('should show inactive hotels',()=>{
      let market = new Market();
      let zeta = new Hotel('Zeta','yellow');
      zeta.status=false;
      market.hotels.push(zeta);
      assert.deepEqual(market.getInactiveHotels(),[zeta]  );

      market = new Market();
      zeta = new Hotel('Zeta','yellow');
      zeta.occupiedTiles=['1A','2A','1B','2B'];
      market.occupiedTiles=['1A','2A','1B','2B'];
      zeta.status=true;
      market.hotels.push(zeta);
      assert.deepEqual(market.placeTile('1C'),{status:"Added to hotel"});

      market = new Market();
      zeta = new Hotel('Zeta','yellow');
      zeta.occupiedTiles=['1A','1B'];
      market.occupiedTiles=['1A','1B'];
      market.hotels.push(zeta);
      assert.deepEqual(market.placeTile('1C'),{hotelName:'Zeta',status:"starting hotel",
      tiles:['1B','1C']});
    });
    describe('place a independent tile',()=>{
      it('can place a tile as a independent tile',()=>{
        let market = new Market();
        market.placeTile('2B');
        let actual = market.giveIndependentTiles();
        assert.deepEqual(actual,['2B']);
        market.placeTile('5A');
        actual = market.giveIndependentTiles();
        assert.deepEqual(actual,['2B','5A']);
      });
    });
  })
  describe('calculate share price',()=>{
    it('it should return share price according to level and size',()=>{
      let market = new Market();
      let zeta = new Hotel('Zeta','yellow');
      zeta.occupiedTiles=['1A','2A','1B','2B'];
      market.hotels.push(zeta);
      let expected = [zeta];
      assert.equal(market.calculateSharePrice(2,2),200);
      assert.equal(market.calculateSharePrice(3,2),300);
      assert.equal(market.calculateSharePrice(6,3),700);
      assert.equal(market.calculateSharePrice(14,4),900);
      assert.equal(market.calculateSharePrice(21,2),800);
      assert.equal(market.calculateSharePrice(33,2),900);
      assert.equal(market.calculateSharePrice(41,2),1000);
    });
  });
});
