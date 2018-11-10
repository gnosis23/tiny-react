// https://github.com/hujiulong/simple-react/blob/chapter-3/src/react-dom/diff.js
import { Component } from './component';
import { setAccessor } from './attr';
import { isFalsy } from './util';
import { ATTR_KEY } from './constants';

/**
 * @param {HTMLElement} dom 真实DOM
 * @param {vnode} vnode 虚拟DOM
 * @param {HTMLElement} container 容器
 * @returns {HTMLElement} 更新后的DOM
 */
export function diff(dom, vnode, container) {

  const ret = diffNode(dom, vnode);

  if (container && ret.parentNode !== container) {
    container.appendChild(ret);
  }

  return ret;
}

/**
 * @param {HTMLElement} dom
 * @param {*} vnode
 */
function diffNode(dom, vnode) {
  let out = dom;

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';

  if (typeof vnode === 'number') vnode = String(vnode);

  // diff text node
  if (typeof vnode === 'string') {
    // 如果当前的DOM就是文本节点
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        dom.textContent = vnode;
      }
    }
    else {
      // 如果DOM不是文本节点，则新建一个文本节点，并且移除掉原来的
      out = document.createTextNode(vnode);
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
      }
    }

    return out;
  }

  if (typeof vnode.tag === 'function') {
    return diffComponent(dom, vnode);
  }

  // 新插入或者替换原来的
  if (!dom || !isSameNodeType(dom, vnode)) {
    out = document.createElement(vnode.tag);

    if (dom) {
      // 将原来的子节点移动新的节点下
      [...dom.childNodes].map(out.appendChild);

      // 移除原来的DOM对象
      if (dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
      }
    }
  }

  let props = out[ATTR_KEY];

  // null or undefined
  if (props == null) {
    out[ATTR_KEY] = {}
    props = out[ATTR_KEY];
    const a = out.attributes;
    for (let i = 0; i < a.length; i+=1) {
      props[a[i].name] = a[i].value;
    }
  }

  // remove falsy
  if (vnode.children) {
    vnode.children = vnode.children.filter(x => !isFalsy(x));
  }

  if (vnode.children && vnode.children.length > 0 || (out.childNodes && out.childNodes.length > 0)) {
    diffChildren(out, vnode.children);
  }

  diffAttributes(out, vnode.attrs, props);

  return out;
}

function diffChildren(dom, vchildren) {
  const domChildren = dom.childNodes;
  const children = [];

  const keyed = {};

  // 归为2堆：有key的和没有的
  if (domChildren.length > 0) {
    for (let i = 0; i < domChildren.length; i+=1) {
      const child = domChildren[i];
      const {key} = child;
      if (key) {
        // keyedLen += 1;
        keyed[key] = child;
      } else {
        children.push(child);
      }
    }
  }

  if (vchildren && vchildren.length > 0) {
    let min = 0;
    let childrenLen = children.length;

    for (let i = 0; i < vchildren.length; i+=1) {
      const vchild = vchildren[i];
      const {key} = vchild;
      let child;

      // 找到同一个类型的
      if (key) {
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined;
        }
      }
      else if (min < childrenLen) {
        for (let j = min; j < childrenLen; j+=1) {
          const c = children[j];

          if (c && isSameNodeType(c, vchild)) {
            child = c;
            children[j] = undefined;

            if (j === childrenLen - 1) childrenLen-=1;
            if (j === min) min+=1;
            break;
          }
        }
      }

      child = diffNode(child, vchild);

      const currentChild = domChildren[i];
      if (child && child !== dom && child !== currentChild) {
        if (!currentChild) {
          dom.appendChild(child);
        } else if (child === currentChild.nextSibling) {
          removeNode(currentChild);
        } else {
          dom.insertBefore(child, currentChild);
        }
      }
    }
  }

}

function diffComponent(dom, vnode) {
  // eslint-disable-next-line
  let c = dom && dom._component;
  let oldDom = dom;

  // 如果组件类型没有变化，则重新set props
  if (c && c.constructor === vnode.tag) {
    setComponentProps(c, vnode.attrs);
    dom = c.base;
    // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
  } else {

    if (c) {
      unmountComponent(c);
      oldDom = null;
    }

    c = createComponent(vnode.tag, vnode.attrs);

    setComponentProps(c, vnode.attrs);
    dom = c.base;

    if (oldDom && dom !== oldDom) {
      // eslint-disable-next-line
      oldDom._component = null;
      removeNode(oldDom);
    }

  }

  return dom;

}

function setComponentProps(component, props) {

  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount();
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }

  component.props = props;

  renderComponent(component);

}

export function renderComponent(component) {

  const renderer = component.render();

  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  }

  const base = diffNode(component.base, renderer);

  component.base = base;
  // eslint-disable-next-line
  base._component = component;

  if (component.base) {
    if (component.componentDidUpdate) component.componentDidUpdate();
  } else if (component.componentDidMount) {
    component.componentDidMount();
  }

  component.base = base;
  // eslint-disable-next-line
  base._component = component;

}

function createComponent(component, props) {

  let inst;

  if (component.prototype && component.prototype.render) {
    // eslint-disable-next-line
    inst = new component(props);
  } else {
    inst = new Component(props);
    inst.constructor = component;
    inst.render = function () {
      return this.constructor(props);
    }
  }

  return inst;

}

function unmountComponent(component) {
  if (component.componentWillUnmount) component.componentWillUnmount();
  removeNode(component.base);
}

function isSameNodeType(dom, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === 3;
  }

  if (typeof vnode.tag === 'string') {
    return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
  }

  // eslint-disable-next-line
  return dom && dom._component && dom._component.constructor === vnode.tag;
}

/**
 * Apply differences in attributes from a VNode to the given DOM Element.
 * @param {*} dom Element with attributes to diff `attrs` against
 * @param {object} attrs The desired end-state key-value attribute pairs
 * @param {object} old Current/previous attributes (from previous VNode or
 *  element's prop cache)
 */
function diffAttributes(dom, attrs, old) {
  let name;

	// remove attributes no longer present on the vnode by setting them to undefined
	for (name in old) {
		if (!(attrs && attrs[name] != null) && old[name] != null) {
      setAccessor(dom, name, old[name], undefined);
      old[name] = undefined;
		}
	}

	// add new & update changed attributes
	for (name in attrs) {
    if (name!=='children'
        && name!=='innerHTML'
        && (!(name in old) ||
            attrs[name]!==(name==='value' || name==='checked' ? dom[name] : old[name]))) {
      setAccessor(dom, name, old[name], attrs[name]);
      old[name] = attrs[name];
		}
	}

}

function removeNode(dom) {

  if (dom && dom.parentNode) {
    dom.parentNode.removeChild(dom);
  }

}
