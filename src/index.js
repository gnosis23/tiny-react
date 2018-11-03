class VNode {
  constructor(tag, attrs, children) {
    this.tag = tag;
    this.attrs = attrs;
    this.children = children;
  }
}

function h(tag, attrs, ...children) {
  return new VNode(tag, attrs, children ? [...children] : []);
}


const element = (
  <div>
    <span>hello</span> world
  </div>
);

console.log(element);