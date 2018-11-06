export function setAttribute(dom, attrName, value) {
  if (attrName === 'className') {    
    dom.setAttribute('class', value);
  }
  else if (/on(\w+)/.test(attrName)) {
    const key = attrName.toLowerCase();    
    dom[key] = value || '';
  } 
  else {    
    dom.setAttribute(attrName, value);
  }
}