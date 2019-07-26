/* eslint-disable react/no-multi-comp */
// eslint-disable-next-line
import { h } from '../../src/vnode';
import { Component } from '../../src/component';
import { render } from '../../src/render';

const Empty = () => null;

describe('Components', () => {
  let scratch;

  function getInstance() {
    return scratch.lastChild._component;
  }

	beforeEach( () => {
		scratch = document.createElement('div');
		(document.body || document.documentElement).appendChild(scratch);
	});

	beforeEach( () => {
		const c = scratch.firstElementChild;
		if (c) render(<Empty />, scratch, c);
		scratch.innerHTML = '';
	});

	afterEach( () => {
		scratch.parentNode.removeChild(scratch);
		scratch = null;
  });

  it('should render components', () => {
    class C1 extends Component {
      render() {
        return <div>C1</div>
      }
    }
    // spy
    spyOn(C1.prototype, 'render').and.callThrough();
    render(<C1 />, scratch);

    expect(C1.prototype.render).toHaveBeenCalled();
    expect(C1.prototype.render()).toEqual(jasmine.objectContaining({
      tag:'div',
    }));

    expect(scratch.innerHTML).toEqual('<div>C1</div>');
  });

  it('should render components with props', () => {
    const PROPS = { foo: 'bar', onBaz: () => {} };
    let ctorProps;

    class C2 extends Component {
      constructor(props) {
        super(props);
        ctorProps = props;
      }
      render() {
        return <div {...this.props} />
      }
    }

    spyOn(C2.prototype, 'render').and.callThrough();

    render(<C2 {...PROPS} />, scratch);

    expect(ctorProps).toEqual(PROPS);

    expect(C2.prototype.render).toHaveBeenCalled();
    expect(C2.prototype.render).toHaveBeenCalledWith();
    expect(scratch.innerHTML).toEqual('<div foo="bar"></div>');
    expect(getInstance().render()).toEqual(jasmine.objectContaining({
      tag: 'div',
      attrs: PROPS,
    }));
  })
});
