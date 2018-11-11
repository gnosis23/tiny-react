import { diff } from './vdom/diff';

/**
 * @param {VNode | string} vnode
 * @param {HTMLElement|undefined} container
 */
export function render(vnode, container, dom) {
  return diff(dom, vnode, container);
}

