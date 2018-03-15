//eslint max-len: ["error", { "ignoreStrings": true }]
const assert = require('chai').assert;
let Game = require('../../src/models/game.js');
let TileBox = require('../../src/models/tileBox.js')
const Player = require('../../src/models/player.js');
const Hotel = require('../../src/models/hotel.js');
const Market = require('../../src/models/market.js');
const Turn = require('../../src/models/turn.js');
const Bank = require('../../src/models/bank.js');
const mockRandomTiles = require('../helpers/mockRandomTiles.js').getTiles;

describe('game test', function() {
  let tileBox;
  beforeEach(() => {
    tileBox = new TileBox(12, 9, mockRandomTiles);
  });
  describe('getPlayerCount', () => {
    it('should return the number of players', () => {
      let game = new Game(3, tileBox);
      let actual = game.getPlayerCount();
      assert.equal(actual, 0);
    });
  });
  describe('getPlayerCount', () => {
    it('should return the number of players', () => {
      let game = new Game(3, tileBox);
      let actual = game.getPlayerCount();
      assert.equal(actual, 0);
    });
  });
  describe('addPlayer', () => {
    it('should add given player to game when maximum players are not there', () => {
      let game = new Game(3, tileBox);
      let player = new Player(0, 'pragya');
      let actual = game.addPlayer(player);
      assert.isOk(actual);
    });
    it('should not  add given player to game when maximum \
    players reached', () => {
      let game = new Game(0, tileBox);
      let player = {
        name: 'pragya',
        id: 0
      };
      let actual = game.addPlayer(player);
      assert.isNotOk(actual);
    });
  });
  describe('isVacant', () => {
    it('should return false if maximum players are  reached', () => {
      let game = new Game(0, tileBox);
      assert.isNotOk(game.isVacant());
    });
    it('should return true if maximum players are not reached', () => {
      let game = new Game(1, tileBox);
      assert.isOk(game.isVacant());
    });
  });
  describe('haveAllPlayersJoined', () => {
    it('should return true if all players have joined', () => {
      let game = new Game(0, tileBox);
      assert.isOk(game.haveAllPlayersJoined());
    });
    it('should return false if all players have not joined', () => {
      let game = new Game(1, tileBox);
      assert.isNotOk(game.haveAllPlayersJoined());
    });
  });
  describe('getPlayerNameById', () => {
    it('should return player name of given id', () => {
      let game = new Game(3, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'gupta');
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.equal('pragya', game.getPlayerNameById(0));
      assert.equal('gupta', game.getPlayerNameById(1));
      assert.equal('', game.getPlayerNameById(2));
    });
  });
  describe('distributeInitialTiles', () => {
    it('should give 6 tiles to all players', () => {
      let game = new Game(2, tileBox);
      let veera = new Player(0, 'veera');
      let aditi = new Player(0, 'aditi');
      game.addPlayer(veera);
      game.addPlayer(aditi);
      game.distributeInitialTiles();
      assert.deepEqual(veera.getTiles(), ['1A', '2A', '3A', '4A', '5A', '6A']);
      assert.deepEqual(aditi.getTiles(), ['7A', '8A', '9A', '10A', '11A', '12A']);
    });
  });
  describe('findPlayerByIdId', () => {
    it('should return player of given id', () => {
      let game = new Game(3, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'gupta');
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.deepEqual(player1, game.findPlayerById(0));
      assert.deepEqual(player2, game.findPlayerById(1));
      assert.deepEqual(undefined, game.findPlayerById(2));
    });
  });
  describe('distributeMoneyToPlayer', () => {
    it('should give money to player of given id', () => {
      let game = new Game(3, tileBox);
      let player1 = new Player(0, 'pragya');
      game.addPlayer(player1);
      assert.equal(game.getAvailableCashOfPlayer(0), 0);
      game.distributeMoneyToPlayer(0, 4000);
      assert.equal(game.getAvailableCashOfPlayer(0), 4000);
    });
  });
  describe('distributeInitialMoney', () => {
    it('should disribute money to all players', () => {
      let game = new Game(3, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'sree');
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.equal(game.getAvailableCashOfPlayer(0), 0);
      assert.equal(game.getAvailableCashOfPlayer(1), 0);
      game.distributeInitialMoney(6000);
      assert.equal(game.getAvailableCashOfPlayer(0), 6000);
      assert.equal(game.getAvailableCashOfPlayer(1), 6000);
    });
  });
  describe('start', () => {
    it('should disribute money and tiles to all players and create hotels', () => {
      let game = new Game(2, tileBox);
      let player1 = new Player(0, 'veera');
      let player2 = new Player(1, 'pragya');
      let hydraHotel = {
        name: 'Hydra',
        color: 'orange',
        occupiedTiles: [],
        level: 3
      };

      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.equal(game.getAvailableCashOfPlayer(0), 0);
      assert.equal(game.getAvailableCashOfPlayer(1), 0);
      game.start();
      assert.deepEqual(game.getHotel('Hydra'), hydraHotel);
      assert.equal(game.getAvailableCashOfPlayer(0), 6000);
      assert.equal(game.getAvailableCashOfPlayer(1), 6000);
      assert.deepEqual(player1.getTiles(), ['3A', '4A', '5A', '6A', '7A', '8A', ]);
      assert.deepEqual(player2.getTiles(), ['9A', '10A', '11A', '12A', '1B', '2B']);
    });
  });
  describe('createHotels', () => {
    it('should create hotels for the given names and colors', () => {
      let game = new Game(2, tileBox);
      let hotelsData = [{
        name: 'zeta',
        color: 'yellow',
        level: 2
      }];
      let zetaHotel = {
        name: 'zeta',
        color: 'yellow',
        level: 2,
        occupiedTiles: []
      };
      game.createHotels(hotelsData);
      assert.deepEqual(game.getHotel('zeta'), zetaHotel);
    });
  });
  describe('getPlayerDetails', () => {
    it('should return an object containig player details', () => {
      let game = new Game(2, tileBox);
      let expected = ['1A', '2A', '3A', '4A', '5A', '6A'];
      let player1 = new Player(0, 'veera');
      let player2 = new Player(1, 'pragya');
      game.addPlayer(player1);
      game.addPlayer(player2);
      player1.addTiles(['1A', '2A', '3A', '4A', '5A', '6A']);
      assert.deepEqual(game.getPlayerDetails(0).tiles, expected);
      assert.deepEqual(game.getPlayerDetails(0), player1);
    });
    it('should return an object containing share details of player', () => {
      let game = new Game(2, tileBox);
      let aditi = new Player(0, 'aditi');
      let harvar = new Player(1, 'harvar');
      let expected = {
        phoenix: 2,
        hydra: 5
      };
      game.addPlayer(aditi);
      game.addPlayer(harvar);
      aditi.addShares('Phoenix', 5);
      harvar.addShares('Hydra', 2);
      assert.include(game.findPlayerById(0).getShareDetails(), {
        Phoenix: 5
      });
      assert.include(game.findPlayerById(1).getShareDetails(), {
        Hydra: 2
      });
    });
  });
  describe('isInPlayMode', () => {
    it('should return false when game is not in play mode ', () => {
      let game = new Game(2, tileBox);
      let player1 = new Player(0, 'veera');
      let player2 = new Player(1, 'pragya');
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.isNotOk(game.isInPlayMode());
    });
    it('should return true if game is in play mode ', () => {
      let game = new Game(2, tileBox);
      let player1 = new Player(0, 'veera');
      let player2 = new Player(1, 'pragya');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.start();
      assert.isOk(game.isInPlayMode());
    });
  });
  describe('getAllHotelsDetails', function() {
    it('can tell all the hotel details in game', function() {
      let game = new Game(2, tileBox);
      let hotelsData = [{
        name: 'zeta',
        color: 'yellow',
        level: 2
      }];
      let expected = [{
        name: 'zeta',
        color: 'yellow',
        level: 2,
        occupiedTiles: [],
        sharePrice: "-",
        shares: 25
      }];
      game.createHotels(hotelsData);
      assert.deepEqual(game.getAllHotelsDetails(), expected);
    });
  });
  describe('getAllPlayerNames', () => {
    it('can give empty list if no player is present', () => {
      let game = new Game(2, tileBox);
      assert.deepEqual(game.getAllPlayerNames(), []);
    });
    it('can give all player names', () => {
      let game = new Game(2, tileBox);
      let player1 = new Player(0, 'veera');
      let player2 = new Player(1, 'pragya');
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.deepEqual(game.getAllPlayerNames(), ['veera', 'pragya']);
    });
  });
  describe('addSharesToPlayer', () => {
    it('should add shares to player by given id', () => {
      let game = new Game(2, tileBox);
      let player1 = new Player(0, 'aditi');
      let player2 = new Player(1, 'harvar');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addSharesToPlayer(0, 'Phoenix', 2);
      game.addSharesToPlayer(1, 'Hydra', 5);
      assert.include(game.findPlayerById(0).getShareDetails(), {
        Phoenix: 2
      });
      assert.include(game.findPlayerById(1).getShareDetails(), {
        Hydra: 5
      });
    });
  });
  describe('placeTile', () => {
    it('can place a independent Tile for the player whose id is given', () => {
      let game = new Game(1, tileBox);
      let player1 = new Player(1, 'pragya');
      let market = new Market();
      game.addPlayer(player1);
      game.start();
      game.placeTile(1, '2A');
      let actual = game.giveIndependentTiles();
      let expected = ['1A', '2A'];
      assert.deepEqual(actual, expected);
    });
    it('Game should over when all hotels are stable', () => {
      let game = new Game(3, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'wulfa');
      let player3 = new Player(2, 'harvar');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.start();

      game.placeTile(0, '4A');
      game.placeTile(0, '5A');
      game.startHotel('Zeta', 0);
      game.placeTile(0, '6A');
      game.placeTile(0, '7A');
      game.placeTile(0, '8A');
      game.placeTile(0, '9A');
      game.placeTile(1, '10A');
      game.placeTile(1, '11A');
      game.placeTile(1, '12A');
      game.placeTile(2, '4B');
      game.placeTile(2, '5B');
      let turnDetails=game.getTurnDetails(0);
      assert.equal(turnDetails.state.status,'gameOver');


    });
  });
  describe('startHotel',()=>{
    it('should start a hotel in market & give a free share to founder',()=>{
      let game = new Game(1, tileBox);
      let player1 = new Player(1, 'pragya');
      let market = new Market();
      game.addPlayer(player1);
      game.start();
      game.placeTile(1,'2A');
      let zeta = game.bank.sharesDetailsOfHotels.find(hotel=>hotel.hotelName=='Zeta');
      zeta.availableShares=0;
      game.startHotel('Zeta',1);
      let player = game.findPlayerById(1);
      assert.deepEqual(player.shares.Zeta,0);
    });
  });
  describe('getCurrentPlayer', () => {
    it('should give current player details', () => {
      let game = new Game(1, tileBox);
      let player1 = new Player(0, 'pragya');
      game.addPlayer(player1);
      game.addPlayer(new Player(1, 'veera'));
      game.start();
      let actual = game.getCurrentPlayer();
      assert.equal(actual.id, 0)
    });
  });
  describe('changeCurrentPlayer', () => {
    it('should change current player and give tile for current player', () => {
      let game = new Game(2, tileBox);
      let player1 = new Player(0, 'pragya');
      game.addPlayer(player1);
      game.addPlayer(new Player(1, 'veera'));
      game.start();
      game.changeCurrentPlayer();
      let actual = game.getCurrentPlayer();
      assert.equal(actual.id, 1)
      assert.equal(player1.tiles.length, 7)
    });
    it('should change current player with out adding tile to current player', () => {
      tileBox = new TileBox(2,7, mockRandomTiles);
      let game = new Game(2, tileBox);
      let player1 = new Player(0, 'pragya');
      game.addPlayer(player1);
      game.addPlayer(new Player(1, 'veera'));
      game.start();
      game.changeCurrentPlayer();
      let actual = game.getCurrentPlayer();
      assert.equal(actual.id, 1)
      assert.equal(player1.tiles.length, 6)
    });
  });
  describe('isCurrentPlayer', () => {
    it('should return true if player is current player', () => {
      let game = new Game(2, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let turn = new Turn([0, 1]);
      game.addPlayer(player1);
      game.start();
      let playerId = turn.getCurrentPlayerID();
      assert.isOk(game.isCurrentPlayer(playerId));
    });
  });
  describe('getStatus', () => {
    it('should give current game status', () => {
      let expected = {
        hotelsData: [],
        turnDetails: {
          currentAction:'placeTile',
          "message": "Please place a tile.",
          currentPlayer: 'pragya',
          otherPlayers: ['pragya', 'aditi'],
          isMyTurn: true,
          state:{
            status:'placeTile'
          }
        }
      };
      let game = new Game(2, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.start();
      assert.deepEqual(game.getStatus(0).independentTiles, ['1A', '2A']);
      assert.deepEqual(game.getStatus(0).turnDetails, expected.turnDetails);
    });
  });
  describe('deductMoneyFromPlayer', () => {
    it('should deduct money from player account', () => {
      let game = new Game(2, tileBox);
      let player1 = new Player(0, 'pragya');
      player1.addMoney(5000);
      game.addPlayer(player1);
      game.deductMoneyFromPlayer(0, 1600);
      let actual = game.getAvailableCashOfPlayer(0);
      let expected = 3400;
      assert.deepEqual(actual, expected);
    });
  });
  describe('purchaseShares', () => {
    it('should purchase shares to given players', () => {
      //setup
      let game = new Game(3, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'wulfa');
      let player3 = new Player(2, 'harvar');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.start();
      assert.deepEqual(game.placeTile(0, '6A').status, 'independentTile');
      game.changeCurrentPlayer();
      assert.deepEqual(game.placeTile(0, '7A').status, 'chooseHotel');
      game.startHotel('Zeta', 0);
      game.placeTile(0, '4A');
      game.purchaseShares('Zeta', 2, 0);
      game.changeCurrentPlayer();
      game.placeTile(0, '9A');
      game.purchaseShares('Zeta', 2, 1);
      game.changeCurrentPlayer();
      game.placeTile(2, '4B');
      game.purchaseShares('Zeta', 2, 2);
      game.changeCurrentPlayer();

      //code execution
      game.placeTile(0, '5A')
      game.purchaseShares('Zeta', 2, 0);

      //assertion
      let expected = 4400;
      let actual = player1.getAvailableCash();
      assert.deepEqual(actual, expected);

      expected = {
        Sackson: 0,
        Zeta: 5,
        Hydra: 0,
        Fusion: 0,
        America: 0,
        Phoenix: 0,
        Quantum: 0
      };
      actual = player1.getShareDetails();
      assert.deepEqual(actual, expected);
      expected = {
        hotelName: 'Zeta',
        availableShares: 16,
        shareHolders: [{
          "id": 0,
          "noOfShares": 5
        }, {
          "id": 1,
          "noOfShares": 2
        }, {
          "id": 2,
          "noOfShares": 2
        }]
      };
      actual = game.bank.sharesDetailsOfHotels;
      assert.deepInclude(actual[1], expected);
    });
  });
  describe('removePlayer()', () => {
    it('should remove player for valid player id', () => {
      let game = new Game(2, tileBox);
      let player1 = new Player(1, 'Frank');
      let player2 = new Player(2, 'Martin');
      game.addPlayer(player1);
      game.addPlayer(player2);
      let expected = [
      {
        "availableMoney": 6000,
        "id": 2,
        "name": "Martin",
        "shares": {
            "America": 0,
            "Fusion": 0,
            "Hydra": 0,
            "Phoenix": 0,
            "Quantum": 0,
            "Sackson": 0,
            "Zeta": 0
        },
        "tiles": [
              "9A",
              "10A",
              "11A",
              "12A",
              "1B",
              "2B"
            ]
      }];
      game.start();
      game.removePlayer(1);
      assert.deepEqual(game.players, expected);
    });
  });
  describe('getPlayerLimit()', () => {
    it('should return  maximum number of players that can join the game',() => {
      let game = new Game(2, tileBox);
      let player1 = new Player(1, 'Frank');
      let player2 = new Player(2, 'Martin');
      assert.equal(game.getPlayerLimit(),2);
    });
  });
  describe('actions', () => {
    it('should add tile to an existing hotel', () => {
      let expected = {};
      let game = new Game(2, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.start();
      assert.deepEqual(game.placeTile(0, '6A').status, 'independentTile');
      game.changeCurrentPlayer();
      assert.deepEqual(game.placeTile(0, '7A').status, 'chooseHotel');
      game.startHotel('Zeta', 0);
      game.changeCurrentPlayer();
      assert.deepEqual(game.placeTile(0, '5A').status, 'addedToHotel');
    });
    it('should change turn when player dont have enough money\
    \ to buy shares ', () => {
      let expected = {};
      let game = new Game(2, tileBox);
      let player1 = new Player(0, 'pragya');
      game.addPlayer(player1);
      game.start();
      game.placeTile(0, '2A');
      game.changeCurrentPlayer();
      game.placeTile(0, '3A');
      game.startHotel('Quantum', 0);
      game.purchaseShares('Quantum', 3, 0);
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.purchaseShares('Quantum', 3, 0);
      game.changeCurrentPlayer();
      game.placeTile(0, '5A');
      game.purchaseShares('Quantum', 3, 0);
      game.changeCurrentPlayer();
      game.placeTile(0, '6A');
      game.purchaseShares('Quantum', 2, 0);
      game.changeCurrentPlayer();
      game.placeTile(0, '7A');
      assert.deepEqual(game.turn.state.status, 'placeTile');
    });
    it('merge', () => {
      game = new Game(3, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.start();
      game.placeTile(0, '6A');
      game.changeCurrentPlayer();
      game.placeTile(0, '7A');
      game.startHotel('Sackson', 0);
      game.changeCurrentPlayer();
      game.placeTile(2, '4B');
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.startHotel('Zeta', 0);
      game.purchaseShares('Zeta', 2, 0);
      game.changeCurrentPlayer();
      let response = game.placeTile(0, '5A');
      let zeta = new Hotel('Zeta', 'rgb(236, 222, 34)', 2);
      zeta.occupiedTiles = ['4A','3A','2A','1A','4B'];
      zeta.status = true;
      let sackson = new Hotel('Sackson', 'rgb(205, 61, 65)', 2);
      sackson.occupiedTiles = ['7A','6A'];
      sackson.status = true;
      assert.deepEqual(response.status, 'merge');
      assert.deepEqual(response.mergingHotels, [sackson]);

      assert.deepEqual(response.survivorHotels, [zeta]);

      let majorityShareHolderPlayerMoney = game.findPlayerById(0).availableMoney;
      assert.equal(majorityShareHolderPlayerMoney, 8000);
    });
    it('merge', () => {
      let game = new Game(4, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      let player4 = new Player(3, 'specailPlayer');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.addPlayer(player4);
      game.start();
      game.placeTile(0, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.changeCurrentPlayer();
      game.placeTile(2, '8B');
      game.changeCurrentPlayer();
      game.placeTile(0, '5A');
      game.startHotel('Zeta', 0);
      game.purchaseShares('Zeta', 2, 0)
      game.changeCurrentPlayer();
      game.placeTile(0, '8A');
      game.startHotel('Sackson', 1);
      game.purchaseShares('Zeta', 1, 1)
      game.purchaseShares('Sackson', 1, 1)
      game.changeCurrentPlayer();
      game.placeTile(1, '4B');
      game.changeCurrentPlayer();
      game.placeTile(2, '9B');
      game.placeTile(1, '6C');
      game.startHotel('Fusion', 2)
      game.changeCurrentPlayer();
      game.placeTile(2, '10B');
      game.changeCurrentPlayer();
      let response = game.placeTile(0, '6A');
      let zeta = new Hotel('Zeta', 'rgb(236, 222, 34)', 2);
      zeta.occupiedTiles = ['5A','4A','3A','2A','1A','4B'];
      zeta.status = true;
      let sackson = new Hotel('Sackson', 'rgb(205, 61, 65)', 2);
      let expectedTilesOfSackson = ['8A','7A', '8B', '9B', '10B'];
      sackson.occupiedTiles = expectedTilesOfSackson;
      sackson.status = true;
      let fusion = new Hotel('Fusion', 'green', 3);
      fusion.occupiedTiles = ['6C','6B'];
      fusion.status = true;

      assert.deepEqual(response.status, 'merge');
      assert.deepEqual(response.mergingHotels, [sackson, fusion]);
      assert.deepEqual(response.survivorHotels, [zeta]);
      // assert.deepEqual(response.survivorHotel, zeta);

      let majorityShareHolderPlayerMoney = game.findPlayerById(0).availableMoney;
      assert.equal(majorityShareHolderPlayerMoney, 5000);
    });
    it('merge for two equal hotels', () => {
      let game = new Game(4, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      player1.addTile('5A');
      player2.addTile('7A');
      player3.addTile('5B');
      player1.addTile('7B');
      player2.addTile('9A');
      player3.addTile('6B');
      game.start();
      game.placeTile(0, '5A');
      game.changeCurrentPlayer();
      game.placeTile(0, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '5B');
      game.startHotel('Zeta', 2);
      game.changeCurrentPlayer();
      game.placeTile(0, '7B');
      game.startHotel('Sackson', 0);
      game.changeCurrentPlayer();
      game.placeTile(1, '9A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.tieBreaker("Sackson");
      let zeta = new Hotel('Zeta', 'rgb(236, 222, 34)', 2);
      zeta.occupiedTiles = ['5B','5A'];
      zeta.status = true;
      let sackson = new Hotel('Sackson', 'rgb(205, 61, 65)', 2);
      let expectedTilesOfSackson = ['7B','7A'];
      sackson.occupiedTiles = expectedTilesOfSackson;
      sackson.status = true;
      // assert.equal(game.updateStatus.getUpdationId(1),3);
      assert.deepEqual(game.getTurnState().status, 'disposeShares');
      assert.deepEqual(game.getTurnState().mergingHotels, [zeta]);
      assert.deepEqual(game.getTurnState().survivorHotels, [sackson]);

      let majorityShareHolderPlayerMoney = game.findPlayerById(2).availableMoney;
      assert.equal(majorityShareHolderPlayerMoney, 9000);
    });
    it('place invalid tile between stable hotels', () => {
      let game = new Game(3);
      let player1 = new Player(0, 'pragya');
      player1.addTile('6A');
      game.addPlayer(player1);
      game.turn = new Turn([0]);
      game.market.hotels = [new Hotel('Zeta'), new Hotel('Sackson'), new Hotel('a')];
      game.bank.createSharesOfHotel('Zeta',25);
      game.bank.createSharesOfHotel('Sackson',25);
      game.bank.createSharesOfHotel('a',25);
      let tiles = ['1A','1C','2A','2B','2C','3A','3B','4A','4B','5A','1B'];
      game.market.startHotel('Zeta', tiles);
      tiles = ['7A','7C','8A','8B','8C','9A','9B','10A','10B','11A','7B'];
      game.market.startHotel('Sackson', tiles);
      game.market.startHotel('a',['12I'])
      game.placeTile(0, '6A');
      assert.deepEqual(game.getTurnState().status, "placeTile");
    });
    it('gameOver condition', () => {
      let game = new Game(4, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      let player4 = new Player(3, 'specailPlayer');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.addPlayer(player4);
      game.start();
      game.placeTile(0, '5A');
      game.changeCurrentPlayer();
      game.placeTile(0, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.changeCurrentPlayer();
      game.placeTile(2, '8B');
      game.changeCurrentPlayer();
      game.placeTile(1, '4B');
      game.changeCurrentPlayer();
      game.placeTile(2, '9B');
      game.changeCurrentPlayer();
      game.placeTile(1, '6C');
      game.startHotel('Fusion', 2);
      game.changeCurrentPlayer();
      game.placeTile(2, '10B');
      game.changeCurrentPlayer();
      let response = game.placeTile(0, '6A');
      assert.deepEqual(response.status, 'addedToHotel');
    });
    it('disposeShares', () => {
      let game = new Game(4, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      let player4 = new Player(3, 'specailPlayer');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.addPlayer(player4);
      game.start();
      game.placeTile(0, '5A');
      game.startHotel('Zeta', 0);
      game.purchaseShares('Zeta', 2, 0)
      game.changeCurrentPlayer();
      // player2.addTile('7A');
      game.placeTile(0, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.changeCurrentPlayer();
      // player4.addTile('8B');
      game.placeTile(2, '8B');
      game.changeCurrentPlayer();
      // player1.addTile('4A');

      game.changeCurrentPlayer();
      // player2.addTile('8A');
      game.placeTile(0, '8A');
      game.startHotel('Sackson', 1);
      game.purchaseShares('Zeta', 1, 1)
      game.purchaseShares('Sackson', 1, 1)
      game.changeCurrentPlayer();
      // player3.addTile('4B');
      game.placeTile(1, '4B');
      game.changeCurrentPlayer();
      // player4.addTile('9B');
      game.placeTile(2, '9B');
      // player1.addTile('1A');
      //game.placeTile(0, '1A');
      game.changeCurrentPlayer();
      game.placeTile(1, '6C');
      game.startHotel('Fusion', 1)
      game.changeCurrentPlayer();
      // player3.addTile('10B');
      game.placeTile(1, '2B');
      game.changeCurrentPlayer();
      // player4.addTile('6A');
      game.placeTile(2, '10B');
      game.changeCurrentPlayer();
      game.placeTile(0, '9C');
      game.changeCurrentPlayer();
      game.placeTile(0, '9A');
      game.changeCurrentPlayer();
      game.placeTile(3, '3C');
      game.changeCurrentPlayer();
      game.placeTile(3, '8C');
      game.changeCurrentPlayer();
      game.placeTile(0, '6A')
      assert.deepEqual(game.getTurnState().status, 'disposeShares');
      game.disposeShares(0, {
        hotelName: "Zeta",
        noOfSharesToSell: 3
      });
      game.disposeShares(1, {
        hotelName: "Zeta",
        noOfSharesToSell: 1
      });
      game.disposeShares(1, {
        hotelName: "Fusion",
        noOfSharesToSell: 1
      });
      let zeta = new Hotel('Zeta', 'rgb(236, 222, 34)', 2);
      zeta.occupiedTiles = [];
      zeta.status = false;
      let sackson = new Hotel('Sackson', 'rgb(205, 61, 65)', 2);
      let expectedTilesOfSackson= ["8A","7A","8B","9B","10B","9C","9A","8C"];
      sackson.occupiedTiles = expectedTilesOfSackson;
      sackson.sharePrice = 600;
      sackson.shares = 23;
      sackson.status = true;
      let status = game.getStatus(0);
      assert.deepEqual(game.getTurnState().status, 'gameOver');
      // assert.deepEqual(game.market.getHotel("Sackson"), sackson);
    });
    it('disrtibute game over bonus', () => {
      let game = new Game(4, tileBox);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      let player4 = new Player(3, 'specailPlayer');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.addPlayer(player4);
      game.start();
      game.placeTile(0, '5A');
      game.startHotel('Zeta', 0);
      game.purchaseShares('Zeta', 2, 0)
      game.changeCurrentPlayer();
      game.placeTile(0, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.changeCurrentPlayer();
      game.placeTile(2, '8B');
      game.changeCurrentPlayer();

      game.changeCurrentPlayer();
      game.placeTile(0, '8A');
      game.startHotel('Sackson', 1);
      game.purchaseShares('Zeta', 1, 1)
      game.purchaseShares('Sackson', 2, 1)
      game.changeCurrentPlayer();
      game.placeTile(1, '4B');
      game.changeCurrentPlayer();
      game.placeTile(2, '9B');
      game.changeCurrentPlayer();
      game.placeTile(1, '6C');
      game.startHotel('Fusion', 1)
      game.changeCurrentPlayer();
      game.placeTile(1, '2B');
      game.changeCurrentPlayer();
      game.placeTile(2, '10B');
      game.changeCurrentPlayer();
      game.placeTile(0, '9C');
      game.changeCurrentPlayer();
      game.placeTile(0, '9A');
      game.changeCurrentPlayer();
      game.placeTile(3, '3C');
      game.changeCurrentPlayer();
      game.placeTile(3, '8C');
      game.changeCurrentPlayer();
      game.placeTile(0, '6A');
      game.disposeShares(0, {
        hotelName: "Zeta",
        noOfSharesToSell: 3,
        noOfSharesToExchange:0
      });
      game.disposeShares(1, {
        hotelName: "Zeta",
        noOfSharesToSell: 1,
        noOfSharesToExchange:0
      });
      game.disposeShares(1, {
        hotelName: "Fusion",
        noOfSharesToSell: 1,
        noOfSharesToExchange:0
      });
      let zeta = new Hotel('Zeta', 'rgb(236, 222, 34)', 2);
      zeta.occupiedTiles = [];
      zeta.status = false;
      let sackson = new Hotel('Sackson', 'rgb(205, 61, 65)', 2);
      let expectedTilesOfSackson = ['7A', '8B', '8A', '9B', '10B', '9C', '9A', '8C', '5A', '4A', '4B', '6B', '6C', '6A']
      sackson.occupiedTiles = expectedTilesOfSackson;
      sackson.sharePrice = 700;
      sackson.shares = 22;
      sackson.status = true;
      let status = game.getStatus(0);
      assert.deepEqual(game.getTurnState().status, 'gameOver');
      assert.equal(game.findPlayerById(0).getAvailableCash(), 16300);
      assert.equal(game.findPlayerById(1).getAvailableCash(), 22400);
      assert.equal(game.findPlayerById(2).getAvailableCash(), 6000);
      assert.equal(game.findPlayerById(3).getAvailableCash(), 6000);
      let rankList = [{
        "cash": 22400,
        "name": "aditi"
      }, {
        "cash": 16300,
        "name": "pragya"
      },
      {
        "cash": 6000,
        "name": "praveen"
      },
      {
        "cash": 6000,
        "name": "specailPlayer"
      }
      ]

    assert.deepEqual(game.getTurnState().rankList, rankList)
  });
});
describe('giveMajorityMinorityBonus', () => {
  it('it should give majority and minority bonus to single player when only \
  one player has shares of given hotel', () => {
    let expected = {};
    let game = new Game(3, tileBox);
    let player1 = new Player(0, 'pragya');
    let player2 = new Player(1, 'aditi');
    let player3 = new Player(2, 'praveen');
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.start();
    game.placeTile(0, '6A');
    game.changeCurrentPlayer();
    game.placeTile(0, '7A');
    game.startHotel('Sackson', 1);
    game.changeCurrentPlayer();
    game.placeTile(2, '4B');
    game.changeCurrentPlayer();
    game.placeTile(0, '4A');
    game.startHotel('Zeta', 0);
    game.purchaseShares('Zeta', 2, 0);
    game.changeCurrentPlayer();
    game.placeTile(0, '8A');
    game.changeCurrentPlayer();
    game.placeTile(1, '1B');
    game.giveMajorityMinorityBonus('Zeta');
    let majorityShareHolderPlayerMoney = game.findPlayerById(0).availableMoney;
    assert.equal(majorityShareHolderPlayerMoney, 14000);
  });
  it('it should give majority to player who has highest shares of \
  and majority to player who has second highest shares of \
  given hotel', () => {
    let expected = {};
    let game = new Game(3, tileBox);
    let player1 = new Player(0, 'pragya');
    let player2 = new Player(1, 'aditi');
    let player3 = new Player(2, 'praveen');
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.start();
    game.placeTile(0, '6A');
    game.changeCurrentPlayer();
    game.placeTile(0, '7A');
    game.startHotel('Sackson', 1);
    game.changeCurrentPlayer();
    game.placeTile(2, '4B');
    game.changeCurrentPlayer();
    game.placeTile(0, '4A');
    game.startHotel('Zeta', 0);
    game.purchaseShares('Zeta', 2, 0);
    game.changeCurrentPlayer();
    game.placeTile(0, '8A');
    game.purchaseShares('Zeta', 1, 1);
    game.changeCurrentPlayer();
    game.placeTile(1, '1B');
    game.giveMajorityMinorityBonus('Zeta');
    let majorityShareHolderMoney = game.findPlayerById(0).availableMoney;
    assert.equal(majorityShareHolderMoney, 11000);
    let minorityShareHolderMoney = game.findPlayerById(1).availableMoney;
    assert.equal(minorityShareHolderMoney, 8500);
  });
  it('it should give combined majority and minority to more than one players \
  who has most shares given hotel', () => {
    let expected = {};
    let game = new Game(3, tileBox);
    let player1 = new Player(0, 'pragya');
    let player2 = new Player(1, 'aditi');
    let player3 = new Player(2, 'praveen');
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.start();
    game.placeTile(0, '6A');
    game.changeCurrentPlayer();
    game.placeTile(0, '7A');
    game.startHotel('Sackson', 1);
    game.changeCurrentPlayer();
    game.placeTile(2, '4B');
    game.changeCurrentPlayer();
    game.placeTile(0, '4A');
    game.startHotel('Zeta', 0);
    game.purchaseShares('Zeta', 2, 0);
    game.changeCurrentPlayer();
    game.placeTile(0, '8A');
    game.purchaseShares('Zeta', 1, 1);
    game.changeCurrentPlayer();
    game.placeTile(1, '1B');
    game.purchaseShares('Zeta', 3, 2);
    game.giveMajorityMinorityBonus('Zeta');
    let firstMajorityPlayer = game.findPlayerById(0).availableMoney;
    assert.equal(firstMajorityPlayer, 9500);
    let otherMajorityPlayer = game.findPlayerById(2).availableMoney;
    assert.equal(otherMajorityPlayer, 8700);
    let minorityShareHolderPlayerMoney = game.findPlayerById(1).availableMoney;
    assert.equal(minorityShareHolderPlayerMoney, 5500);
  });
  it('it should give majority to player who has highest shares of \
  and combined minority to more than one players who has second most\
  shares of given hotel', () => {
    let expected = {};
    let game = new Game(3, tileBox);
    let player1 = new Player(0, 'pragya');
    let player2 = new Player(1, 'aditi');
    let player3 = new Player(2, 'praveen');
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.start();
    game.placeTile(0, '6A');
    game.changeCurrentPlayer();
    game.placeTile(0, '7A');
    game.startHotel('Sackson', 1);
    game.changeCurrentPlayer();
    game.placeTile(2, '4B');
    game.changeCurrentPlayer();
    game.placeTile(0, '4A');
    game.startHotel('Zeta', 0);
    game.purchaseShares('Zeta', 2, 0);
    game.changeCurrentPlayer();
    game.placeTile(0, '8A');
    game.purchaseShares('Zeta', 1, 1);
    game.changeCurrentPlayer();
    game.placeTile(1, '1B');
    game.purchaseShares('Zeta', 1, 2);
    game.giveMajorityMinorityBonus('Zeta');
    let majorityPlayer = game.findPlayerById(0).availableMoney;
    assert.equal(majorityPlayer, 11000);
    let firstMinorityPlayer = game.findPlayerById(1).availableMoney;
    assert.equal(firstMinorityPlayer, 7000);
    let otherMinorityPlayer = game.findPlayerById(2).availableMoney;
    assert.equal(otherMinorityPlayer, 6900);
  })
});
describe('getActivityLog', () => {
  it('should give activity log', () => {
    let game = new Game(3, tileBox);
    let player1 = new Player(0, 'pragya');
    let player2 = new Player(1, 'aditi');
    let player3 = new Player(2, 'praveen');
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.start();
    let expected = "Game has started.";
    let actual = game.getActivityLog().join('');
    assert.include(actual, expected);
    expected = "pragya has joined the game.";
    assert.include(actual, expected);
    expected = "aditi has joined the game.";
    assert.include(actual, expected);
    expected = "praveen has joined the game.";
    assert.include(actual, expected);
  });
});
describe('disposeShares', () => {
  it('should decrease the no of shares to sell in players share details & update hotel details in bank.', () => {
    let game = new Game(4, tileBox);
    let player1 = new Player(0, 'pragya');
    let player2 = new Player(1, 'aditi');
    let player3 = new Player(2, 'praveen');
    let player4 = new Player(3, 'specailPlayer');
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.addPlayer(player4);
    game.start();
    game.placeTile(0, '5A');
    game.startHotel('Zeta', 0);
    game.purchaseShares('Zeta', 2, 0);
    game.changeCurrentPlayer();
    game.placeTile(0, '7A');
    game.changeCurrentPlayer();
    game.placeTile(2, '6B');
    game.changeCurrentPlayer();
    game.placeTile(2, '8B');
    game.changeCurrentPlayer();
    // game.placeTile(0, '4A');
    // game.changeCurrentPlayer();
    game.placeTile(0, '8A');
    game.startHotel('Sackson', 1);
    game.purchaseShares('Zeta', 1, 1)
    game.purchaseShares('Sackson', 1, 1)
    game.changeCurrentPlayer();
    game.placeTile(1, '4B');
    game.changeCurrentPlayer();
    game.placeTile(2, '9B');


    game.placeTile(1, '6C');
    game.startHotel('Fusion', 2)
    game.changeCurrentPlayer();
    game.placeTile(2, '10B');
    game.changeCurrentPlayer();
    let response = game.placeTile(0, '6A');
    let zeta = new Hotel('Zeta', 'rgb(236, 222, 34)', 2);
    zeta.occupiedTiles = ['5A','4A','3A','2A','1A','4B'];
    zeta.status = true;
    let sackson = new Hotel('Sackson', 'rgb(205, 61, 65)', 2);
    let expectedTilesOfSackson = ['8A','7A', '8B', '9B', '10B']
    sackson.occupiedTiles = expectedTilesOfSackson;
    sackson.status = true;
    let fusion = new Hotel('Fusion', 'green', 3);
    fusion.occupiedTiles = ['6C','6B'];
    fusion.status = true;

    assert.deepEqual(response.status, 'merge');
    assert.deepEqual(response.mergingHotels, [sackson, fusion]);
    assert.deepEqual(response.survivorHotels, [zeta]);
    // assert.deepEqual(response.survivorHotel, zeta);

    let majorityShareHolderPlayerMoney = game.findPlayerById(0).availableMoney;
    assert.equal(majorityShareHolderPlayerMoney, 5000);
  });
  it('should decrease the no of shares to exchange in players share details & update details of merging hotels in bank.', () => {
    let game = new Game(4, tileBox);
    let player1 = new Player(0, 'pragya');
    let player2 = new Player(1, 'aditi');
    let player3 = new Player(2, 'praveen');
    let player4 = new Player(3, 'specailPlayer');
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.addPlayer(player4);
    game.start();
    game.placeTile(0, '5A');
    game.startHotel('Sackson',0);
    game.changeCurrentPlayer();

    game.placeTile(1, '11A');
    game.changeCurrentPlayer();
    game.placeTile(2, '10B');
    game.changeCurrentPlayer();
    game.placeTile(3, '12B');
    game.changeCurrentPlayer();
    game.placeTile(0, '6A');
    game.changeCurrentPlayer();
    game.placeTile(1, '12A');
    game.startHotel('Zeta',1);
    game.changeCurrentPlayer();

    game.placeTile(2, '6B');
    game.changeCurrentPlayer();
    game.placeTile(3, '1C');
    game.changeCurrentPlayer();
    game.placeTile(0, '7A');
    game.purchaseShares('Zeta', 3, 0);
    game.changeCurrentPlayer();
    game.placeTile(1, '10C');
    game.startHotel('Fusion',1);
    game.changeCurrentPlayer();

    game.placeTile(2, '8B');
    game.changeCurrentPlayer();
    game.placeTile(3, '4C');
    game.changeCurrentPlayer();
    game.placeTile(0, '8A');
    game.purchaseShares('Zeta', 3, 0);
    game.changeCurrentPlayer();
    game.placeTile(1, '6C');
    game.changeCurrentPlayer();
    game.placeTile(2, '7C');
    game.changeCurrentPlayer();
    game.placeTile(3, '3C');
    game.changeCurrentPlayer();
    game.placeTile(0, '9A');
    game.purchaseShares('Zeta', 3, 0);
    game.changeCurrentPlayer();
    game.placeTile(1, '4B');
    game.changeCurrentPlayer();
    game.placeTile(2, '7B');
    game.changeCurrentPlayer();
    game.placeTile(3, '4D');
    game.changeCurrentPlayer();
    //mergingTile
    let response=game.placeTile(0, '10A');
    player1= game.findPlayerById(0);
    let disposeSharesDetails={};
    disposeSharesDetails['hotelName']='Zeta';
    disposeSharesDetails['noOfSharesToSell']=2;
    disposeSharesDetails['noOfSharesToExchange']=4;
    game.disposeShares(0,disposeSharesDetails);
    let Zeta = game.bank.sharesDetailsOfHotels[1];
    let Sackson  = game.bank.sharesDetailsOfHotels[0];

    assert.deepEqual(player1.availableMoney, 6900);
    assert.deepEqual(player1.shares.Zeta, 3);
    assert.deepEqual(player1.shares.Sackson, 3);
    assert.deepEqual(Zeta.availableShares,21);
    assert.deepEqual(Sackson.availableShares,22);
  });
})
describe('playerSellsShares', () => {
  it('should remove shares from and add money to player', () => {
    let game = new Game(4, tileBox);
    let player1 = new Player(0, 'pragya');
    let player2 = new Player(1, 'aditi');
    let player3 = new Player(2, 'praveen');
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.start();
    game.placeTile(0, '5A');
    game.changeCurrentPlayer();
    game.placeTile(0, '7A');
    game.changeCurrentPlayer();
    game.placeTile(2, '6B');
    game.changeCurrentPlayer();
    game.placeTile(0, '4A');
    game.startHotel('Zeta', 0);
    game.purchaseShares('Zeta', 2, 0)
    game.changeCurrentPlayer();
    game.playerSellsShares(0, 1, 'Zeta');
    let playerSellingShares = game.findPlayerById(0);
    assert.equal(playerSellingShares.shares['Zeta'], 2);
    assert.equal(playerSellingShares.availableMoney, 5500);
    let hotelShares = game.bank.getAvalibleSharesOf('Zeta');
    assert.equal(hotelShares, 23);
  })
})
describe('canSharesBeDisposed', () => {
  it('should give true when player has enoungh shares to sell', () => {
    let game = new Game(4, tileBox);
    let player1 = new Player(0, 'pragya');
    let player2 = new Player(1, 'aditi');
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.start();
    game.placeTile(0, '7A');
    game.changeCurrentPlayer();
    game.placeTile(1, '10A');
    game.changeCurrentPlayer();
    game.placeTile(0, '6A');
    game.startHotel('Zeta',0);
    game.purchaseShares('Zeta', 3, 0)
    game.changeCurrentPlayer();
    game.placeTile(1, '9A');
    game.startHotel('Sackson', 1);
    game.purchaseShares('Sackson', 2, 0)
    game.changeCurrentPlayer();
    game.placeTile(0, '5A');
    game.changeCurrentPlayer();
    game.placeTile(1, '2B');
    game.changeCurrentPlayer();
    game.placeTile(0, '8A');
    game.createMergingTurn('Zeta');
    assert.isTrue(game.canSharesBeDisposed(0, {
      hotelName: 'Sackson',
      noOfSharesToSell: 1,
      noOfSharesToExchange:0
    }));
  })
  it('should give false when player does not have enoungh shares to sell', () => {
    let game = new Game(4, tileBox);
    let player1 = new Player(0, 'pragya');
    let player2 = new Player(1, 'aditi');
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.start();
    game.placeTile(0, '7A');
    game.changeCurrentPlayer();
    game.placeTile(1, '10A');
    game.changeCurrentPlayer();
    game.placeTile(0, '6A');
    game.startHotel('Zeta',0);
    game.purchaseShares('Zeta', 3, 0)
    game.changeCurrentPlayer();
    game.placeTile(1, '9A');
    game.startHotel('Sackson', 1);
    game.purchaseShares('Sackson', 2, 0)
    game.changeCurrentPlayer();
    game.placeTile(0, '5A');
    game.changeCurrentPlayer();
    game.placeTile(1, '2B');
    game.changeCurrentPlayer();
    game.placeTile(0, '8A');
    game.createMergingTurn('Zeta');
    assert.isFalse(game.canSharesBeDisposed(0, {hotelName: 'Sackson',noOfSharesToSell: 8}));
    })
  });
});
