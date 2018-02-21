class Turn {
  constructor(playerIDSequence) {
    this.playerIDSequence=playerIDSequence;
    this.currentPlayerIndex=0;
  }
  getCurrentPlayerID(){
    return this.playerIDSequence[this.currentPlayerIndex];
  }
  updateTurn(){
    this.currentPlayerIndex++;
    let noOfPlayers = this.playerIDSequence.length;
    this.currentPlayerIndex = this.currentPlayerIndex % noOfPlayers;
  }
  setState(state){
    this.state=state;
  }
  getState(){
    return this.state;
  }
}

module.exports=Turn;
