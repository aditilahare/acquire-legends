let areAllPlayersJoined=function () {
  let waitReq=new XMLHttpRequest();
  function reqListener() {
    if(eval(this.responseText)){
      window.location='/game';
    }
  }
  waitReq.addEventListener("load",reqListener);
  waitReq.open("GET","/areAllPlayersJoined");
  waitReq.send();
};

window.onload=areThereEnoughPlayers;
