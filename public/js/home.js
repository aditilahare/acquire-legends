// Get the modal
let modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const toggle = function(btId){
  let button = document.getElementById(btId);
  if(button.disabled) {
    button.disabled=false;
  } else {
    button.disabled=true;
  }
};

const toggleButtons = function() {
  if(eval(this.responseText)){
    toggle('create-bt');
  }else{
    toggle('join-bt');
  }
};

const doesGameExisted = function(){
  sendAjaxRequest('GET','/isGameExisted','',toggleButtons);
};

window.onload = function () {
  doesGameExisted();
};
