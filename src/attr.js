import { isFalsy } from "./util";

/**
 * Set a named attribute on the given Node, with special behavior for some names
 * and event handlers. If `value` is `null`, the attribute/handler will be
 * removed.
 * @param {PreactElement} node An element to mutate
 * @param {string} name The name/key to set, such as an event or attribute name
 * @param {*} old The last value that was set for this name/node pair
 * @param {*} value An attribute value, such as a function to be used as an
 *  event handler
 * @private
 */
export function setAccessor(node, name, old, value) {
	if (name==='className') name = 'class';

	if (name==='key') {
		// ignore
	}
	// else if (name==='ref') {
	// 	applyRef(old, null);
	// 	applyRef(value, node);
	// }
	else if (name==='class') {
		node.className = value || '';
	}
	else if (name==='style') {
		if (!value || typeof value==='string' || typeof old==='string') {
			node.style.cssText = value || '';
		}
		if (value && typeof value==='object') {
			if (typeof old!=='string') {
				for (let i in old) if (!(i in value)) node.style[i] = '';
			}
			for (let i in value) {
				node.style[i] = typeof value[i]==='number' && IS_NON_DIMENSIONAL.test(i)===false ? (value[i]+'px') : value[i];
			}
		}
	}
	else if (name==='dangerouslySetInnerHTML') {
		if (value) node.innerHTML = value.__html || '';
	}
	else if (name[0]=='o' && name[1]=='n') {
		let useCapture = name !== (name=name.replace(/Capture$/, ''));
		name = name.toLowerCase().substring(2);
		if (value) {
			if (!old) node.addEventListener(name, eventProxy, useCapture);
		}
		else {
			node.removeEventListener(name, eventProxy, useCapture);
		}
		(node._listeners || (node._listeners = {}))[name] = value;
	}
	else if (name!=='list' && name!=='type' && name in node) {
		// Attempt to set a DOM property to the given value.
		// IE & FF throw for certain property-value combinations.
		try {
			node[name] = (value == null) ? '' : value;
		} catch (e) { }
		if ((value==null || value===false) && name!='spellcheck') node.removeAttribute(name);
	}
	else {
		let ns = (name !== (name = name.replace(/^xlink:?/, '')));
		// spellcheck is treated differently than all other boolean values and
		// should not be removed when the value is `false`. See:
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-spellcheck
		if (value==null || value===false) {
			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());
			else node.removeAttribute(name);
		}
		else if (typeof value!=='function') {
			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);
			else node.setAttribute(name, value);
		}
	}
}