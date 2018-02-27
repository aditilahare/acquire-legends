let actions = {
  'Independent':function(response){
    response.expectedActions=['purchaseShares','changeTurn'];
    response.status="purchaseShares";
    if(response.activeHotels.length==0) {
      response.status="changeTurn";
    }
    return response;
  },
  'Added to hotel':function(response){
    response.expectedActions=['purchaseShares','changeTurn'];
    response.status="purchaseShares";
    return response;
  },
  'merge':function (response) {
    response.expectedActions=['deployShares'];
    response.status='merge';
    let mergingHotels=response.mergingHotels;
    let survivorHotels=response.survivorHotels;
    if (survivorHotels.length==1) {
      this.performMergeAction(survivorHotels,mergingHotels,response);
    } else{
      response.expectedActions=["chooseHotelForMerge"];
      response.status="merge";
      return response;
    }
    return response;
  },
  'chooseHotel':function(response){
    response.expectedActions=['purchaseShares','changeTurn'];
    if(response.inactiveHotels.length>0){
      response.expectedActions=['chooseHotel'];
      response.status="chooseHotel";
    }
    return response;
  },
  'starting hotel':function(response){
    response.expectedActions=['purchaseShares','changeTurn'];
    response.status="purchaseShares";
    return response;
  },
  'Invalid Tile':function (response) {
    let tiles = this.tileBox.getTiles(1);
    let currentPlayerID = this.turn.getCurrentPlayerID();
    let currentPlayer = this.findPlayerById(currentPlayerID);
    currentPlayer.addTile(tiles[0]);
    response.expectedActions=['placeTile'];
    return response;
  }
};


module.exports = actions;
