/*eslint no-implicit-globals: "off"*/
let cart =[];
let me;
let tileId='';
let updateChange = {};

updateChange[0]=function () {
  //do nothing;
};
updateChange[1] = function() {
  getGameStatus();
};

updateChange[2] = function() {
  getPlayerDetails();
};
updateChange[3] = function() {
  getPlayerDetails();
  getGameStatus();
};

const getPlayerDetails = function () {
  sendAjaxRequest('GET','/playerDetails','',displayPlayerDetails);
  return;
};
const chooseHotel = function(){
  let hotelName=getElement('#inactiveHotelsForm \
  select[name="hotelName"]').value;
  let data = `hotelName=${hotelName}`;
  sendAjaxRequest('POST','/actions/chooseHotel',data,placeTileHandler);
  document.getElementById('inactiveHotelsFormDiv').style.display = "none";
  getPlayerDetails();
  getGameStatus();
  showEndTurn();
};
const dropDownList = function(hotels){
  let select = createNode('select');
  select.setAttribute('name','hotelName');
  hotels.forEach((hotel)=>{
    toHtml([hotel.name],'option',select);
  });
  return select;
};
const mergerForTieCase = function(){
  let hotelName=getElement('#choose-surv-hotel select[name="hotelName"]').value;
  let data=`hotelName=${hotelName}`;
  sendAjaxRequest('POST','/actions/chooseHotelForMerge',data,placeTileHandler);
  document.getElementById('choose-surv-hotel').style.display = "none";
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
  sendAjaxRequest('GET','/gameStatus','',function(){
    let res=JSON.parse(this.responseText);
    let isMyTurn=res.turnDetails.isMyTurn;
    if (res.state.expectedActions.includes('chooseHotel')&&isMyTurn) {
      let hotels = res.inactiveHotels;
      let isMyTurn = res.turnDetails.isMyTurn;
      let actionInfo={isMyTurn,hotels};
      displayForm(actionInfo,'Start Hotel','#inactiveHotelsForm',chooseHotel);
    }
  });
};
actions["merge"]=function(res){
  sendAjaxRequest('GET','/gameStatus','',function(){
    let res=JSON.parse(this.responseText);
    if (res.state.expectedActions.includes('chooseHotelForMerge')) {
      let res=JSON.parse(this.responseText);
      let hotels = res.state.survivorHotels;
      let isMyTurn = res.turnDetails.isMyTurn;
      let actionInfo={isMyTurn,hotels};
      displayForm(actionInfo,'Keep Hotel','#tieBreakForm',mergerForTieCase);
      getPlayerDetails();
    }
  });
  sendAjaxRequest('GET','/gameStatus','',function(){
    let res=JSON.parse(this.responseText);
    if (res.state.expectedActions.includes('disposeShares')) {
      letPlayerDisposeShares(res);
    }
    getPlayerDetails();
  });

};
actions['purchaseShares']=function(res){
  sendAjaxRequest('GET','/gameStatus','',function(){
    let res=JSON.parse(this.responseText);
    let activeHotels = res.state.activeHotels;
    if(!activeHotels){
      activeHotels= res.hotelsData.filter(hotel => {
        return hotel.status;
      });
    }
    let areSharesAvailable = activeHotels.reduce((prevBool,hotel)=>{
      return prevBool || hotel.shares>0;
    },false);
    if(res.turnDetails.isMyTurn&&areSharesAvailable){
      getElement('#listed-hotels').classList.remove('hidden');
      showEndTurn();
      getPlayerDetails();
    }else{
      changeTurn();
    }
  });
};
const purchaseShares = function(){
  let cartDetails = JSON.stringify(prepareCart());
  sendAjaxRequest('POST','/actions/purchaseShares',`cart=${cartDetails}`);
  cart=[];
  getElement('#cart').innerHTML=null;
  getElement('#listed-hotels').classList.add('hidden');
  hideEndTurn();
  getPlayerDetails();
};
actions['gameOver'] = function (res) {
  rankListHtmlGenerator(res.state.rankList,me);
  document.getElementById('rankListDisplay').style.display = 'flex';
};
actions['Invalid Tile'] = function (res) {
  let messageBar = document.getElementById("messageBar");
  messageBar.innerText = res.state.message;
  messageBar.className = "show";
  setTimeout(()=>{
    messageBar.className = messageBar.className.replace("show", "");
  },3000);
  getPlayerDetails();
};

const displayForm = function (res,text,id,action) {
  if (res.isMyTurn){
    let form=getElement(id);
    form.innerHTML = null;
    let select=dropDownList(res.hotels);
    let button = createNode('button',text);
    button.addEventListener('click',action);
    form.appendChild(select);
    form.appendChild(button);
    form.parentNode.style.display = "block";
  }
};

