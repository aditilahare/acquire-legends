class Hotel {
  constructor(name, color,shares=25) {
    this.name = name;
    this.color = color;
    this.shares=shares;
  }
  getDetails() {
    let hotelDetails = {
      name: this.name,
      color: this.color,
      shares:this.shares
    };
    return hotelDetails;
  }
  getName(){
    return this.name;
  }
}

module.exports = Hotel;
