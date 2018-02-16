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
  findPlayerBy(id){
    return this.players.find(player=>{
      return player.id==id;
    });
  }
  getPlayerNameOf(id){
    if (this.findPlayerBy(id)) {
      return this.findPlayerBy(id).name;
    }
    return '';
  }
  giveMoneyToPlayer(id,money){
    let player=this.findPlayerBy(id);
    player.addMoney(money);
  }
  getAvalibleCashOf(id){
    let player=this.findPlayerBy(id);
    return player.getAvalibleCash();
  }
  distributeInitialMoney(initialMoney){
    this.players.forEach(player=>{
      this.giveMoneyToPlayer(player.id,initialMoney);
    });
  }
  isValidPlayer(id){
    return this.players.some(function(player){
      return id==player.id;
    });
  }
}
module.exports=Game;
