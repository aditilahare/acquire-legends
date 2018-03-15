let playerLastEtag = 'ff';

const verfifyUserName =function(){
  let form = event.target;
};

const selectGame = function (event) {
  let gameIdSelected = event.target.parentNode.id;
  getElement('#join').style.display = 'block';
  getElement('#gameIdSelected').value = `${gameIdSelected}`;
};

const displayAllGames = function () {
  let gamesInfo = JSON.parse(this.responseText);
  let table = getElement('.games-table');
  table.innerHTML = null;
  toHtml([''],'tr',table);
  let columns = ['Game ID','Created By','Max Players','Players Joined','Time'];
  toHtml(columns,'th',table.childNodes[0]);
  gamesInfo.forEach(game=>{
    let tr = createNode('tr','','',game.gameId);
    tr.onclick = selectGame;
    let list =[game.gameId,game.createdBy,game.maxPlayers,game.playersJoined,
      game.date];
    toHtml(list,'td',tr);
    table.appendChild(tr);
  });
  playerLastEtag = this.getResponseHeader('etag');
};

const getAllGamesInfo = function () {
  sendAjaxRequest('GET','/gamesInfo','',displayAllGames, {
    'If-None-Match': playerLastEtag
  });
};

window.onload = function () {
  setInterval(getAllGamesInfo,1000);
};
