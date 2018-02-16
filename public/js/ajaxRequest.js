
const noAction = function () {
  //do nothing
};

const sendAjaxRequest = function(method,url,reqBody='',callBack=noAction){
  let xmlReq = new XMLHttpRequest();
  xmlReq.addEventListener('load',callBack);
  xmlReq.open(method,url);
  if(reqBody){
    xmlReq.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    xmlReq.send(reqBody);
    return;
  }
  xmlReq.send();
};
