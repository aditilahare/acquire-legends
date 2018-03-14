let actions = {
  'independentTile':function(response,action){
    let state={};
    state.status=action||"purchaseShares";
    return state;
  },
  'addedToHotel':function(response,action){
    let state={};
    state.status=action || "purchaseShares";
    return state;
  },
  'merge':function (response, action = undefined) {
    let state=JSON.parse(JSON.stringify(response));
    let mergingHotels=response.mergingHotels;
    let survivorHotels=response.survivorHotels;
    state.mergingHotels=mergingHotels;
    state.survivorHotels=survivorHotels;
    if (survivorHotels.length==1) {
      let mergeStatus=this.performMergeAction(survivorHotels,mergingHotels);
      state.status=mergeStatus.status;
      state.currentMergingHotel=mergeStatus.currentMergingHotel;
      state.survivorHotel=mergeStatus.survivorHotel;
    } else{
      state.status="chooseHotelForMerge";
    }
    this.play();
    return state;
  },
  'chooseHotel':function(response,action){
    let state={};
    state.status=action || "purchaseShares";
    if(response.inactiveHotels.length>0){
      state.status="chooseHotel";
      state.tiles=response.tiles;
    }
    return state;
  },
  'startHotel':function(response,action){
    let state={};
    state.status=action || "purchaseShares";
    return state;
  },
  'invalidTile':function (response,action = undefined) {
    let state={};
    debugger;
    this.addTileToCurrentPlayer();
    let currentPlayer=this.getCurrentPlayer();
    this.logActivity(`${currentPlayer.name} placed an Invalid tile`);
    state.status='placeTile';
    let message = `You have placed an invalid tile\n
    Please place a valid tile`;
    state.message = message;
    return state;
  }
};


module.exports = actions;
