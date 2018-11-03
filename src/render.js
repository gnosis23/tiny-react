import { setAttribute } from './attr';

/**
 * @param {VNode | string} vnode
 * @param {HTMLElement} node
 */
export function render(vnode, node) {
  node.innerHTML = ``;
  const dom = _render(vnode);
  node.appendChild(dom);
}

/**
 * @param {VNode} vnode
 */
function _render(vnode) {
  let dom;
  
  if (typeof vnode === 'string') {
    dom = document.createTextNode(vnode);
  } 
  else if (typeof vnode === 'number') {
    dom = document.createTextNode(String(vnode));
  }
  else {
    dom = document.createElement(vnode.tag);
  }



  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(attr => {
      setAttribute(dom, attr, vnode.attrs[attr]);
    })
  }

  if (vnode.children) {
    vnode.children.forEach(child => {
      dom.appendChild(_render(child));
    });
  }

  return dom;
}