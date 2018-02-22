const assert = require('chai').assert;
const Market = require('../../src/models/market.js');
const Hotel = require('../../src/models/hotel.js');

describe('Market', () => {
  describe('place a independent tile', () => {
    it('can place a tile as a independent tile', () => {
      let market = new Market();
      market.placeTile('2B');
      let actual = market.giveIndependentTiles();
      assert.deepEqual(actual, ['2B']);
      market.placeTile('5A');
      actual = market.giveIndependentTiles();
      assert.deepEqual(actual, ['2B', '5A']);
    });
  });
  describe('get Neighbour Hotels Of Tile', () => {
    it('should return a list of hotels that are adjacent to given tile', () => {
      let market = new Market();
      let zeta = new Hotel('Zeta', 'yellow');
      zeta.occupiedTiles = ['1A', '2A', '1B', '2B'];
      market.hotels.push(zeta);
      let expected = [zeta];
      assert.deepEqual(market.getNeighbourHotelsOfTile('2C'), []);
      assert.deepEqual(market.getNeighbourHotelsOfTile('3A'), []);
      assert.deepEqual(market.getNeighbourHotelsOfTile('3B'), []);
      assert.deepEqual(market.getNeighbourHotelsOfTile('3C'), []);
    });
  });
  describe('getInactiveHotels', () => {
    it('should show inactive hotels', () => {
      let market = new Market();
      let zeta = new Hotel('Zeta', 'yellow');
      zeta.status = false;
      market.hotels.push(zeta);
      assert.deepEqual(market.getInactiveHotels(), [zeta]);

      market = new Market();
      zeta = new Hotel('Zeta','yellow');
      zeta.occupiedTiles=['1A','2A','1B','2B'];
      market.occupiedTiles=['1A','2A','1B','2B','1D'];
      zeta.status=true;
      market.hotels.push(zeta);
      assert.deepEqual(market.placeTile('1C'), {
        status: "Added to hotel"
      });

      market = new Market();
      zeta = new Hotel('Zeta', 'yellow');
      zeta.occupiedTiles = ['1A', '1B', "3A"];
      market.occupiedTiles = ['1A', '1B'];
      market.hotels.push(zeta);
      assert.deepEqual(market.placeTile('1C'), {
        hotelName: 'Zeta',
        status: "starting hotel",
        tiles: ['1B', '1C']
      });
    });
    describe('place a independent tile', () => {
      it('can place a tile as a independent tile', () => {
        let market = new Market();
        zeta = new Hotel('Zeta', 'yellow');
        zeta.occupiedTiles = ['1A', '1B', "3A"];
        zeta.level = 2;
        zeta.status = true;
        market.occupiedTiles = ['1A', '1B', "3A"];
        market.hotels.push(zeta);
        let expected = [{
          name: 'Zeta',
          color: 'yellow',
          occupiedTiles: ['1A', '1B', '3A'],
          level: 2,
          status: true,
          sharePrice: 300
        }]
        assert.deepEqual(market.getAllHotelsDetails(), expected);
      });
    });
  });
  describe('get all hotel details',()=>{
    it('should give list of hotel class objects which contain their share price respect to their chain-size',()=>{
      let jagadamba = new Market();
      let hotel = {name:'zeta',color:'yellow',level:2};
      jagadamba.createHotel(hotel);
      jagadamba.placeTile('1A');
      jagadamba.placeTile('1B');
      let expected ={name:'zeta',color:'yellow',occupiedTiles:['1A','1B'],level: 2,status: true,sharePrice:200};
      assert.deepInclude(jagadamba.getAllHotelsDetails(),expected);
    });
  });
  describe('calculate share price',()=>{
    it('it should return share price according to level and size',()=>{
      let market = new Market();
      market.placeTile('2B');
      let actual = market.giveIndependentTiles();
      assert.deepEqual(actual, ['2B']);
      market.placeTile('5A');
      actual = market.giveIndependentTiles();
      assert.deepEqual(actual, ['2B', '5A']);
    });
  });

  describe('getSharePriceOfActiveHotel', () => {
    it('it should return share price of active hotels as per \
    hotelSize and level', () => {
      let market = new Market();
      let hotel = {
        name: "Zeta",
        color: "blue",
        level: 2
      };
      market.createHotel(hotel);
      assert.equal(market.getSharePriceOfActiveHotel("Zeta"), 0);
      market.placeTile('1A');
      market.placeTile('2A');
      assert.equal(market.getSharePriceOfActiveHotel("Zeta"), 200);
    });
  });
  describe('calculate share price', () => {
    it('it should return share price according to level and size', () => {
      let market = new Market();
      assert.equal(market.calculateSharePrice(2, 2), 200);
      assert.equal(market.calculateSharePrice(3, 2), 300);
      assert.equal(market.calculateSharePrice(6, 3), 700);
      assert.equal(market.calculateSharePrice(14, 4), 900);
      assert.equal(market.calculateSharePrice(21, 2), 800);
      assert.equal(market.calculateSharePrice(33, 2), 900);
      assert.equal(market.calculateSharePrice(41, 2), 1000);
    });
  });
  describe('isAdjecentToAnyHotel()', () => {
    it('should give true when given tile is adjacent to at least one hotel', () => {
      let market = new Market();
      let zeta = new Hotel('Zeta', 'yellow');
      zeta.occupiedTiles = ['1A', '2A', '1B', '2B'];
      zeta.status=true;
      market.hotels.push(zeta);
      let expected = [zeta];
      assert.isTrue(market.isAdjecentToAnyHotel('2C'));
      assert.isTrue(market.isAdjecentToAnyHotel('3B'));
    });
  });
  describe('getLargerHotel()', () => {
    it('should give larger hotel among given', () => {
      let market = new Market();
      let zeta = new Hotel('Zeta', 'yellow');
      zeta.occupiedTiles = ['1A', '2A', '1B', '2B'];
      zeta.status=true;
      market.hotels.push(zeta);
      let sackson = new Hotel('Sackson', 'red');
      sackson.occupiedTiles = ['1C', '2C', '1D'];
      sackson.status=true;
      market.hotels.push(sackson);
      assert.equal(market.getLargerHotel(market.hotels),zeta);
    });
    it('should give larger hotel among given', () => {
      let market = new Market();
      let sackson = new Hotel('Sackson', 'red');
      sackson.occupiedTiles = ['1C', '2C', '1D'];
      sackson.status=true;
      market.hotels.push(sackson);
      let zeta = new Hotel('Zeta', 'yellow');
      zeta.occupiedTiles = ['1A', '2A', '1B', '2B'];
      zeta.status=true;
      market.hotels.push(zeta);
      assert.equal(market.getLargerHotel(market.hotels),zeta);
    });
  });
});
