
let getElement = function(selector){
  return document.querySelector(selector);
};

let listToHTML = function(list,className,elementName='p') {
  let html=list.map((item)=>{
    return `<${elementName} class=${className} > ${item} </${elementName}>`;
  }).join('');
  return html;
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
  tiles+=`<button class='tile' value=${tile} ondblclick="placeTile(event)">\
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
  console.log('hi');
  sendAjaxRequest('GET','/playerDetails','',displayPlayerDetails);
  return;
};

const displayPlayerDetails = function () {
  let playerDetails = JSON.parse(this.responseText);
  displayTiles(playerDetails.tiles);
  displayMoney(playerDetails.availableMoney);
  displayPlayerName(playerDetails.name);
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
  setInterval(()=>{
    sendAjaxRequest('GET','/hotelDetails','',displayHotelDetails);
  },1000);
  return;
};

const displayHotelDetails = function () {
  let allHotelsDetails = JSON.parse(this.responseText);
  displayHotelNames(allHotelsDetails);
};

// const enablePlacingTiles = function () {
//   let tiles = document.getElementsByClassName('tile');
//   tile.forEach(function(tile){
//     tile.onclick = tileOnClickAction;
//   })
// }

const placeTile = function(event){
  let tile=event.target.value;
  sendAjaxRequest('POST','/placeTile',`tile=${tile}`,getIndependentTiles);
  return;
};

const getIndependentTiles = function(){
  sendAjaxRequest('GET','/getIndependentTiles','',displayIndependentTiles);
  return;
};
const displayIndependentTiles = function() {
  console.log(this.responseText);
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
  setInterval(getPlayerDetails,1000);
  getAllHotelsDetails();
  setInterval(getIndependentTiles,1000);
  setInterval(getTurnDetails,500);

};

window.onload = actionsPerformed;
