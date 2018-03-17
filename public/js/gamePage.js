/*eslint no-implicit-globals: "off"*/
let cart = [];
let me;
let gameLastEtag = 'ff';
let playerLastEtag = 'ff';

const chooseHotel = function() {
  document.getElementById('inactiveHotelsForm').style.display = "none";
  document.getElementById('promptStartHotel').style.display = "none";
  let hotelName = getElement('#inactiveHotelsForm \
  select[name="hotelName"]').value;
  let data = `hotelName=${hotelName}`;
  sendAjaxRequest('POST', '/actions/chooseHotel', data);
};

const promptStartHotel = function(){
  let promptStartHotel = getElement("#promptStartHotel");
  promptStartHotel.style.display = 'block';
  let selectedHotel = getElement('#inactiveHotelsForm \
  select[name="hotelName"]').value;
  getElement('#selectedHotelToStart').innerText = selectedHotel;
};

const dropDownList = function(hotels) {
  let select = createNode('select');
  select.setAttribute('name', 'hotelName');
  hotels.forEach((hotel) => {
    toHtml([hotel.name], 'option', select);
  });
  return select;
};
const mergerForTieCase = function() {
  let hotelName = getElement('#choose-surv-hotel \
  select[name="hotelName"]').value;
  let data = `hotelName=${hotelName}`;
  sendAjaxRequest('POST', '/actions/chooseHotelForMerge',data);
  document.getElementById('choose-surv-hotel').style.display = "none";
};
const chooseForMergerSurvivour = function(hotels) {
  let html = `<select name="hotelName">`;
  html += hotels.map((hotel) => {
    return `<option value="${hotel.name}">${hotel.name}</option>`;
  }).join('');
  html += `</select><br><button name="SurviourHotel" \
  onclick="mergerForTieCase()">Keep Hotel</button>`;
  return html;
};

const isWholeNumber = function(value){
  return (+value)>=0 && Number.isSafeInteger(+value);
};

const purchaseShares = function() {
  let cartDetails = JSON.stringify(prepareCart());
  sendAjaxRequest('POST', '/actions/purchaseShares',
    `cart=${cartDetails}`,renderGameStatus);
  cart = [];
  getElement('#cart').innerHTML = null;
  getElement('#listed-hotels').classList.add('hidden');
  hideEndTurn();
};

const displayForm = function(res, text, id, action) {
  let form = getElement(id);
  form.innerHTML = null;
  let select = dropDownList(res.hotels);
  let button = createNode('button', text);
  button.addEventListener('click', action);
  form.appendChild(select);
  form.appendChild(button);
  form.parentNode.style.display = "block";
};

const letPlayerChooseHotel = function(){
  getElement('#promptStartHotel').style.display = 'none';
};

const letPlayerDisposeShares = function(res) {
  let disposeSharesOption = getElement('#disposeShares');
  getElement('#promptDisposeShares').style.display = 'none';
  disposeSharesOption.style.display = 'block';
  let state = res.turnDetails.state;
  let hotelName = state.currentMergingHotel.name;
  displayFlashMessage(`Please dispose your shares of ${hotelName}`);
  getElement("#hotelNameOfwhichSharesToDispose").innerText = hotelName;
  let className = `.shareCard.${hotelName} label`;
  let noOfSharesToSell = +document.querySelectorAll(className)[1].innerText;
  getElement("#noOfSharesToSell").value = noOfSharesToSell ;
};
const promptDisposeShares = function(){
  let promptDisposeShares = getElement("#promptDisposeShares");
  promptDisposeShares.style.display = 'block';
};

const showFlashMeassage = function(message){
  let messageBar = document.getElementById("messageBar");
  messageBar.innerText = message;
  messageBar.className = "show";
  setTimeout(()=>{
    messageBar.className = messageBar.className.replace("show", "");
  },3000);
};
const requestdisposeShares = function() {
  getElement('#promptDisposeShares').style.display = 'none';
  let hotelName = getElement("#hotelNameOfwhichSharesToDispose").innerText;
  let noOfSharesToSell = getElement("#noOfSharesToSell").value || 0;
  let noOfSharesToExchange = getElement("#noOfSharesToExchange").value || 0;
  let dataToSend=`hotelName=${hotelName}&noOfSharesToSell=${noOfSharesToSell}`;
  dataToSend += `&noOfSharesToExchange=${noOfSharesToExchange}`;
  let bool = noOfSharesToExchange % 2 == 0;
  bool = bool && isWholeNumber(noOfSharesToSell);
  bool = bool && isWholeNumber(noOfSharesToExchange);
  if (bool) {
    sendAjaxRequest('POST', '/actions/merge/disposeShares',
      dataToSend, renderGameStatus);
    let disposeSharesOption = getElement('#disposeShares');
    getGameStatus();
    disposeSharesOption.style.display="none";
  } else{
    showFlashMeassage("Please enter valid details to dispose shares.");
  }
};

