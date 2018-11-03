export function setAttribute(dom, attrName, value) {
  if (attrName === 'className') {    
    dom.setAttribute('class', value);
  }
  else if (/on(\w+)/.test(attrName)) {
    const key = attrName.match(/on(\w+)/)[1].toLowerCase();    
    dom.addEventListener(key, value);
  } 
  else {    
    dom.setAttribute(attrName, value);
  }
}