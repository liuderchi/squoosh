import * as style from './styles.css';
import 'add-css:./styles.css';
// So it doesn't cause an error when running in node
const HTMLEl = (__PRERENDER__
    ? Object
    : HTMLElement);
function createSnack(message, options) {
    const { timeout = 0, actions = ['dismiss'] } = options;
    const el = document.createElement('div');
    el.className = style.snackbar;
    el.setAttribute('aria-live', 'assertive');
    el.setAttribute('aria-atomic', 'true');
    el.setAttribute('aria-hidden', 'false');
    const text = document.createElement('div');
    text.className = style.text;
    text.textContent = message;
    el.appendChild(text);
    const result = new Promise((resolve) => {
        let timeoutId;
        // Add action buttons
        for (const action of actions) {
            const button = document.createElement('button');
            button.className = style.button;
            button.textContent = action;
            button.addEventListener('click', () => {
                clearTimeout(timeoutId);
                resolve(action);
            });
            el.appendChild(button);
        }
        // Add timeout
        if (timeout) {
            timeoutId = self.setTimeout(() => resolve(''), timeout);
        }
    });
    return [el, result];
}
export default class SnackBarElement extends HTMLEl {
    constructor() {
        super(...arguments);
        this._snackbars = [];
        this._processingQueue = false;
    }
    /**
     * Show a snackbar. Returns a promise for the name of the action clicked, or an empty string if no
     * action is clicked.
     */
    showSnackbar(message, options = {}) {
        return new Promise((resolve) => {
            this._snackbars.push([message, options, resolve]);
            if (!this._processingQueue)
                this._processQueue();
        });
    }
    async _processQueue() {
        this._processingQueue = true;
        while (this._snackbars[0]) {
            const [message, options, resolver] = this._snackbars[0];
            const [el, result] = createSnack(message, options);
            // Pass the result back to the original showSnackbar call.
            resolver(result);
            this.appendChild(el);
            // Wait for the user to click an action, or for the snack to timeout.
            await result;
            // Transition the snack away.
            el.setAttribute('aria-hidden', 'true');
            await new Promise((resolve) => {
                el.addEventListener('animationend', () => resolve());
            });
            el.remove();
            this._snackbars.shift();
        }
        this._processingQueue = false;
    }
}
if (!__PRERENDER__)
    customElements.define('snack-bar', SnackBarElement);