const changeTurn = function() {
  sendAjaxRequest('GET', '/actions/changeTurn', '', getPlayerDetails);
};
const prepareCart = function() {
  return cart.reduce((previous, current) => {
    if (!previous[current]) {
      previous[current] = 0;
    }
    previous[current]++;
    return previous;
  }, {});
};
const showEndTurn = function () {
  let element=getElement('#change-turn');
  element.style.display='block';
  getElement('#buyButton').onclick=purchaseShares;
};
const hideEndTurn = function () {
  let element=getElement('#change-turn');
  element.style.display='none';
  element=getElement('#change-turn').onclick='';
};
const tableGenerator = function(rows, columns) {
  let grid = '';
  for (let row = 1; row <= rows; row++) {
    let cols = '';
    for (let column = 1; column <= columns; column++) {
      cols += `<td id='${column}${String.fromCharCode(64+row)}'>` +
        `${column}${String.fromCharCode(64+row)}</td>`;
    }
    grid += `<tr>${cols}</tr>`;
  }
  return `<table id="grid">${grid}</table>`;
};
const generateTable = function() {
  document.getElementById('board').innerHTML = tableGenerator(9, 12);
};
const generateTiles = function(tiles) {
  return tiles.reduce(generateTilesAsButton, '');
};

const enableTilesClick = function() {
  let tiles = document.querySelectorAll('#tileBox .tile');
  tiles.forEach(function(tile) {
    tile.setAttribute('onclick', 'selectTile(event)');
  });
};

const selectTile = function(event) {
  enableTilesClick();
  event.target.setAttribute('onclick', `placeTile('${event.target.id}')`);
  event.target.focus();
};
const generateTilesAsButton = function(tiles, tile) {
  tiles += `<button class='tile' id=${tile}>\
  ${tile}</button>`;
  return tiles;
};
const getCashInRupee = function(money) {
  return `<center><h2 class='myCash'> &#8377; ${money}<h2></center>`;
};
const displayTiles = function(tiles) {
  let html = generateTiles(tiles);
  document.getElementById('tileBox').innerHTML = html;
  return;
};
const processShareDetails = function(sharesDiv, sharesDetails) {
  let hotelsNames = Object.keys(sharesDetails);
  sharesDiv.innerHTML = null;
  hotelsNames.forEach(function(hotelName) {
    if (sharesDetails[hotelName] != 0) {
      let shareCard = createNode('div', '', `shareCard ${hotelName} no-img`);
      let centerTag = toHtml([''], 'center', shareCard);
      let parent = centerTag.childNodes[1];
      toHtml([hotelName, sharesDetails[hotelName]], 'label', parent);
      sharesDiv.appendChild(shareCard);
    }
  });
};

const displaySharesDetails = function(sharesDetails) {
  let sharesDiv = document.getElementById('playerShares');
  processShareDetails(sharesDiv, sharesDetails);
  return;
};
const displayPlayerDetails = function() {
  playerLastEtag = this.getResponseHeader('etag');
  let playerDetails = JSON.parse(this.responseText);
  displayTiles(playerDetails.tiles);
  displayMoney(playerDetails.availableMoney);
  displayPlayerName(playerDetails.name);
  displaySharesDetails(playerDetails.shares);
};
const addToCart = function(hotelName) {
  cart.push(hotelName);
  let cartDiv = getElement('#cart');
  let preview = document.createElement('div');
  preview.classList.add(`${hotelName}`, `cartCards`);
  preview.innerHTML = `<span class="removeButton" id="removeButton">&times;\
  </span>`;
  cartDiv.appendChild(preview);
  preview.onclick = () => {
    removeFromCart(hotelName);
  };
};
const addShare = function(event) {
  let hotelName = event.target.innerText;
  cart.length < 3 && addToCart(hotelName);
};
const removeFromCart = function(hotelName) {
  let indexOfHotel = cart.indexOf(hotelName);
  cart.splice(indexOfHotel, 1);
  let cartDiv = getElement('#cart');
  let card = getElement(`.${hotelName}.cartCards`);
  cartDiv.removeChild(card);
};
const removeHotelIcon = function(allHotelsDetails) {
  allHotelsDetails.forEach(function(cur) {
    if (cur.status) {
      getElement(`div.${cur.name}.bg-none`).classList.add('no-img');
    }
  });
};
const displayHotelDetails = function(allHotelsDetails) {
  displayHotelNames(allHotelsDetails);
  updateHotelsOnBoard(allHotelsDetails);
  removeHotelIcon(allHotelsDetails);
};
const assignTilesWithRespectiveHotel = function(hotel) {
  hotel.occupiedTiles.forEach(tile => {
    let tileOnMarket = document.getElementById(tile);
    tileOnMarket.setAttribute('class', `${hotel.name} no-img`);
  });
  return;
};
const updateHotelsOnBoard = function(allHotelsDetails) {
  allHotelsDetails.forEach(assignTilesWithRespectiveHotel);
};

