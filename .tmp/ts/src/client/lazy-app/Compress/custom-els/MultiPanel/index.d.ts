import 'add-css:./styles.css';
/**
 * A multi-panel view that the user can add any number of 'panels'.
 * 'a panel' consists of two elements. Even index element becomes heading,
 * and odd index element becomes the expandable content.
 */
export default class MultiPanel extends HTMLElement {
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    private _onClick;
    private _onKeyDown;
    private _toggle;
    private _closeAll;
    private _childrenChange;
    private _prevHeading;
    private _nextHeading;
    private _firstHeading;
    private _lastHeading;
    /**
     * If true, only one panel can be open at once. When one opens, others close.
     */
    get openOneOnly(): boolean;
    set openOneOnly(val: boolean);
}
//# sourceMappingURL=index.d.ts.map