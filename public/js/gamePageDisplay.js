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

const rankListHtmlGenerator = function (rankList,me) {
  let rank = 1;
  let rankListContent = document.getElementById('rankListContent');
  rankListContent.innerHTML=null;
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
  toHtml(['End'],'button',rankListContent,'end-button');
  rankListContent.lastChild.addEventListener('click',endGame);
};

const stopRequests = function(){
  clearInterval(getGameStatus);
  clearInterval(getPlayerDetails);
};
const reload = function () {
  // window.Location();
  location.href='/';
};

const endGame = function () {
  stopRequests();
  sendAjaxRequest('GET','/endGame','',reload);
};

const displayMoney = function(money){
  document.getElementById('wallet').innerHTML = getCashInRupee(money);
  return;
};

const displayFlashMessage = function (message) {
  document.getElementById('currentActivity').innerText=message;
};
