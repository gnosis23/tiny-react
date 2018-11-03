export class VNode {
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
export function h(tag, attrs, ...children) {
  return new VNode(tag, attrs, children ? [...children] : []);
}
