class Bank {
  constructor(initialMoney) {
    this.availableCash = initialMoney;
  }
  getAvalibleCash(){
    return this.availableCash;
  }
  reduceMoney(money){
    this.availableCash -= money;
  }
}
module.exports = Bank;
