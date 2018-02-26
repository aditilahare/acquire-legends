//eslint max-len: ["error", { "ignoreStrings": true }]
const assert = require('chai').assert;
const Game = require('../../src/models/game.js');
const Player = require('../../src/models/player.js');
const Hotel = require('../../src/models/hotel.js');
const Market = require('../../src/models/market.js');
const Turn = require('../../src/models/turn.js');
const Bank = require('../../src/models/bank.js');

describe('game test', function() {
  describe('getPlayerCount', () => {
    it('should return the number of players', () => {
      let game = new Game(3);
      let actual = game.getPlayerCount();
      assert.equal(actual, 0);
    });
  });
  describe('addPlayer', () => {
    it('should add given player to game when maximum players are not there', () => {
      let game = new Game(3);
      let player = new Player(0, 'pragya');
      let actual = game.addPlayer(player);
      assert.isOk(actual);
    });
    it('should not  add given player to game when maximum \
    players reached', () => {
      let game = new Game(0);
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
      let game = new Game(0);
      assert.isNotOk(game.isVacant());
    });
    it('should return true if maximum players are not reached', () => {
      let game = new Game(1);
      assert.isOk(game.isVacant());
    });
  });
  describe('haveAllPlayersJoined', () => {
    it('should return true if all players have joined', () => {
      let game = new Game(0);
      assert.isOk(game.haveAllPlayersJoined());
    });
    it('should return false if all players have not joined', () => {
      let game = new Game(1);
      assert.isNotOk(game.haveAllPlayersJoined());
    });
  });
  describe('getPlayerNameById', () => {
    it('should return player name of given id', () => {
      let game = new Game(3);
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
      let game = new Game(2);
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
      let game = new Game(3);
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
      let game = new Game(3);
      let player1 = new Player(0, 'pragya');
      game.addPlayer(player1);
      assert.equal(game.getAvailableCashOfPlayer(0), 0);
      game.distributeMoneyToPlayer(0, 4000);
      assert.equal(game.getAvailableCashOfPlayer(0), 4000);
    });
  });
  describe('distributeInitialMoney', () => {
    it('should disribute money to all players', () => {
      let game = new Game(3);
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
      let game = new Game(2);
      let player1 = new Player(0, 'veera');
      let player2 = new Player(1, 'pragya');
      let hydraHotel = {
        name: 'Hydra',
        color: 'orange',
        occupiedTiles:[],
        level: 3
      };

      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.equal(game.getAvailableCashOfPlayer(0), 0);
      assert.equal(game.getAvailableCashOfPlayer(1), 0);
      game.start();
      assert.deepEqual(game.getHotel('Hydra'),hydraHotel);
      assert.equal(game.getAvailableCashOfPlayer(0), 6000);
      assert.equal(game.getAvailableCashOfPlayer(1), 6000);
      assert.deepEqual(player1.getTiles(), ['1A', '2A', '3A', '4A', '5A', '6A']);
      assert.deepEqual(player2.getTiles(), ['7A', '8A', '9A', '10A', '11A', '12A']);
    });
  });
  describe('createHotels', () => {
    it('should create hotels for the given names and colors', () => {
      let game = new Game(2);
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
      let game = new Game(2);
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
      let game = new Game(2);
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
      assert.include(game.getPlayerSharesDetails(0), {
        Phoenix: 5
      });
      assert.include(game.getPlayerSharesDetails(1), {
        Hydra: 2
      });
    });
  });
  describe('isInPlayMode', () => {
    it('should return false when game is not in play mode ', () => {
      let game = new Game(2);
      let player1 = new Player(0, 'veera');
      let player2 = new Player(1, 'pragya');
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.isNotOk(game.isInPlayMode());
    });
    it('should return true if game is in play mode ', () => {
      let game = new Game(2);
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
      let game = new Game(2);
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
      let game = new Game(2);
      assert.deepEqual(game.getAllPlayerNames(), []);
    });
    it('can give all player names', () => {
      let game = new Game(2);
      let player1 = new Player(0, 'veera');
      let player2 = new Player(1, 'pragya');
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.deepEqual(game.getAllPlayerNames(), ['veera', 'pragya']);
    });
  });
  describe('addSharesToPlayer', () => {
    it('should add shares to player by given id', () => {
      let game = new Game(2);
      let player1 = new Player(0, 'aditi');
      let player2 = new Player(1, 'harvar');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addSharesToPlayer(0, 'Phoenix', 2);
      game.addSharesToPlayer(1, 'Hydra', 5);
      assert.include(game.getPlayerSharesDetails(0), {
        Phoenix: 2
      });
      assert.include(game.getPlayerSharesDetails(1), {
        Hydra: 5
      });
    });
  });
  describe('placeTile', () => {
    it('can place a independent Tile for the player whose id is given', () => {
      let game = new Game(1);
      let player1 = new Player(1, 'pragya');
      let market = new Market();
      player1.addTile('2A');
      game.addPlayer(player1);
      game.start();
      game.placeTile(1, '2A');
      let actual = game.giveIndependentTiles();
      let expected = ['2A'];
      assert.deepEqual(actual, expected);
    });
  });
  describe('getCurrentPlayer', () => {
    it('should give current player details', () => {
      let game = new Game(1);
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
      let game = new Game(2);
      let player1 = new Player(0, 'pragya');
      game.addPlayer(player1);
      game.addPlayer(new Player(1, 'veera'));
      game.start();
      game.changeCurrentPlayer();
      let actual = game.getCurrentPlayer();
      assert.equal(actual.id, 1)
      assert.equal(player1.tiles.length, 7)
    });
  });
  describe('isCurrentPlayer', () => {
    it('should return true if player is current player', () => {
      let game = new Game(2);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let turn = new Turn([0, 1]);
      game.addPlayer(player1);
      game.start();
      let playerId = turn.getCurrentPlayerID();
      assert.isOk(game.isCurrentPlayer(playerId));
    });
  });
  describe('getAllPlayerDetails', () => {
    it('should return an object containig all player details', () => {
      let expected = [{
        tiles: [],
        availableMoney: 0,
        name: 'veera',
        id: 0,
        shares: {
          "America": 0,
          "Fusion": 0,
          "Hydra": 0,
          "Phoenix": 0,
          "Quantum": 0,
          "Sackson": 0,
          "Zeta": 0
        }
      }, {
        tiles: [],
        availableMoney: 0,
        name: 'pragya',
        id: 1,
        shares: {
          "America": 0,
          "Fusion": 0,
          "Hydra": 0,
          "Phoenix": 0,
          "Quantum": 0,
          "Sackson": 0,
          "Zeta": 0
        }
      }]
      let game = new Game(2);
      let player1 = new Player(0, 'veera');
      let player2 = new Player(1, 'pragya');
      game.addPlayer(player1);
      game.addPlayer(player2);
      assert.deepEqual(game.getAllPlayerDetails(), expected);
    });
  });
  describe('getStatus', () => {
    it('should give current game status', () => {
      let expected = {
        hotelsData: [],
        turnDetails: {
          currentPlayer: 'pragya',
          otherPlayers: ['aditi'],
          isMyTurn: true
        }
      };
      let game = new Game(2);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.start();
      assert.deepEqual(game.getStatus(0).independentTiles, []);
      assert.deepEqual(game.getStatus(0).turnDetails, expected.turnDetails);
    });
  });
  describe('deductMoneyFromPlayer', () => {
    it('should deduct money from player account', () => {
      let game = new Game(2);
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
      let game = new Game(3);
      let player1 = new Player(0,'pragya');
      let player2 = new Player(1,'wulfa');
      let player3 = new Player(2,'harvar');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.start();
      assert.deepEqual(game.placeTile(0,'6A').status,'changeTurn');
      game.changeCurrentPlayer();
      assert.deepEqual(game.placeTile(1,'7A').status,'chooseHotel');
      game.startHotel('Zeta',1);
      game.placeTile(0,'2A');
      game.purchaseShares('Zeta',2,0);
      game.changeCurrentPlayer();
      game.placeTile(1,'9A');
      game.purchaseShares('Zeta',2,1);
      game.changeCurrentPlayer();
      game.placeTile(2,'4B');
      game.purchaseShares('Zeta',2,2);
      game.changeCurrentPlayer();

      //code execution
      game.placeTile(0,'5A')
      game.purchaseShares('Zeta',2,0);

      //assertion
      let expected = 5000;
      let actual = player1.getAvailableCash();
      assert.deepEqual(actual,expected);

      expected = {  Sackson: 0,
        Zeta: 4,
        Hydra: 0,
        Fusion: 0,
        America: 0,
        Phoenix: 0,
        Quantum: 0
      };
      actual = player1.getShareDetails();
      assert.deepEqual(actual,expected);

      expected ={ hotelName:'Zeta',
        availableShares: 16,
        shareHolders: [{"id":1,"noOfShares":3},{"id":0,"noOfShares":4},{"id":2,"noOfShares":2}]
      };
      actual = game.bank.sharesDetailsOfHotels;
      assert.deepInclude(actual[1],expected);
    });
  });
  describe('actions', () => {
    it('should add tile to an existing hotel', () => {
      let expected = {};
      let game = new Game(2);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.start();
      assert.deepEqual(game.placeTile(0, '6A').status, 'changeTurn');
      game.changeCurrentPlayer();
      assert.deepEqual(game.placeTile(1, '7A').status, 'chooseHotel');
      game.startHotel('Zeta',1);
      game.changeCurrentPlayer();
      assert.deepEqual(game.placeTile(0, '5A').status, 'purchaseShares');
    });
    it('merge', () => {
      let game = new Game(3);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.start();
      game.placeTile(0, '6A');
      game.changeCurrentPlayer();
      game.placeTile(1, '7A');
      game.startHotel('Sackson',1);
      game.changeCurrentPlayer();
      game.placeTile(2, '4B');
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.startHotel('Zeta',0);
      game.purchaseShares('Zeta',2,0);
      game.changeCurrentPlayer();
      game.placeTile(1, '8A');
      game.changeCurrentPlayer();
      game.placeTile(2, '1B');
      game.changeCurrentPlayer();
      let response=game.placeTile(0, '5A');

      let zeta=new Hotel('Zeta','rgb(236, 222, 34)',2);
      zeta.occupiedTiles=['4B','4A'];
      zeta.status=true;
      let sackson=new Hotel('Sackson','rgb(205, 61, 65)',2);
      sackson.occupiedTiles=['6A','7A','8A'];
      sackson.level=2;
      sackson.status=true;

      assert.deepEqual(response.status, 'merge');
      assert.deepEqual(response.expectedActions, ['deployShares']);
      assert.deepEqual(response.mergingHotels,[zeta]);
      assert.deepEqual(response.survivorHotels,[sackson]);
      assert.deepEqual(response.survivorHotel,sackson);

      let majorityShareHolderPlayerMoney=game.findPlayerById(0).availableMoney;
      assert.equal(majorityShareHolderPlayerMoney,8600);
    });
    it('merge', () => {
      let game = new Game(4);
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
      game.placeTile(1, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.changeCurrentPlayer();
      game.placeTile(3, '8B');
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.startHotel('Zeta',0);
      game.purchaseShares('Zeta',2,0)
      game.changeCurrentPlayer();
      game.placeTile(1, '8A');
      game.startHotel('Sackson',1);
      game.purchaseShares('Zeta',1,1)
      game.purchaseShares('Sackson',1,1)
      game.changeCurrentPlayer();
      game.placeTile(2, '4B');
      game.changeCurrentPlayer();
      game.placeTile(3, '9B');

      game.placeTile(0, '1A');
      game.changeCurrentPlayer();
      game.placeTile(1, '6C');
      game.startHotel('Fusion',2)
      game.changeCurrentPlayer();
      game.placeTile(3, '10B');
      game.changeCurrentPlayer();
      let response=game.placeTile(0, '6A');

      let zeta=new Hotel('Zeta','rgb(236, 222, 34)',2);
      zeta.occupiedTiles=['5A', '4A', '4B'];
      zeta.status=true;
      let sackson=new Hotel('Sackson','rgb(205, 61, 65)',2);
      let expectedTilesOfSackson=[ '7A', '8B', '8A', '9B', '10B']
      sackson.occupiedTiles=expectedTilesOfSackson;
      sackson.status=true;
      let fusion=new Hotel('Fusion','green',3);
      fusion.occupiedTiles=['6B', '6C'];
      fusion.status=true;

      assert.deepEqual(response.status, 'merge');
      assert.deepEqual(response.expectedActions, ['deployShares']);
      assert.deepEqual(response.mergingHotels,[zeta,fusion]);
      assert.deepEqual(response.survivorHotels,[sackson]);
      assert.deepEqual(response.survivorHotel,sackson);

      let majorityShareHolderPlayerMoney=game.findPlayerById(0).availableMoney;
      assert.equal(majorityShareHolderPlayerMoney,8600);
    });
  });
  describe('giveMajorityMinorityBonus', () => {
    it('it should give majority and minority bonus to single player when only \
          one player has shares of given hotel',()=>{
      let expected = {};
      let game = new Game(3);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.start();
      game.placeTile(0, '6A');
      game.changeCurrentPlayer();
      game.placeTile(1, '7A');
      game.startHotel('Sackson',1);
      game.changeCurrentPlayer();
      game.placeTile(2, '4B');
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.startHotel('Zeta',0);
      game.purchaseShares('Zeta',2,0);
      game.changeCurrentPlayer();
      game.placeTile(1, '8A');
      game.changeCurrentPlayer();
      game.placeTile(2, '1B');
      game.giveMajorityMinorityBonus('Zeta');
      let majorityShareHolderPlayerMoney=game.findPlayerById(0).availableMoney;
      assert.equal(majorityShareHolderPlayerMoney,8600);
    });
    it('it should give majority to player who has highest shares of \
          and majority to player who has second highest shares of \
          given hotel',()=>{
      let expected = {};
      let game = new Game(3);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.start();
      game.placeTile(0, '6A');
      game.changeCurrentPlayer();
      game.placeTile(1, '7A');
      game.startHotel('Sackson',1);
      game.changeCurrentPlayer();
      game.placeTile(2, '4B');
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.startHotel('Zeta',0);
      game.purchaseShares('Zeta',2,0);
      game.changeCurrentPlayer();
      game.placeTile(1, '8A');
      game.purchaseShares('Zeta',1,1);
      game.changeCurrentPlayer();
      game.placeTile(2, '1B');
      game.giveMajorityMinorityBonus('Zeta');
      let majorityShareHolderMoney=game.findPlayerById(0).availableMoney;
      assert.equal(majorityShareHolderMoney,7600);
      let minorityShareHolderMoney=game.findPlayerById(1).availableMoney;
      assert.equal(minorityShareHolderMoney,6800);
    });
    it('it should give combined majority and minority to more than one players \
     who has most shares given hotel',()=>{
      let expected = {};
      let game = new Game(3);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.start();
      game.placeTile(0, '6A');
      game.changeCurrentPlayer();
      game.placeTile(1, '7A');
      game.startHotel('Sackson',1);
      game.changeCurrentPlayer();
      game.placeTile(2, '4B');
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.startHotel('Zeta',0);
      game.purchaseShares('Zeta',2,0);
      game.changeCurrentPlayer();
      game.placeTile(1, '8A');
      game.purchaseShares('Zeta',1,1);
      game.changeCurrentPlayer();
      game.placeTile(2, '1B');
      game.purchaseShares('Zeta',3,2);
      game.giveMajorityMinorityBonus('Zeta');
      let firstMajorityPlayer=game.findPlayerById(0).availableMoney;
      assert.equal(firstMajorityPlayer,7100);
      let otherMajorityPlayer=game.findPlayerById(2).availableMoney;
      assert.equal(otherMajorityPlayer,6900);
      let minorityShareHolderPlayerMoney=game.findPlayerById(1).availableMoney;
      assert.equal(minorityShareHolderPlayerMoney,5800);
    });
    it('it should give majority to player who has highest shares of \
          and combined minority to more than one players who has second most\
           shares of given hotel',()=>{
      let expected = {};
      let game = new Game(3);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.start();
      game.placeTile(0, '6A');
      game.changeCurrentPlayer();
      game.placeTile(1, '7A');
      game.startHotel('Sackson',1);
      game.changeCurrentPlayer();
      game.placeTile(2, '4B');
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.startHotel('Zeta',0);
      game.purchaseShares('Zeta',2,0);
      game.changeCurrentPlayer();
      game.placeTile(1, '8A');
      game.purchaseShares('Zeta',1,1);
      game.changeCurrentPlayer();
      game.placeTile(2, '1B');
      game.purchaseShares('Zeta',1,2);
      game.giveMajorityMinorityBonus('Zeta');
      let majorityPlayer=game.findPlayerById(0).availableMoney;
      assert.equal(majorityPlayer,7600);
      let firstMinorityPlayer=game.findPlayerById(1).availableMoney;
      assert.equal(firstMinorityPlayer,6300);
      let otherMinorityPlayer=game.findPlayerById(2).availableMoney;
      assert.equal(otherMinorityPlayer,6300);
    })
  });
  describe('getActivityLog', () => {
    it('should give activity log', () => {
      let game = new Game(3);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.start();
      let expected=['pragya has joined the game.','aditi has joined the game.','praveen has joined the game.','Game has started.'];
      assert.deepEqual(game.getActivityLog(),expected);
    });
  });
  describe('deployShares',()=>{
    it('deployShares', () => {
      let game = new Game(4);
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
      game.placeTile(1, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.changeCurrentPlayer();
      game.placeTile(3, '8B');
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.startHotel('Zeta',0);
      game.purchaseShares('Zeta',2,0)
      game.changeCurrentPlayer();
      game.placeTile(1, '8A');
      game.startHotel('Sackson',1);
      game.purchaseShares('Zeta',1,1)
      game.purchaseShares('Sackson',1,1)
      game.changeCurrentPlayer();
      game.placeTile(2, '4B');
      game.changeCurrentPlayer();
      game.placeTile(3, '9B');

      game.placeTile(0, '1A');
      game.changeCurrentPlayer();
      game.placeTile(1, '6C');
      game.startHotel('Fusion',2)
      game.changeCurrentPlayer();
      game.placeTile(3, '10B');
      game.changeCurrentPlayer();
      let response=game.placeTile(0, '6A');

      let zeta=new Hotel('Zeta','rgb(236, 222, 34)',2);
      zeta.occupiedTiles=['5A', '4A', '4B'];
      zeta.status=true;
      let sackson=new Hotel('Sackson','rgb(205, 61, 65)',2);
      let expectedTilesOfSackson=[ '7A', '8B', '8A', '9B', '10B']
      sackson.occupiedTiles=expectedTilesOfSackson;
      sackson.status=true;
      let fusion=new Hotel('Fusion','green',3);
      fusion.occupiedTiles=['6B', '6C'];
      fusion.status=true;

      assert.deepEqual(response.status, 'merge');
      assert.deepEqual(response.expectedActions, ['deployShares']);
      assert.deepEqual(response.mergingHotels,[zeta,fusion]);
      assert.deepEqual(response.survivorHotels,[sackson]);
      assert.deepEqual(response.survivorHotel,sackson);

      let majorityShareHolderPlayerMoney=game.findPlayerById(0).availableMoney;
      assert.equal(majorityShareHolderPlayerMoney,8600);
    });
  })
  describe('playerSellsShares',()=>{
    it('should remove shares from and add money to player',()=>{
      let game = new Game(4);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.start();
      game.placeTile(0, '5A');
      game.changeCurrentPlayer();
      game.placeTile(1, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.startHotel('Zeta',0);
      game.purchaseShares('Zeta',2,0)
      game.changeCurrentPlayer();
      game.playerSellsShares(0,1,'Zeta');
      let playerSellingShares=game.findPlayerById(0);
      assert.equal(playerSellingShares.shares['Zeta'],2);
      assert.equal(playerSellingShares.availableMoney,5800);
      let hotelShares=game.bank.getAvalibleSharesOf('Zeta');
      assert.equal(hotelShares,23);
    })
  })
  describe('canSharesBeDeployed',()=>{
    it('should give true when player has enoungh shares to sell',()=>{
      let game = new Game(4);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.start();
      game.placeTile(0, '5A');
      game.changeCurrentPlayer();
      game.placeTile(1, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.startHotel('Zeta',0);
      game.purchaseShares('Zeta',2,0)
      game.changeCurrentPlayer();
      assert.isTrue(game.canSharesBeDeployed(0,{hotelName:'Zeta',noOfSharesToSell:1}));
    })
    it('should give false when player does not have enoungh shares to sell',()=>{
      let game = new Game(4);
      let player1 = new Player(0, 'pragya');
      let player2 = new Player(1, 'aditi');
      let player3 = new Player(2, 'praveen');
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.addPlayer(player3);
      game.start();
      game.placeTile(0, '5A');
      game.changeCurrentPlayer();
      game.placeTile(1, '7A');
      game.changeCurrentPlayer();
      game.placeTile(2, '6B');
      game.changeCurrentPlayer();
      game.placeTile(0, '4A');
      game.startHotel('Zeta',0);
      game.purchaseShares('Zeta',2,0)
      game.changeCurrentPlayer();
      assert.isFalse(game.canSharesBeDeployed(0,{hotelName:'Zeta',noOfSharesToSell:6}));
    })
  })
});
