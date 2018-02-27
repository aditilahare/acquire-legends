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
  getPlayerIdSequence(){
    return this.playerIDSequence;
  }
  getCurrentPlayerIndex(){
    return this.currentPlayerIndex;
  }
  getState(){
    return this.state;
  }
  isTurnOf(playerId){
    return (this.getCurrentPlayerID()==playerId);
  }
  clearTurn(){
    this.playerIdSequence=[];
    this.currentPlayerIndex=null;
    return this.playerIDSequence;
  }
}

module.exports=Turn;