let letPlayerDisposeShares=function(res){
  if (res.turnDetails.shouldIDispose) {
    let disposeSharesOption=getElement('#disposeShares');
    disposeSharesOption.style.display='block';
    let hotelName=res.state.currentMergingHotel.name;
    displayFlashMessage(`Please dispose your shares of ${hotelName}`);
    getElement("#hotelNameOfwhichSharesToSell").innerText=hotelName;
  } else {
    let message = 'Waiting for other players to dispose shares';
    displayFlashMessage(message);
  }
};
let requestdisposeShares=function(){
  let hotelName=getElement("#hotelNameOfwhichSharesToSell").innerText;
  let noOfSharesToSell=getElement("#noOfSharesToSell").value;
  let noOfSharesToExchange=getElement("#noOfSharesToExchange").value;
  let dataToSend=`hotelName=${hotelName}&noOfSharesToSell=${noOfSharesToSell}`;
  if (noOfSharesToExchange%2==0) {
    dataToSend+=`&noOfSharesToExchange=${noOfSharesToExchange}`;
    sendAjaxRequest('POST','/merge/disposeShares',dataToSend,renderGameStatus);
    let disposeSharesOption=getElement('#disposeShares');
    getGameStatus();
    // getElement("#noOfSharesToSell").value='';
    // getElement("#noOfSharesToExchange").value='';
    disposeSharesOption.style.display="none";
  }
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
  if (tileId==event.target.id) {
    placeTile(event.target.id);
    return ;
  }
  tileId=event.target.id;
  event.target.focus();
};
const generateTilesAsButton = function(tiles,tile){
  tiles+=`<button class='tile' id=${tile}\
   onclick="selectTile(event)">${tile}</button>`;
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
const processShareDetails = function(sharesDiv,sharesDetails){
  let hotelsNames = Object.keys(sharesDetails);
  sharesDiv.innerHTML=null;
  hotelsNames.forEach(function(hotelName){
    if (sharesDetails[hotelName]!=0) {
      let shareCard=createNode('div','',`shareCard ${hotelName} no-img`);
      let centerTag = toHtml([''],'center',shareCard);
      let parent = centerTag.childNodes[1];
      toHtml([hotelName,sharesDetails[hotelName]],'label',parent);
      sharesDiv.appendChild(shareCard);
    }
  });
};

const displaySharesDetails = function(sharesDetails){
  let sharesDiv = document.getElementById('playerShares');
  processShareDetails(sharesDiv,sharesDetails);
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
const addShare = function(event){
  let hotelName=event.target.innerText;
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
    tileOnMarket.setAttribute('class',`${hotel.name} no-img`);
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
  currentPlayer='';
};
const placeTile = function(tile){
  sendAjaxRequest('POST','/actions/placeTile',`tile=${tile}`,placeTileHandler);
  getPlayerDetails();
  getGameStatus();
  return;
};
const displayIndependentTiles = function(independentTiles) {
  independentTiles.forEach(assignTileIndependentClass);
  return;
};
const displayTurnDetails = function(turnDetails) {
  let currentPlayer=turnDetails.currentPlayer;
  let turnDisplay=document.getElementById('turns');
  turnDisplay.innerHTML=null;
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
    IGNORE_MY_TURN=false;
    hideEndTurn();
  }
};
const assignTileIndependentClass = function(tile){
  let tileOnMarket = document.getElementById(tile);
  //tileOnMarket.classList.add('tile');
  //tileOnMarket.classList.add('no-img');
  tileOnMarket.setAttribute('class','tile no-img');
  return;
};

const renderGameStatus = function(){
  let gameStatus = JSON.parse(this.responseText);
  let currentAction = gameStatus.state.expectedActions[0];
  displayCurrentAction(gameStatus.turnDetails,currentAction);
  displayIndependentTiles(gameStatus.independentTiles);
  displayTurnDetails(gameStatus.turnDetails);
  updateActivityLog(gameStatus.gameActivityLog);
  displayHotelDetails(gameStatus.hotelsData);
  if (gameStatus.state.status=="merge") {
    actions["merge"](gameStatus);
  }
  if (gameStatus.state.status=="gameOver") {
    actions["gameOver"](gameStatus);
    displayFlashMessage('Game over');
    return ;
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
    let node = createNode('p',log,'log-items');
    document.getElementById('activity-log').prepend(node);
  });
};
const updateActivityLog = function(gameActivityLog){
  let oldLogs=document.querySelectorAll('.log-items');
  let newLogs = gameActivityLog.slice(0,gameActivityLog.length-oldLogs.length);
  let newLogHtml='';
  if (oldLogs.length==0) {
    let activityLog=getElement('#activity-log');
    newLogHtml = toHtml(gameActivityLog,'p',activityLog,'log-items');
  }else {
    prependLog(newLogs);
  }
};

const displayPlayerName = function (name) {
  me=name;
  document.getElementById('playerName').innerHTML = `<p>${name}</p>`;
};

const updateGameStatus=function(gameStatus){
  let currentPlayer = gameStatus.currentPlayer;
  let notification = `Waiting ${currentPlayer} to complete his move.`;
  getElement('#gameStatus').innerText=notification;
};

const updateGame = function () {
  updateChange[+this.responseText]();
};

const askForChange = function () {
  sendAjaxRequest('GET','/changeDetails','',updateGame);
};

const actionsPerformed = function () {
  generateTable();
  getPlayerDetails();
  getGameStatus();
  setInterval(askForChange,2000);
  IGNORE_MY_TURN=false;
};
window.onload = actionsPerformed;
