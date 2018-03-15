const listToHTML = function(list, className, elementName = 'p') {
  let html = list.map((item) => {
    return `<${elementName} class=${className} > ${item} </${elementName}>`;
  }).join('');
  return html;
};

const getElement = function(selector) {
  return document.querySelector(selector);
};

const toHtml = function (elementList,tag,parent,className='',id='') {
  return elementList.reduce((parent,value)=>{
    let element = createNode(tag,value,className,id);
    parent.appendChild(element);
    return parent;
  },parent);
};

const createNode = function(tag,value="",className="",id=""){
  let element = document.createElement(tag);
  element.setAttribute('class',className);
  element.setAttribute('id',id);
  element.setAttribute('value',value);
  element.appendChild(document.createTextNode(value));
  return element;
};
