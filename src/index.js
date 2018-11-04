import {render} from './render';
import { h } from './vnode';
import { Component } from './component';

// ============================================================================
//                     demo
// ============================================================================
class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

const element = <Clock />
console.log(element);
render(element, document.getElementById('root'));