import { setAttribute } from './attr';
import { Component } from './component';

/**
 * @param {VNode | string} vnode
 * @param {HTMLElement|undefined} node
 */
export function render(vnode, node) {
  const dom = VNodeToDom(vnode);

  // insert new node
  if (node) {
    node.innerHTML = ``;
    node.appendChild(dom);
  }
}

/**
 * @param {VNode|Component} vnode
 */
function VNodeToDom(vnode) {
  let dom;
  
  if (vnode === null || vnode === undefined) {
    return document.createTextNode('');
  }
  else if (typeof vnode === 'string') {
    return document.createTextNode(vnode);
  } 
  else if (typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }
  else if (typeof vnode.tag === 'function') {
    const ctor = vnode.tag;
    const props = Object.assign(
      {}, 
      vnode.attrs, 
      { children: vnode.children }
    );
    const component = new ctor(props);
    const node = component.render();
    dom = VNodeToDom(node);
    component._dom = dom;    
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
      dom.appendChild(VNodeToDom(child));
    });
  }

  return dom;
}

/**
 * @param {Component} component
 */
export function renderComponent(component) {
  // triggered by setState
  const newDom = VNodeToDom(component.render());
  // replace current dom
  component._dom.parentNode.replaceChild(newDom, component._dom);
  component._dom = newDom;
}