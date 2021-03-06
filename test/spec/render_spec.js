import { render } from '../../src/render';
// eslint-disable-next-line
import { h } from '../../src/vnode';

function getAttributes(node) {
	const attrs = {};
	for (let i=node.attributes.length - 1; i >= 0; i -= 1) {
		attrs[node.attributes[i].name] = node.attributes[i].value;
	}
	return attrs;
}

describe('render()', () => {
	let scratch;

	beforeEach( () => {
		scratch = document.createElement('div');
		(document.body || document.documentElement).appendChild(scratch);
	});

	beforeEach( () => {
		scratch.innerHTML = '';
	});

	afterEach( () => {
		scratch.parentNode.removeChild(scratch);
		scratch = null;
	});

	it('should render a empty text node given null', () => {
		render(null, scratch);
		const c = scratch.childNodes;
		expect(c.length).toEqual(1);
		expect(c[0].data).toEqual('');
		expect(c[0].nodeName).toEqual('#text');
	});

	it('should render an empty text node given an empty string', () => {
		render('', scratch);
		const c = scratch.childNodes;
		expect(c.length).toEqual(1);
		expect(c[0].data).toEqual('');
		expect(c[0].nodeName).toEqual('#text');
  });

  it('should create empty nodes (<* />)', () => {
		render(<div />, scratch);
		expect(scratch.childNodes.length).toEqual(1);
		expect(scratch.childNodes[0].nodeName).toEqual('DIV');

		scratch.innerHTML = '';

		render(<span />, scratch);
		expect(scratch.childNodes.length).toEqual(1);
		expect(scratch.childNodes[0].nodeName).toEqual('SPAN');
  });

  it('should support custom tag names', () => {
		render(<foo />, scratch);
		expect(scratch.childNodes.length).toEqual(1);
		expect(scratch.firstChild.nodeName).toEqual('FOO');

		scratch.innerHTML = '';

		render(<x-bar />, scratch);
		expect(scratch.childNodes.length).toEqual(1);
		expect(scratch.firstChild.nodeName).toEqual('X-BAR');
  });

  it('should append new elements when called without a merge argument', () => {
		render(<div />, scratch);
		expect(scratch.childNodes.length).toEqual(1);
		expect(scratch.firstChild.nodeName).toEqual('DIV');

		render(<span />, scratch);
		expect(scratch.childNodes.length).toEqual(2);
		expect(scratch.childNodes[0].nodeName).toEqual('DIV');
		expect(scratch.childNodes[1].nodeName).toEqual('SPAN');
  });

  it('should merge new elements when called with a merge argument', () => {
		const root = render(<div />, scratch);
		expect(scratch.childNodes.length).toEqual(1);
		expect(scratch.firstChild.nodeName).toEqual('DIV');

		render(<span />, scratch, root);
		expect(scratch.childNodes.length).toEqual(1);
		expect(scratch.firstChild.nodeName).toEqual('SPAN');
  });

  it('should nest empty nodes', () => {
		render(
      (
        <div>
          <span />
          <foo />
          <x-bar />
        </div>
		  ), scratch);

		expect(scratch.childNodes.length).toEqual(1);
		expect(scratch.childNodes[0].nodeName).toEqual('DIV');

		const c = scratch.childNodes[0].childNodes;
		expect(c.length).toEqual(3);
		expect(c[0].nodeName).toEqual('SPAN');
		expect(c[1].nodeName).toEqual('FOO');
		expect(c[2].nodeName).toEqual('X-BAR');
  });

  // 不渲染以下值
  it('should not render falsy values', () => {
		render(
      (
        <div>
          {null},{undefined},{false},{0},{NaN}
        </div>
		), scratch);

		expect(scratch.firstChild.innerHTML).toEqual(',,,0,NaN');
  });

  it('should not render null', () => {
		render(null, scratch);
		expect(scratch.innerHTML).toEqual('');
  });

  it('should not render undefined', () => {
		render(undefined, scratch);
		expect(scratch.innerHTML).toEqual('');
	});

	it('should not render boolean true', () => {
		render(true, scratch);
		expect(scratch.innerHTML).toEqual('');
	});

	it('should not render boolean false', () => {
		render(false, scratch);
		expect(scratch.innerHTML).toEqual('');
	});

	it('should render NaN as text content', () => {
		render(NaN, scratch);
		expect(scratch.innerHTML).toEqual('NaN');
	});

	it('should render numbers (0) as text content', () => {
		render(0, scratch);
		expect(scratch.innerHTML).toEqual('0');
	});

	it('should render numbers (42) as text content', () => {
		render(42, scratch);
		expect(scratch.innerHTML).toEqual('42');
	});

	it('should render strings as text content', () => {
		render('Testing, huh! How is it going?', scratch);
		expect(scratch.innerHTML).toEqual('Testing, huh! How is it going?');
  });

  it('should clear falsy attributes', () => {
		const root = render(
      (<div anull="anull" aundefined="aundefined" afalse="afalse" anan="aNaN" a0="a0" />),
      scratch);

		render(<div anull={null} aundefined={undefined} afalse={false} anan={NaN} a0={0} />
		  , scratch, root);

		expect(getAttributes(scratch.firstChild), 'from previous truthy values').toEqual({
			a0: '0',
			anan: 'NaN',
		});
	});

	it('should not render falsy attributes on initial render', () => {
		render(<div anull={null} aundefined={undefined} afalse={false} anan={NaN} a0={0} />, scratch);

		expect(getAttributes(scratch.firstChild), 'initial render').toEqual({
			a0: '0',
			anan: 'NaN',
		});
  });

	it('should clear falsy DOM properties', () => {
		let root;
		function test(val) {
			root = render(
        (
          <div>
            <input value={val} />
            <table border={val} />
          </div>
        ),
        scratch, root);
		}

		test('2');
		test(false);
		expect(scratch.innerHTML).toEqual('<div><input><table></table></div>', 'for false');

		test('3');
		test(null);
		expect(scratch.innerHTML).toEqual('<div><input><table></table></div>', 'for null');

		test('4');
		test(undefined);
		expect(scratch.innerHTML).toEqual('<div><input><table></table></div>', 'for undefined');
  });

	it('should apply string attributes', () => {
		render(<div foo="bar" data-foo="databar" />, scratch);

		const div = scratch.childNodes[0];
		expect(div.attributes.length).toEqual(2);

		expect(div.attributes[0].name).toEqual('foo');
		expect(div.attributes[0].value).toEqual('bar');

		expect(div.attributes[1].name).toEqual('data-foo');
		expect(div.attributes[1].value).toEqual('databar');
  });

	it('should not serialize function props as attributes', () => {
		render(<div click={function a(){}} ONCLICK={function b(){}} />, scratch);

		const div = scratch.childNodes[0];
		expect(div.attributes.length).toEqual(0);
  });

  it('should serialize object props as attributes', () => {
		render(<div foo={{ a: 'b' }} bar={{ toString() { return 'abc'; } }} />, scratch);

		const div = scratch.childNodes[0];
		expect(div.attributes.length).toEqual(2);

		expect(div.attributes[0].name).toEqual('foo');
		expect(div.attributes[0].value).toEqual('[object Object]');

		expect(div.attributes[1].name).toEqual('bar');
		expect(div.attributes[1].value).toEqual('abc');
  });

  it('should apply class as String', () => {
		render(<div className="foo" />, scratch);
		expect(scratch.childNodes[0].className).toEqual('foo');
	});

	it('should alias className to class', () => {
		render(<div className="bar" />, scratch);
		expect(scratch.childNodes[0].className).toEqual('bar');
  });

  it('should reconcile mutated DOM attributes', () => {
    const check = p => render(
      <input type="checkbox" checked={p} />,
      scratch, scratch.lastChild);
    const value = () => scratch.lastChild.checked;
    const setValue = p => { scratch.lastChild.checked = p };
    check(true);
    expect(value()).toEqual(true);
    check(false);
    expect(value()).toEqual(false);
    check(true);
		expect(value()).toEqual(true);
		setValue(false);
		check(true);
		expect(value()).toEqual(true);
		setValue(false);
		check(true);
		expect(value()).toEqual(true);
  });

	// it('should ignore props.children if children are manually specified', () => {
	// 	expect(<div a children={['a', 'b']}>c</div>).toEqual(
	// 		<div a>c</div>
	// 	);
  // });

  it('should reorder child pairs', () => {
		let root = render(
      (
        <div>
          <a>a</a>
          <b>b</b>
        </div>
      ),
      scratch, root);

		const a = scratch.firstChild.firstChild;
		const b = scratch.firstChild.lastChild;

		expect(a.nodeName).toEqual('A');
		expect(b.nodeName).toEqual('B');

		root = render(
      (
        <div>
          <b>b</b>
          <a>a</a>
        </div>
		  ), scratch, root);

		expect(scratch.firstChild.firstChild.nodeName).toEqual('B');
		expect(scratch.firstChild.lastChild.nodeName).toEqual('A');
		expect(scratch.firstChild.firstChild).toEqual(b);
		expect(scratch.firstChild.lastChild).toEqual(a);
  });

  it('should not merge attributes with node created by the DOM', () => {
		const html = (htmlString) => {
			const div = document.createElement('div');
			div.innerHTML = htmlString;
			return div.firstChild;
		};

		const DOMElement = html`<div><a foo="bar"></a></div>`;
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		const preactElement = <div><a /></div>;

		render(preactElement, scratch, DOMElement);
		expect(scratch.innerHTML).toEqual('<div><a></a></div>');
	});
})