const placeTile = function(tile) {
  sendAjaxRequest('POST', '/actions/placeTile', `tile=${tile}`);
  return;
};
const displayIndependentTiles = function(independentTiles) {
  independentTiles.forEach(assignTileIndependentClass);
  return;
};
const displayTurnDetails = function(turnDetails) {
  let currentPlayer = turnDetails.currentPlayer;
  let turnDisplay = document.getElementById('turns');
  turnDisplay.innerHTML = null;
  turnDetails.otherPlayers.reduce(function(turnDisplay, player) {
    let playerDiv = document.createElement('div');
    if (player == currentPlayer) {
      playerDiv.id = 'currentPlayer';
    } else {
      playerDiv.className = 'other-player';
    }
    playerDiv.appendChild(document.createTextNode(`${player}`));
    turnDisplay.appendChild(playerDiv);
    return turnDisplay;
  }, turnDisplay);
};
const assignTileIndependentClass = function(tile) {
  let tileOnMarket = document.getElementById(tile);
  tileOnMarket.setAttribute('class', 'tile no-img');
  return;
};


const prependLog = function(newLogs) {
  newLogs.forEach(log => {
    let node = createNode('p', log, 'log-items');
    document.getElementById('activity-log').prepend(node);
  });
};
const updateActivityLog = function(gameActivityLog) {
  let oldLogs = document.querySelectorAll('.log-items');
  let newLogs = gameActivityLog.slice(0,
    gameActivityLog.length - oldLogs.length);
  let newLogHtml = '';
  if (oldLogs.length == 0) {
    let activityLog = getElement('#activity-log');
    newLogHtml = toHtml(gameActivityLog, 'p', activityLog, 'log-items');
  } else {
    prependLog(newLogs);
  }
};

const displayPlayerName = function(name) {
  me = name;
  document.getElementById('playerName').innerHTML = `<p>${name}</p>`;
};

const updateGameStatus = function(gameStatus) {
  let currentPlayer = gameStatus.currentPlayer;
  let notification = `Waiting ${currentPlayer} to complete his move.`;
  getElement('#gameStatus').innerText = notification;
};

const renderGameStatus = function() {
  gameLastEtag = this.getResponseHeader('etag');
  let gameStatus = JSON.parse(this.responseText);
  let currentAction = gameStatus.turnDetails.currentAction;
  displayFlashMessage(gameStatus.turnDetails.message);
  displayIndependentTiles(gameStatus.independentTiles);
  displayTurnDetails(gameStatus.turnDetails);
  updateActivityLog(gameStatus.gameActivityLog);
  displayHotelDetails(gameStatus.hotelsData);
  let action = actions[currentAction];
  action(gameStatus);
};

const getPlayerDetails = function() {
  sendAjaxRequest('GET', '/playerDetails', '', displayPlayerDetails, {
    'If-None-Match': playerLastEtag
  });
  return;
};

const getGameStatus = function() {
  sendAjaxRequest('GET', '/gameStatus', '', renderGameStatus, {
    'If-None-Match': gameLastEtag
  });
};

const actionsPerformed = function() {
  generateTable();
  getPlayerDetails();
  getGameStatus();
  setInterval(getPlayerDetails, 1000);
  setInterval(getGameStatus, 1000);
};
window.onload = actionsPerformed;
