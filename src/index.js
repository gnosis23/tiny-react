import {render} from './render';
import { h } from './vnode';

// ============================================================================
//                     demo
// ============================================================================
const element = (
  <div className="shopping-list">
    <h1>Shopping List for {111}</h1>
    <ul>
      <li onClick={e => console.log(e.target)}>Instagram</li>
      <li onClick={e => console.log(e.target)}>WhatsApp</li>
      <li onClick={e => console.log(e.target)}>Oculus</li>
    </ul>
  </div>
);

console.log(element);
render(element, document.getElementById('root'));