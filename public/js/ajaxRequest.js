
const noAction = function () {
  //do nothing
};


const sendAjaxRequest = function(method,url,reqBody='',callBack=noAction,hs={}){
  let xmlReq = new XMLHttpRequest();
  let callBackHandler = function(){
    if(this.status==200) {
      callBack.call(this);
    }
  };
  xmlReq.addEventListener('load',callBackHandler);
  xmlReq.open(method,url);
  Object.keys(hs).forEach(header=>{
    xmlReq.setRequestHeader(header,hs[header]);
  });
  xmlReq.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  xmlReq.send(reqBody);
};
