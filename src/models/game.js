const TileBox = require('./tileBox');
class Game {
  constructor(maxPlayers) {
    this.maxPlayers=maxPlayers;
    this.minPlayers=3;
    this.players=[];
    this.tileBox = new TileBox(12,9);
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
  distributeInitialTiles(){
    let tileBox=this.tileBox;
    this.players.forEach(function(player){
      player.addTiles(tileBox.getNTiles(6));
    });
  }
  startGame(){
    this.distributeInitialTiles();
  }
}

module.exports=Game;
