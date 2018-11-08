export function setAttribute(dom, attrName, value) {
  if (value === undefined) {
    dom.removeAttribute(attrName);
  } 
  else if (attrName === 'className') {    
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