
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
  sendAjaxRequest('GET','/changeTurn','',getPlayerDetails);
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

const displayHotelNames = function(allHotelsDetails){
  let hotelsHtml=allHotelsDetails.reduce((prev,cur)=>{
    prev +=`<div class="fakeContent" id="${cur.name}" \
   style="background-color:${cur.color}"><div class="hotels">${cur.name}</div>\
   <div class="hotels">${cur.shares}</div>\
   <div class="hotels">${cur.sharePrice}</div></div><br>`;
    return prev;
  },'<h3 id="hotel-heading">Hotels</h3>   ');
  document.getElementById('hotels-place').innerHTML = hotelsHtml;
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


const placeTile = function(tile){
  sendAjaxRequest('POST','/placeTile',`tile=${tile}`);
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
    showEndTurn();
  }else{
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
  console.log(gameStatus);
  displayHotelDetails(gameStatus.hotelsData);
  displayIndependentTiles(gameStatus.independentTiles);
  displayTurnDetails(gameStatus.turnDetails);
};

let getGameStatus = function(){
  sendAjaxRequest('GET','/gameStatus','',renderGameStatus);
};


const actionsPerformed = function () {
  generateTable();
  getGameStatus();
  getPlayerDetails();
  setInterval(getGameStatus,5000);
  setInterval(getPlayerDetails,5000);
};

window.onload = actionsPerformed;
