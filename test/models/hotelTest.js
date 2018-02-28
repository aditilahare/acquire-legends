const assert = require('chai').assert;
const Hotel = require('../../src/models/hotel.js');

describe('Hotel test', function(){
  describe('getDetails', function(){
    it('should return object of hotel name and color', function(){
      let zeta=new Hotel('zeta','yellow');
      let expected={
        name:'zeta',
        color:'yellow'
      };
      assert.deepEqual(zeta.getDetails(),expected);
    });
    it('should return object of hotel name and color', function(){
      let zeta=new Hotel('zeta','yellow');
      let expected={
        name:'zeta',
        color:'yellow'
      };
      assert.deepEqual(zeta.getDetails(),expected);
    });
  });
  describe('is any occupied tile adjacent to this tile', function(){
    it('should return true for an adjacent tile', function(){
      let zeta = new Hotel('zeta','yellow');
      zeta.occupiedTiles.push('1A','2A','3A');
      assert.isOk(zeta.doesOccupiedTilesInclude('2A'));
    });
  });
  describe('occupy tile', function(){
    it('should occupy the given tile', function(){
      let zeta = new Hotel('zeta','yellow');
      zeta.occupyTile('1A');
      let expected = ['1A'];
      assert.deepEqual(zeta.occupiedTiles,expected);
    });
  });
  describe('getSize()', function(){
    it('should give its number of tiles', function(){
      let zeta = new Hotel('zeta','yellow');
      zeta.occupyTile('1A');
      zeta.occupyTile('2A');
      assert.equal(zeta.getSize(),2);
    });
  });
  describe('doesOccupiedTilesInclude()',()=>{
    it('should give ture when hotel has given share',()=>{
      let zeta = new Hotel('zeta','yellow');
      zeta.occupyTile('1A');
      zeta.occupyTile('2A');
      assert.isTrue(zeta.doesOccupiedTilesInclude('2A'));
    })
  })
  describe('getAllOccupiedTiles()',()=>{
    it('should give all occupiedTiles hotel has',()=>{
      let zeta = new Hotel('zeta','yellow');
      zeta.occupyTile('1A');
      zeta.occupyTile('2A');
      assert.deepEqual(zeta.getAllOccupiedTiles(),['1A','2A']);
    })
  })
  describe('removeAllOccupiedTiles()',()=>{
    it('should remove all occupiedTiles hotel has',()=>{
      let zeta = new Hotel('zeta','yellow');
      zeta.occupyTile('1A');
      zeta.occupyTile('2A');
      zeta.removeAllOccupiedTiles();
      assert.deepEqual(zeta.getAllOccupiedTiles(),[]);
    })
  })
  describe('addTilesToOccupiedTiles()',()=>{
    it('should add all given tiles to occupiedTiles hotel has',()=>{
      let zeta = new Hotel('zeta','yellow');
      zeta.occupyTile('1A');
      zeta.occupyTile('2A');
      zeta.addTilesToOccupiedTiles(['3A','4A','5A']);
      assert.deepEqual(zeta.getAllOccupiedTiles(),['1A','2A','3A','4A','5A']);
    })
  })
});
