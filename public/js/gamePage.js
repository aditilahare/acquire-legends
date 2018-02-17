

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
  tiles+=`<button class='tile' value=${tile}><span>${tile}</span></button>`;
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

const displayPlayerDetails = function () {
  let playerDetails = JSON.parse(this.responseText);
  displayTiles(playerDetails.tiles);
  displayMoney(playerDetails.availableMoney);
  displayPlayerName(playerDetails.name);
};

const displayHotelNames = function(allHotelsDetails){
  let hotelsHtml=allHotelsDetails.reduce((prev,cur)=>{
    prev +=`<div class="fakeContent" id="${cur.name}" \
    style="background-color:${cur.color}">${cur.name}</div><br>`;
    return prev;
  },'');
  document.getElementById('hotels-place').innerHTML=hotelsHtml;
};

const getAllHotelsDetails = function () {
  sendAjaxRequest('GET','/hotelDetails','',displayHotelDetails);
  return;
};

const displayHotelDetails = function () {
  let allHotelsDetails = JSON.parse(this.responseText);
  displayHotelNames(allHotelsDetails);
};

window.onload = function(){
  generateTable();
  getPlayerDetails();
  getAllHotelsDetails();
};
