const redirectToGamePage=function () {
  if (eval(this.responseText)) {
    window.location='/game.html';
  }
  return;
};

const haveAllPlayersJoined = function() {
  sendAjaxRequest('GET','/haveAllPlayersJoined','',redirectToGamePage);
  return ;
};

const namesInHtmlForm = function (names,name) {
  names += `<h4>${name} has joined the game </h4>`;
  return names;
};

const displayJoinedPlayerNames=function () {
  let playerNames = eval(this.responseText);
  playerNames = playerNames.reduce(namesInHtmlForm,'');
  document.getElementById('playerNames').innerHTML = playerNames;
};

const getCookie=function(cname) {
  let name = cname + "=";
  let cookies = document.cookie.split(';');
  for(let index = 0; index < cookies.length; index++) {
    let cookie = cookies[index];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
};

const getGameInfo =function () {
  let gameId = getCookie('gameId');
  let content = `${gameId}`;
  document.getElementById('gameId').innerHTML=content;

  return ;
};

const getAllPlayerNames = function() {
  sendAjaxRequest('GET','/getAllPlayerNames','',displayJoinedPlayerNames);
  return ;
};

const actionPerformed = function() {
  setInterval(haveAllPlayersJoined,1000);
  setInterval(getAllPlayerNames,1000);
  getGameInfo();
};

window.onload = actionPerformed;
