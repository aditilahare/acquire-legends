/*eslint no-implicit-globals: "off"*/
let cart =[];

const chooseHotel = function(){
  let hotelName=getElement('#choose-hotel select[name="hotelName"]').value;
  sendAjaxRequest('POST','/actions/chooseHotel',`hotelName=${hotelName}`,()=>{
    console.log(this.responseText);
  });
  getElement('#choose-hotel').classList.add('hidden');
  showEndTurn();
};

const createInactiveHotelsForm = function(hotels){
  let html=`<select name="hotelName">`;
  html +=hotels.map((hotel)=>{
    return `<option value="${hotel.name}">${hotel.name}</option>`;
  }).join('');
  html += `</select><button name="Start hotel" onclick="chooseHotel()">
  Start hotel</button>`;
  return html;
};

const actions={};
actions['changeTurn']=function(){
  changeTurn();
  hideEndTurn();
};
actions['chooseHotel']=function(res){
  let form=createInactiveHotelsForm(res.inactiveHotels);
  getElement('#choose-hotel').innerHTML=form;
  getElement('#choose-hotel').classList.remove('hidden');
};
actions['buyShares']=function(res){
  showEndTurn();
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
  let cartDetails = JSON.stringify(prepareCart());
  sendAjaxRequest('POST','/purchaseShares',`cart=${cartDetails}`);
  cart=[];
  getElement('#cart').innerText='';
  sendAjaxRequest('GET','/changeTurn','',getPlayerDetails);
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
  element=getElement('#change-turn button').onclick=changeTurn;
};

const hideEndTurn = function () {
  let element=getElement('#change-turn');
  element.classList.add('hidden');
  element=getElement('#change-turn button').onclick='';
};
/*Creating Table*/

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


/*tile Generator*/

const generateTiles = function (tiles){
  return tiles.reduce(generateTilesAsButton,'');
};

const generateTilesAsButton = function(tiles,tile){
  tiles+=`<button class='tile' value=${tile}\
   ondblclick="placeTile(this.value)">\
 <span>${tile}</span></button>`;
  return tiles;
};

/* formatting money as rupee*/
const getCashInRupee = function (money) {
  return `<center><h2 class='myCash'> &#8377; ${money}<h2></center>`;
};

/*Display Player tiles*/

const displayTiles = function(tiles){
  document.getElementById('tileBox').innerHTML = generateTiles(tiles);
  return;
};
/*Display Player Money*/
const displayMoney = function(money){
  document.getElementById('wallet').innerHTML = getCashInRupee(money);
  return;
};

/*Display player name */

const displayPlayerName = function (name) {
  document.getElementById('playerName').innerHTML = `<p>Hello ${name} !</p>`;
};

/*Get player details*/
const getPlayerDetails = function () {
  sendAjaxRequest('GET','/playerDetails','',displayPlayerDetails);
  return;
};

const processShareDetails = function(sharesDiv,sharesDetails){
  let hotelsNames = Object.keys(sharesDetails);
  let html = ``;
  hotelsNames.forEach(function(hotelName){
    html += `<div class='shareCard ${hotelName}'>`+
  `<center><label>${hotelName}</label></br>`+
  `<label>${sharesDetails[hotelName]}</center><label></div>`;
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
  cartDiv.appendChild(preview);
};
const addShare = function(){
  console.log(event.target.parentElement.parentElement);
  let hotelName= event.target.parentElement.parentElement.id;
  // let hotelColor = event.target.parentElement.parentElement.;
  console.log(hotelName);
  addToCart(hotelName);
  // console.log(hotelColor);
};
const removeShare = function(){
  cart[hotelName]-=1;
  console.log(event.target.parentElement.parentElement);
  let hotelName= event.target.parentElement.parentElement.id;
  console.log(hotelName);
  removeFromCart(hotelName);
  // console.log(hotelColor);
};
const displayHotelNames = function(allHotelsDetails){
  let hotelsHtml=allHotelsDetails.reduce((prev,cur)=>{
    let shareButtons = '';
    if(cur.status){
      shareButtons=`<button id="${cur.name}AddShare" onclick="addShare()"> + \
      </button></br><button id="${cur.name}RemoveShare" \
      onclick="removeShare()"> - </button></button>`;
    }
    prev +=`<div class="fakeContent" id="${cur.name}" \
   style="background-color:${cur.color}"><div class="hotels">${cur.name}</div>\
   <div class="hotels">${cur.shares}<br>${cur.sharePrice}</div><div>\
   ${shareButtons}</div></div>`;
    return prev;
  },'<h3 id="hotel-heading">Hotels</h3>   ');
  document.getElementById('hotels-place').innerHTML = hotelsHtml;
};

const createBtn = function(innerText,onclickFn=''){
  let btn = document.createElement('button');
  btn.innerText = innerText;
  btn.onclick = onclickFn;
  return btn;
};


const displayHotelDetails = function (allHotelsDetails) {
  displayHotelNames(allHotelsDetails);
  updateHotelsOnBoard(allHotelsDetails);
};

const assignTilesWithRespectiveHotel = function(hotel){
  hotel.occupiedTiles.forEach(tile=>{
    let tileOnMarket = document.getElementById(tile);
    tileOnMarket.classList.add(hotel.name);
  });
  return;
};

const updateHotelsOnBoard= function (allHotelsDetails){
  allHotelsDetails.forEach(assignTilesWithRespectiveHotel);
};

const placeTileHandler = function () {
  let response;
  console.log(this.status);
  if(this.status!=403){
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
  currentPlayer = `<div id='currentPlayer'>${currentPlayer}</div>`;
  let otherPlayers=listToHTML(turnDetails.otherPlayers,'other-player','div');
  document.getElementById('turns').innerHTML =`${currentPlayer}${otherPlayers}`;
  let isMyTurn=turnDetails.isMyTurn;
  if(eval(isMyTurn)){
    if(!IGNORE_MY_TURN){
      IGNORE_MY_TURN=true;
      alert(`${turnDetails.currentPlayer} it's your turn`);
    }
  }else{
    document.tile=`${turnDetails.currentPlayer} it's your turn`;
    IGNORE_MY_TURN=false;
    hideEndTurn();
  }
};


const assignTileIndependentClass = function(tile){
  let tileOnMarket = document.getElementById(tile);
  tileOnMarket.classList.add('independent');
  return;
};

const renderGameStatus = function(){
  let gameStatus = JSON.parse(this.responseText);
  // console.log(gameStatus);
  displayHotelDetails(gameStatus.hotelsData);
  displayIndependentTiles(gameStatus.independentTiles);
  displayTurnDetails(gameStatus.turnDetails);
};

let getGameStatus = function(){
  sendAjaxRequest('GET','/gameStatus','',renderGameStatus);
};

let getTurnState = function(){
  sendAjaxRequest('GET','/actions/turnState','',placeTileHandler);
};


const actionsPerformed = function () {
  generateTable();
  getGameStatus();
  getPlayerDetails();
  setInterval(getGameStatus,1000);
  setInterval(getPlayerDetails,1000);
  getTurnState();
  IGNORE_MY_TURN=false;
};

window.onload = actionsPerformed;
