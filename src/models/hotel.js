class Hotel {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }
  getDetails() {
    let hotelDetails = {
      name: this.name,
      color: this.color,
    };
    return hotelDetails;
  }
  getName(){
    return this.name;
  }
}

module.exports = Hotel;
