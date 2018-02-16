class Player {
  constructor(playerId, playerName) {
    this.name = playerName;
    this.id = playerId;
    this.availableMoney = 0;
  }
  getAvalibleCash() {
    return this.availableMoney;
  }
  addMoney(money) {
    this.availableMoney += money;
  }
}

module.exports = Player;
