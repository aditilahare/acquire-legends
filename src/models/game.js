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
  areAllPlayersJoined(){
    return this.maxPlayers==this.getPlayerCount();
  }
  getPlayerNameOf(id){
    if (this.players[id]) {
      return this.players[id].name;
    }
    return '';
  }

  isValidPlayer(id){
    return this.players.some(function(player){
      return id==player.id;
    });
  }
}

module.exports=Game;
