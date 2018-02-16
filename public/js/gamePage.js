

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
  return `<table>${grid}</table>`;
};

const generateTable = function () {
  document.getElementById('board').innerHTML = tableGenerator(9,12);
};


/*tile Generator*/

const generateTiles = function (tiles){
  return tiles.reduce(generateTilesAsButton,'');
};

const generateTilesAsButton = function(tiles,tile){
  tiles+=`<button value=${tile}>${tile}</button>`;
  return tiles;
};

/* formatting money as rupee*/
const getCashInRupee = function (money) {
  return `<h2 class='myCash'> &#8377; ${money}<h2>`;
};

/*Display Player tiles*/

const displayTiles = function(tiles){
  document.getElementById('tileBox').innerHTML = generateTiles(tiles);
  return;
};

const displayMoney = function(money){
  document.getElementById('wallet').innerHTML = getCashInRupee(money);
  return;
};


const getPlayerDetails = function () {
  sendAjaxRequest('GET','/playerDetails','',displayPlayerDetails);
  return;
};

const displayPlayerDetails = function () {
  console.log(this.responseText);
  let playerDetails = JSON.parse(this.responseText);
  displayTiles(playerDetails.tiles);
  displayMoney(playerDetails.availableMoney);
};

window.onload = function(){
  generateTable();
  getPlayerDetails();
};
