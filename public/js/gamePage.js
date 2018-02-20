
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
  sendAjaxRequest('GET','/changeTurn','');
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
  let html = `<h2>Shares</h2>`;
  hotelsNames.forEach(function(hotelName){
    html += `<div>${hotelName}=${sharesDetails[hotelName]}</div>`;
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
   <div class="hotels">${cur.shares}</div></div><br>`;
    return prev;
  },'');
  document.getElementById('hotels-place').innerHTML = hotelsHtml;
};

const getAllHotelsDetails = function () {
  sendAjaxRequest('GET','/hotelDetails','',displayHotelDetails);
  return;
};

const displayHotelDetails = function () {
  let allHotelsDetails = JSON.parse(this.responseText);
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
  sendAjaxRequest('POST','/placeTile',`tile=${tile}`,getIndependentTiles);
  return;
};

const getIndependentTiles = function(){
  console.log(this.responseText);
  sendAjaxRequest('GET','/getIndependentTiles','',displayIndependentTiles);
  return;
};
const displayIndependentTiles = function() {
  let independentTiles = JSON.parse(this.responseText);
  independentTiles.forEach(assignTileIndependentClass);
  return;
};

const displayTurnDetails = function() {
  let turnDetails = JSON.parse(this.responseText);
  let currentPlayer=turnDetails.currentPlayer;
  getElement('#current-player').innerHTML=currentPlayer;
  let html=listToHTML(turnDetails.otherPlayers,'other-player','div');
  getElement('#other-players').innerHTML=html;
  let isMyTurn=turnDetails.isMyTurn;
  if(eval(isMyTurn)){
    showEndTurn();
  }else{
    hideEndTurn();
  }
};

const getTurnDetails = function(){
  sendAjaxRequest('GET','/turnDetails','',displayTurnDetails);
};


const assignTileIndependentClass = function(tile){
  let tileOnMarket = document.getElementById(tile);
  tileOnMarket.classList.add('independent');
  return;
};

const actionsPerformed = function () {
  generateTable();
  setInterval(getPlayerDetails,500);
  setInterval(getAllHotelsDetails,500);
  setInterval(getIndependentTiles,1000);
  setInterval(getTurnDetails,500);

};

window.onload = actionsPerformed;
