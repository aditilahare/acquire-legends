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
    response.expectedActions=['disposeShares'];
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
    response.status = 'purchaseShares';
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
    let tile = this.tileBox.getTiles(1)[0];
    let currentPlayerID = this.turn.getCurrentPlayerID();
    let currentPlayer = this.findPlayerById(currentPlayerID);
    currentPlayer.addTile(tile);
    this.logActivity(`${currentPlayer.name} placed an Invalid tile`);
    response.expectedActions=['placeTile'];
    let message = `You have placed an invalid tile\n
    Please place a valid tile`;
    response.message = message;
    return response;
  }
};


module.exports = actions;
