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
      playersJoined : game.getPlayerCount()
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
    let playersJoined = game.playersJoined;
    return {gameId,createdBy,date,playersJoined};
  }
  getAllGamesInfo(){
    let gameIds = Object.keys(this.games);
    return gameIds.map((gameId)=>{
      return this.getGameInfoById(gameId);
    });
  }
  quitGame(gameId){
    this.getGameById(gameId).hasEnded() && delete this.games[gameId];
  }
}

module.exports = GameManager;
