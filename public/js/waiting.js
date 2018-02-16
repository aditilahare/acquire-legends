let haveAllPlayersJoined = function() {
  let waitReq = new XMLHttpRequest();

  function reqListener() {
    if (eval(this.responseText)) {
      window.location = '/game.html';
    }
  }
  waitReq.addEventListener("load", reqListener);
  waitReq.open("GET", "/haveAllPlayersJoined");
  waitReq.send();
};

const actionPerformed = function() {
  setInterval(haveAllPlayersJoined,2000);
};

window.onload = actionPerformed;
