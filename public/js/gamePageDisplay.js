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
