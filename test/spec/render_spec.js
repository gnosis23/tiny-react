import { render } from '../../src/render';
import { h } from '../../src/vnode';

function getAttributes(node) {
	let attrs = {};
	for (let i=node.attributes.length; i--; ) {
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
		let c = scratch.childNodes;
		expect(c.length).toEqual(1);
		expect(c[0].data).toEqual('');
		expect(c[0].nodeName).toEqual('#text');
	});

	it('should render an empty text node given an empty string', () => {
		render('', scratch);
		let c = scratch.childNodes;
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
		let root = render(<div />, scratch);
		expect(scratch.childNodes.length).toEqual(1);
		expect(scratch.firstChild.nodeName).toEqual('DIV');

		render(<span />, scratch, root);
		expect(scratch.childNodes.length).toEqual(1);
		expect(scratch.firstChild.nodeName).toEqual('SPAN');
  });
  
  it('should nest empty nodes', () => {
		render((
			<div>
				<span />
				<foo />
				<x-bar />
			</div>
		), scratch);

		expect(scratch.childNodes.length).toEqual(1);
		expect(scratch.childNodes[0].nodeName).toEqual('DIV');

		let c = scratch.childNodes[0].childNodes;
		expect(c.length).toEqual(3);
		expect(c[0].nodeName).toEqual('SPAN');
		expect(c[1].nodeName).toEqual('FOO');
		expect(c[2].nodeName).toEqual('X-BAR');
  });
  
  // 不渲染以下值
  it('should not render falsy values', () => {
		render((
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
		let root = render((
			<div anull="anull" aundefined="aundefined" afalse="afalse" anan="aNaN" a0="a0" />
		), scratch);

		render((
			<div anull={null} aundefined={undefined} afalse={false} anan={NaN} a0={0} />
		), scratch, root);

		expect(getAttributes(scratch.firstChild), 'from previous truthy values').toEqual({
			a0: '0',
			anan: 'NaN'
		});
	});

	it('should not render falsy attributes on initial render', () => {
		render((
			<div anull={null} aundefined={undefined} afalse={false} anan={NaN} a0={0} />
		), scratch);

		expect(getAttributes(scratch.firstChild), 'initial render').toEqual({
			a0: '0',
			anan: 'NaN'
		});
  });
  
	it('should clear falsy DOM properties', () => {
		let root;
		function test(val) {
			root = render((
				<div>
					<input value={val} />
					<table border={val} />
				</div>
			), scratch, root);
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
  
  
})