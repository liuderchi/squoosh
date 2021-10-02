'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/** Creates a function ref that assigns its value to a given property of an object.
 *  @example
 *  // element is stored as `this.foo` when rendered.
 *  <div ref={linkRef(this, 'foo')} />
 */
function linkRef(obj, name) {
    const refName = `$$ref_${name}`;
    let ref = obj[refName];
    if (!ref) {
        ref = obj[refName] = (c) => {
            obj[name] = c;
        };
    }
    return ref;
}

exports.linkRef = linkRef;
