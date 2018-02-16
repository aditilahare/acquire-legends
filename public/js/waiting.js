let areAllPlayersJoined = function() {
  let waitReq = new XMLHttpRequest();

  function reqListener() {
    if (eval(this.responseText)) {
      window.location = '/game.html';
    }
  }
  waitReq.addEventListener("load", reqListener);
  waitReq.open("GET", "/areAllPlayersJoined");
  waitReq.send();
};

const actionPerformed = function() {
  setInterval(areAllPlayersJoined,2000);
};

window.onload = actionPerformed;
