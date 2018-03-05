class UpdateStatus {
  constructor(){
    this.playersRequestedChange = [];
    this.updationId=0;
  }
  getUpdationId(playerId){
    if(this.hasPlayerServedBefore(playerId)){
      return 0;
    }
    this.rememberPlayerIsServed(playerId);
    return this.updationId;
  }
  setUpdationId(id){
    this.updationId = id;
    this.playersRequestedChange=[];
  }
  rememberPlayerIsServed(playerId){
    this.playersRequestedChange.push(playerId);
  }
  hasPlayerServedBefore(playerId){
    return this.playersRequestedChange.includes(playerId);
  }
}
module.exports = UpdateStatus;
