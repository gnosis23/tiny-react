import { renderComponent } from './vdom/diff';

export class Component {
  constructor(props) {
    this.state = {};
    this.props = props;
  }

  setState(newState) {
    Object.assign(this.state, newState);
    // rerender
    renderComponent(this);
  }
}
