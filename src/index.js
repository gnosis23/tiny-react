import {render} from './render';
// eslint-disable-next-line no-unused-vars
import { h } from './vnode';
import { Component } from './component';

// ============================================================================
//                     demo
// ============================================================================
class Counter extends Component {
  constructor( props ) {
      super( props );
      this.state = {
          num: 1,
      }
  }

  onClick() {
      this.setState( { num: this.state.num + 1 } );
  }

  render() {
      return (
        <div>
          <h1>count: { this.state.num }</h1>
          <button onClick={() => this.onClick()}>add</button>
        </div>
      );
  }
}

const element = <Counter />
console.log(element);
render(element, document.getElementById('root'));
