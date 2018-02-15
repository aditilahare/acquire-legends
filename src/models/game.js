class Game {
  constructor(maxPlayers) {
    this.maxPlayers=maxPlayers;
    this.minPlayers=3;
    this.players=[];
  }
  isVacancy(){
    return this.getPlayerCount()<this.maxPlayers;
  }
  addPlayer(player){
    if(this.isVacancy()){
      this.players.push(player);
      return true;
    }
    return false;
  }
  getPlayerCount(){
    return this.players.length;
  }
}

module.exports=Game;
