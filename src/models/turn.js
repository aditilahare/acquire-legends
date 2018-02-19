class Turn {
  constructor(playerIDSequence) {
    this.playerIDSequence=playerIDSequence;
    this.currentPlayerIndex=0;
  }
  getCurrentPlayerID(){
    return this.playerIDSequence[this.currentPlayerIndex];
  }
}

module.exports=Turn;
