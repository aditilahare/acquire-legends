class Turn {
  constructor(playerIDSequence,defaultAction) {
    this.playerIDSequence=playerIDSequence;
    this.currentPlayerIndex=0;
    this.defaultAction=defaultAction;
    this.state={
      status:defaultAction
    };
  }
  getCurrentPlayerID(){
    return this.playerIDSequence[this.currentPlayerIndex];
  }
  updateTurn(){
    this.currentPlayerIndex++;
    let noOfPlayers = this.playerIDSequence.length;
    this.currentPlayerIndex = this.currentPlayerIndex % noOfPlayers;
    this.state.status=this.defaultAction;
  }
  setState(state){
    this.state=state;
  }
  getPlayerIdSequence(){
    return this.playerIDSequence;
  }
  getCurrentPlayerIndex(){
    return this.currentPlayerIndex;
  }
  getState(){
    return this.state;
  }
}

module.exports=Turn;
