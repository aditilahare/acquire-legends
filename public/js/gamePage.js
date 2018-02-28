/*eslint no-implicit-globals: "off"*/
let cart =[];
let getGameStatusFn,getPlayerStatusFn;
let tileId;
const chooseHotel = function(){
  let hotelName=getElement('#inactiveHotelsDiv select[name="hotelName"]').value;
  let data = `hotelName=${hotelName}`;
  sendAjaxRequest('POST','/actions/chooseHotel',data,placeTileHandler);
  document.getElementById('inactiveHotelsFormDiv').style.display = "none";
  showEndTurn();
};
const createInactiveHotelsForm = function(hotels){
  let html=`<select name="hotelName">`;
  html +=hotels.map((hotel)=>{
    return `<option value="${hotel.name}">${hotel.name}</option>`;
  }).join('');
  html += `</select><br><button name="Start hotel" onclick="chooseHotel()">
  Start hotel</button>`;
  return html;
};
const mergerForTieCase = function(){
  let hotelName=getElement('#choose-hotel select[name="hotelName"]').value;
  let data=`hotelName=${hotelName}`;
  sendAjaxRequest('POST','/actions/chooseHotelForMerge',data,placeTileHandler);
  document.getElementById('choose-hotel').style.display = "none";
  showEndTurn();
};
const chooseForMergerSurvivour = function(hotels){
  let html=`<select name="hotelName">`;
  html +=hotels.map((hotel)=>{
    return `<option value="${hotel.name}">${hotel.name}</option>`;
  }).join('');
  html += `</select><br><button name="SurviourHotel" \
  onclick="mergerForTieCase()">Keep Hotel</button>`;
  return html;
};
const actions={};
actions['changeTurn']=function(){
  hideEndTurn();
  changeTurn();
};
actions['chooseHotel']=function(res){
  let form=createInactiveHotelsForm(res.inactiveHotels);
  getElement('#inactiveHotelsDiv').innerHTML=form;
  document.getElementById('inactiveHotelsFormDiv').style.display = "block";
};
actions["merge"]=function(res){
  if (res.state.expectedActions.includes('chooseHotelForMerge')) {
    let form=chooseForMergerSurvivour(res.state.survivorHotels);
    getElement('#choose-hotel').innerHTML=form;
    document.getElementById('choose-hotel').style.display = "block";
  }
  if (res.state.expectedActions.includes('deployShares')) {
    sendAjaxRequest('GET','/gameStatus','',function(){
      let res=JSON.parse(this.responseText);
      letPlayerDeployShares(res);
    });
  }

};
actions['purchaseShares']=function(res){
  getElement('#listed-hotels').classList.remove('hidden');
  showEndTurn();
};
actions['gameOver'] = function (res) {
  clearInterval(getGameStatusFn);
  clearInterval(getPlayerStatusFn);
  let rankListHtml = rankListHtmlGenerator(res.rankList);
  getElement('#rankListContent').innerHTML = rankListHtml;
  document.getElementById('rankListDisplay').style.display = 'flex';
};
let letPlayerDeployShares=function(res){
  if (res.turnDetails.shouldIDeploy) {
    let deploySharesOption=getElement('#deployShares');
    deploySharesOption.classList.remove('hidden');
    let hotelName=res.state.currentMergingHotel.name;
    getElement("#hotelNameOfwhichSharesToSell").value=hotelName;
  }
};
let requestDeployShares=function(){
  let noOfSharesToSell=getElement("#noOfSharesToSell").value;
  let hotelName=getElement("#hotelNameOfwhichSharesToSell").value;
  let dataToSend=`hotelName=${hotelName}&noOfSharesToSell=${noOfSharesToSell}`;
  sendAjaxRequest('POST','/merge/deployShares',dataToSend,renderGameStatus);
  let deploySharesOption=getElement('#deployShares');
  deploySharesOption.classList.add('hidden');
};
let getElement = function(selector){
  return document.querySelector(selector);
};
let listToHTML = function(list,className,elementName='p') {
  let html=list.map((item)=>{
    return `<${elementName} class=${className} > ${item} </${elementName}>`;
  }).join('');
  return html;
};
const changeTurn = function () {
  sendAjaxRequest('GET','/actions/changeTurn','',getPlayerDetails);
};
const purchaseShares = function(){
  let cartDetails = JSON.stringify(prepareCart());
  sendAjaxRequest('POST','/actions/purchaseShares',`cart=${cartDetails}`);
  cart=[];
  getElement('#cart').innerText='';
  getElement('#listed-hotels').classList.add('hidden');
  hideEndTurn();
};
const prepareCart = function(){
  return cart.reduce((previous,current)=>{
    if(!previous[current]) {
      previous[current]=0;
    }
    previous[current]++;
    return previous;
  },{});
};
const showEndTurn = function () {
  let element=getElement('#change-turn');
  element.classList.remove('hidden');
  element=getElement('#change-turn button').onclick=purchaseShares;
};
const hideEndTurn = function () {
  let element=getElement('#change-turn');
  element.classList.add('hidden');
  element=getElement('#change-turn button').onclick='';
};
const tableGenerator = function(rows,columns){
  let grid='';
  for (let row = 1; row <= rows; row++) {
    let cols = '';
    for (let column = 1; column <= columns; column++) {
      cols +=`<td id='${column}${String.fromCharCode(64+row)}'>`+
     `${column}${String.fromCharCode(64+row)}</td>`;
    }
    grid+=`<tr>${cols}</tr>`;
  }
  return `<table id="grid">${grid}</table>`;
};
const generateTable = function () {
  document.getElementById('board').innerHTML = tableGenerator(9,12);
};
const generateTiles = function (tiles){
  return tiles.reduce(generateTilesAsButton,'');
};
const selectTile=function (event) {
  console.log(event.target.id);
  if (tileId==event.target.id) {
    placeTile(event.target.id);
    return ;
  }

  tileId=event.target.id;
  event.target.focus();
};
const generateTilesAsButton = function(tiles,tile){
  tiles+=`<button class='tile' id=${tile}\
   onclick="selectTile(event)">\
 <span id=${tile}>${tile}</span></button>`;
  return tiles;
};
const getCashInRupee = function (money) {
  return `<center><h2 class='myCash'> &#8377; ${money}<h2></center>`;
};
const displayTiles = function(tiles){
  let html = generateTiles(tiles);
  let oldHtml = document.getElementById('tileBox').innerHTML;
  if (html!=oldHtml) {
    document.getElementById('tileBox').innerHTML = html;
  }
  return;
};
const displayMoney = function(money){
  document.getElementById('wallet').innerHTML = getCashInRupee(money);
  return;
};
const displayPlayerName = function (name) {
  document.getElementById('playerName').innerHTML = `<p>${name}</p>`;
};
const getPlayerDetails = function () {
  sendAjaxRequest('GET','/playerDetails','',displayPlayerDetails);
  return;
};
const processShareDetails = function(sharesDiv,sharesDetails){
  let hotelsNames = Object.keys(sharesDetails);
  let html = ``;
  hotelsNames.forEach(function(hotelName){
    if (sharesDetails[hotelName]!=0) {
      html += `<div class='shareCard ${hotelName} no-img'>`+
    `<center><label>${hotelName}</label></br>`+
    `<label>${sharesDetails[hotelName]}</center><label></div>`;
    }
  });
  return html;
};
const displaySharesDetails = function(sharesDetails){
  let sharesDiv = document.getElementById('playerShares');
  sharesDiv.innerHTML = processShareDetails(sharesDiv,sharesDetails);
  return;
};
const displayPlayerDetails = function () {
  let playerDetails = JSON.parse(this.responseText);
  displayTiles(playerDetails.tiles);
  displayMoney(playerDetails.availableMoney);
  displayPlayerName(playerDetails.name);
  displaySharesDetails(playerDetails.shares);
};
const addToCart = function(hotelName){
  cart.push(hotelName);
  let cartDiv = getElement('#cart');
  let preview = document.createElement('div');
  preview.classList.add(`${hotelName}`,`cartCards`);
  preview.innerHTML=`<span class="removeButton" id="removeButton">&times;\
  </span>`;
  cartDiv.appendChild(preview);
  preview.onclick=()=>{
    removeFromCart(hotelName);
  };
};
const addShare = function(hotelName){
  cart.length<3 && addToCart(hotelName);
};
const removeFromCart = function(hotelName){
  let indexOfHotel = cart.indexOf(hotelName);
  cart.splice(indexOfHotel,1);
  let cartDiv = getElement('#cart');
  let card = getElement(`.${hotelName}.cartCards`);
  cartDiv.removeChild(card);
};
const removeHotelIcon = function (allHotelsDetails) {
  allHotelsDetails.forEach(function (cur) {
    if (cur.status) {
      getElement(`div.${cur.name}.bg-none`).classList.add('no-img');
    }
  });
};
const displayHotelDetails = function (allHotelsDetails) {
  displayHotelNames(allHotelsDetails);
  updateHotelsOnBoard(allHotelsDetails);
  removeHotelIcon(allHotelsDetails);
};
const assignTilesWithRespectiveHotel = function(hotel){
  hotel.occupiedTiles.forEach(tile=>{
    let tileOnMarket = document.getElementById(tile);
    tileOnMarket.className= hotel.name;
  });
  return;
};
const updateHotelsOnBoard= function (allHotelsDetails){
  allHotelsDetails.forEach(assignTilesWithRespectiveHotel);
};
const placeTileHandler = function () {
  let response;
  if(this.status!=403&&this.responseText){
    response=JSON.parse(this.responseText);
    if(actions[response.status]) {
      actions[response.status](response);
    }
  }
};
const placeTile = function(tile){
  sendAjaxRequest('POST','/actions/placeTile',`tile=${tile}`,placeTileHandler);
  return;
};
const displayIndependentTiles = function(independentTiles) {
  independentTiles.forEach(assignTileIndependentClass);
  return;
};
const displayTurnDetails = function(turnDetails) {
  let currentPlayer=turnDetails.currentPlayer;
  let turnDisplay=document.getElementById('turns');
  turnDisplay.innerHTML='';
  turnDetails.otherPlayers.reduce(function(turnDisplay,player){
    let playerDiv = document.createElement('div');
    if(player == currentPlayer ){
      playerDiv.id = 'currentPlayer';
    }else{
      playerDiv.className = 'other-player';
    }
    playerDiv.appendChild(document.createTextNode(`${player}`));
    turnDisplay.appendChild(playerDiv);
    return turnDisplay;
  },turnDisplay);
  let isMyTurn=turnDetails.isMyTurn;
  if(eval(isMyTurn)){
    if(!IGNORE_MY_TURN){
      IGNORE_MY_TURN=true;
    }
  }else{
    document.tile=`${turnDetails.currentPlayer} it's your turn`;
    IGNORE_MY_TURN=false;
    hideEndTurn();
  }
};
const assignTileIndependentClass = function(tile){
  let tileOnMarket = document.getElementById(tile);
  tileOnMarket.classList.add('tile');
  tileOnMarket.classList.add('no-img');
  return;
};
const renderGameStatus = function(){
  let gameStatus = JSON.parse(this.responseText);
  displayHotelDetails(gameStatus.hotelsData);
  displayIndependentTiles(gameStatus.independentTiles);
  displayTurnDetails(gameStatus.turnDetails);
  updateActivityLog(gameStatus.gameActivityLog);
  if (gameStatus.state.status=="merge") {
    actions["merge"](gameStatus);
  }
  if (gameStatus.state.status&&gameStatus.turnDetails.isMyTurn) {
    actions[gameStatus.state.status](gameStatus);
  }
};
let getGameStatus = function(){
  sendAjaxRequest('GET','/gameStatus','',renderGameStatus);
};
let getTurnState = function(){
  sendAjaxRequest('GET','/actions/turnState','',placeTileHandler);
};
const prependLog = function (newLogs) {
  newLogs.forEach(log=>{
    let node = document.createElement('p');
    node.innerText = log;
    node.className = 'log-items';
    document.getElementById('activity-log').prepend(node);
  });
};
const updateActivityLog = function(gameActivityLog){
  let oldLogs=document.querySelectorAll('.log-items');
  let newLogs = gameActivityLog.slice(0,gameActivityLog.length-oldLogs.length);
  let newLogHtml='';
  if (oldLogs.length==0) {
    newLogHtml = listToHTML(gameActivityLog,'log-items');
    getElement('#activity-log').innerHTML = newLogHtml;
  }else {
    prependLog(newLogs);
  }
};
const updateGameStatus=function(gameStatus){
  let currentPlayer = gameStatus.currentPlayer;
  let notification = `Waiting ${currentPlayer} to complete his move.`;
  getElement('#gameStatus').innerText=notification;
};
const actionsPerformed = function () {
  generateTable();
  getGameStatus();
  getPlayerDetails();
  getGameStatusFn = setInterval(getGameStatus,1000);
  getPlayerStatusFn = setInterval(getPlayerDetails,1000);
  getTurnState();
  IGNORE_MY_TURN=false;
};
window.onload = actionsPerformed;
