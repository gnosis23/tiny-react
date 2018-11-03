class VNode {
  /**
   * @param {string} tag
   * @param {object} attrs
   */
  constructor(tag, attrs, children) {
    this.tag = tag;
    this.attrs = attrs;
    this.children = children;
  }
}

// 1: 借助 babel 自动获得一个 VNode 结构体
function h(tag, attrs, ...children) {
  return new VNode(tag, attrs, children ? [...children] : []);
}

// 2: 接下来就是把 VNode 结构体转化为真实的 dom 结构

/**
 * @param {VNode | string} vnode
 * @param {HTMLElement} node
 */
function render(vnode, node) {
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

function setAttribute(dom, attrName, value) {
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

// ============================================================================
//                     demo
// ============================================================================
const element = (
  <div className="shopping-list">
    <h1>Shopping List for {111}</h1>
    <ul>
      <li onClick={e => console.log(e.target)}>Instagram</li>
      <li onClick={e => console.log(e.target)}>WhatsApp</li>
      <li onClick={e => console.log(e.target)}>Oculus</li>
    </ul>
  </div>
);

console.log(element);
render(element, document.getElementById('root'));