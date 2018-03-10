class MockDate {
  constructor(dateString='11/11/1111'){
    this.dateString = dateString;
  }
  toLocaleString() {
    return this.dateString;
  }
}
module.exports = MockDate;
