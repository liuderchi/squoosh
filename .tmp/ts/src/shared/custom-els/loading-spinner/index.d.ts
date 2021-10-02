import 'add-css:./styles.css';
declare const HTMLEl: {
    new (): HTMLElement;
    prototype: HTMLElement;
};
/**
 * A simple spinner. This custom element has no JS API. Just put it in the document, and it'll
 * spin. You can configure the following using CSS custom properties:
 *
 * --size: Size of the spinner element (it's always square). Default: 28px.
 * --color: Color of the spinner. Default: #4285f4.
 * --stroke-width: Width of the stroke of the spinner. Default: 3px.
 * --delay: Once the spinner enters the DOM, how long until it shows. This prevents the spinner
 *          appearing on the screen for short operations. Default: 300ms.
 */
export default class LoadingSpinner extends HTMLEl {
    private _delayTimeout;
    disconnectedCallback(): void;
    connectedCallback(): void;
}
export {};
//# sourceMappingURL=index.d.ts.map