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
  names += `<h5>${name} has joined the game </h5>`;
  return names;
};

const displayJoinedPlayerNames=function () {
  let playerNames = eval(this.responseText);
  playerNames = playerNames.reduce(namesInHtmlForm,'');
  document.getElementById('playerNames').innerHTML = playerNames;
};

const getAllPlayerNames = function() {
  sendAjaxRequest('GET','/getAllPlayerNames','',displayJoinedPlayerNames);
  return ;
};

const actionPerformed = function() {
  setInterval(haveAllPlayersJoined,1000);
  setInterval(getAllPlayerNames,1000);
};

window.onload = actionPerformed;
