class GameManager {
  constructor(date=Date) {
    this.games = {
    };
    this.currentGameId = 1;
    this.Date = date;
  }
  getAvailableIdForGame(){
    return this.currentGameId;
  }
  addGame(game,username){
    this.games[this.getAvailableIdForGame()] = {
      gameId : this.getAvailableIdForGame(),
      createdBy : username,
      date : new this.Date().toLocaleString(),
      game,
      playersJoined : game.getPlayerCount(),
      maxPlayers : game.getPlayerLimit()
    };
    this.currentGameId++;
  }
  isValidGame(gameId){
    return Object.keys(this.games).includes(`${gameId}`);
  }
  getGameById(gameId){
    let game = this.isValidGame(gameId) && this.games[gameId].game;
    return game;
  }
  getGameInfoById(gameId){
    let game = this.games[gameId];
    let createdBy = game.createdBy;
    let date = game.date;
    let playersJoined = game.game.getPlayerCount();
    let maxPlayers = game.maxPlayers;
    return {gameId,createdBy,date,playersJoined,maxPlayers};
  }
  getAllGamesInfo(){
    let gameIds = Object.keys(this.games);
    return gameIds.map((gameId)=>{
      return this.getGameInfoById(gameId);
    });
  }
  getAvailableGamesInfo(){
    let gameIds = Object.keys(this.games);
    return gameIds.reduce((gamesInfo,gameId)=>{
      if(this.getGameById(gameId).isInWaitMode()){
        gamesInfo.push(this.getGameInfoById(gameId));
      }
      return gamesInfo;
    },[]);
  }
  quitGame(gameId){
    this.getGameById(gameId).hasEnded() && delete this.games[gameId];
  }
}

module.exports = GameManager;
