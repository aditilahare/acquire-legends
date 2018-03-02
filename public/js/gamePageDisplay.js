const displayHotelNames = function(allHotelsDetails){
  let cartDiv=getElement('#listed-hotels');
  cartDiv.innerHTML='';
  let hotelList = document.getElementById('hotels-place');
  hotelList.innerHTML= '';
  let prev = toHtml(["Hotel's Information"],'h3',hotelList);
  let childDiv = createNode('div',"","fakeContent titles");
  toHtml(['Hotel','Name','Shares','Cost'],'div',childDiv,'title');
  prev.appendChild(childDiv);
  allHotelsDetails.reduce((prev,cur)=>{
    if(cur.status&& cur.shares > 0){
      let hotelName=[`${cur.name}`];
      let classes =`${cur.name} share-button`;
      let id=`${cur.name}AddShare`;
      let button = toHtml(hotelName,'button',cartDiv,classes,id);
    }
    let childDiv = createNode('div',"","fakeContent",cur.name);
    toHtml([""],'div',childDiv,`hotels ${cur.name} bg-none`);
    let hotelData=[`${cur.name}`,`${cur.shares}`,`${cur.sharePrice}`];
    toHtml(hotelData,'div',childDiv,`hotels`);
    prev.appendChild(childDiv);
    return prev;
  },prev);
  assignPurchaseShares();
};

const assignPurchaseShares = function(){
  let shareButtons = getElement("#listed-hotels").childNodes;
  shareButtons.forEach((shareButton)=>{
    shareButton.onclick = addShare;
  });
};

const getMessage = function (rankList,me) {
  let winner = rankList[0].name;
  if (winner==me) {
    return 'Congratulations!\nYou Are The Richest Player';
  }
  return 'Better Luck Next Time';
};

const rankListHtmlGenerator=function (rankList,me) {
  let rank = 1;
  let rankListContent = document.getElementById('rankListContent');
  rankList.remove();
  let message = getMessage(rankList,me);
  toHtml(['Game Over'],'h1',rankListContent);
  toHtml([message],'h2',rankListContent);
  let table = document.createElement('table');
  let tr = document.createElement('tr');
  toHtml(["RANK","NAME","CASH"],'th',tr);
  table.append(tr);
  table.className = 'rankList';
  rankList.forEach(player=>{
    let tr = document.createElement('tr');
    toHtml([rank++,player.name,player.cash],'td',tr);
    table.append(tr);
  });
  rankListContent.appendChild(table);
};

const toHtml = function (elementList,tag,parent,className='',id='',action) {
  return elementList.reduce((parent,value)=>{
    let element = createNode(tag,value,className,id,action);
    parent.appendChild(element);
    return parent;
  },parent);
};

const createNode = function(tag,value="",className="",id=""){
  let element = document.createElement(tag);
  element.className = className;
  element.id=id;
  element.appendChild(document.createTextNode(value));
  return element;
};

const displayMoney = function(money){
  document.getElementById('wallet').innerHTML = getCashInRupee(money);
  return;
};

const displayCurrentAction = function (turnDetails, expectedAction) {
  let message = '';
  if(turnDetails.isMyTurn){
    message = 'Please '+flashMessage[expectedAction];
  } else {
    message = `Waiting for ${turnDetails.currentPlayer} to `;
    message+=flashMessage[expectedAction];
  }
  displayFlashMessage(message);
  return;
};

const displayFlashMessage = function (message) {
  document.getElementById('currentActivity').innerText=message;
};

let flashMessage = {
  'placeTile' : 'place tile',
  'purchaseShares' : 'purchase shares',
  'chooseHotel' : 'choose hotel to start',
  'chooseHotelForMerge' : 'choose hotel for merge',
  'deployShares' : 'deploy shares',
};
