const displayHotelNames = function(allHotelsDetails){
  getElement('#listed-hotels').innerHTML='';
  let hotelsHtml=allHotelsDetails.reduce((prev,cur)=>{
    let shareButtons = '';
    if(cur.status&& cur.shares > 0){
      shareButtons=`<button class="${cur.name} share-button" \
      id="${cur.name}AddShare" onclick="addShare('${cur.name}')"> ${cur.name} \
      </button>`;
      getElement('#listed-hotels').innerHTML += shareButtons;
    }
    prev +=`<div class="fakeContent" id="${cur.name}">\
    <div class="hotels ${cur.name} bg-none"></div>\
    <div class="hotels">${cur.name}</div>\
    <div class="hotels">${cur.shares}</div>
    <div class="hotels">${cur.sharePrice}</div></div>`;
    return prev;
  },`<h3 id="hotel-heading" >Hotel's Information</h3> \
  <div class="fakeContent titles"><div class="title">Hotel</div>\
  <div class='title'>Name</div><div class="title">Shares</div>\
  <div class="title">Cost</div></div>`);
  document.getElementById('hotels-place').innerHTML = hotelsHtml;
};

const toDomManipulation = function (element,innerText,appendingTag){
  appendingTag = document.createElement(appendingTag);
  appendingTag.innerText = innerText;
  element.appendChild(appendingTag);
};
const getMessage = function (rankList,me) {
  let winner = rankList[0].name;
  if (winner==me) {
    return 'Congratulations!\nYou Are The Richest Player';
  }
  return 'Better Luck Next Time';
};

const addHeaders = function (tr) {
  toDomManipulation(tr,"RANK","th");
  toDomManipulation(tr,"NAME","th");
  toDomManipulation(tr,"CASH","th");
};

const rankListHtmlGenerator=function (rankList,me) {
  let rank = 1;
  let rankListContent = document.getElementById('rankListContent');
  let heading = document.createElement('h1');
  heading.innerText = 'Game Over';
  let message = getMessage(rankList,me);
  rankListContent.appendChild(heading);
  toDomManipulation(rankListContent,message,'h2');
  let table = document.createElement('table');
  let tr = document.createElement('tr');
  addHeaders(tr);
  table.append(tr);
  table.className = 'rankList';
  rankList.forEach(player=>{
    let tr = document.createElement('tr');
    toDomManipulation(tr,rank++,"td");
    toDomManipulation(tr,player.name,"td");
    toDomManipulation(tr,player.cash,"td");
    table.append(tr);
  });
  rankListContent.appendChild(table);
};
