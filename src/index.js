import {render} from './render';
import { h } from './vnode';
import { Component } from './component';

// ============================================================================
//                     demo
// ============================================================================
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  )
}

const element = <App />
console.log(element);
render(element, document.getElementById('root'));