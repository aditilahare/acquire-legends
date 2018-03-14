const Player=require('./player.js');
const botActions=require('./botActions.js');
class Bot extends Player{
  constructor(playerId,playerName) {
    super(playerId,playerName);
    this.actions=botActions;
  }
  getTile(tile){
    let length=this.tiles.length;
    let random =Math.floor(Math.random()*length);
    return tile||this.tiles[random];
  }
  play(game){
    let state=game.getStatus(this.id);
    let action=state.turnDetails.currentAction;
    console.log(this.name,action);
    this.actions[action] && this.actions[action].call(this,game)&&
    setTimeout(()=>{
      this.play(game);
    },1000);
  }
}

module.exports=Bot;
