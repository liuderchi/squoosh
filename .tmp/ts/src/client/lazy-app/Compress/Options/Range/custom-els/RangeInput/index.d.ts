import 'add-css:./style.css';
declare class RangeInputElement extends HTMLElement {
    private _input;
    private _valueDisplay?;
    private _ignoreChange;
    static get observedAttributes(): string[];
    constructor();
    connectedCallback(): void;
    get labelPrecision(): string;
    set labelPrecision(precision: string);
    attributeChangedCallback(name: string, oldValue: string, newValue: string | null): void;
    private _retargetEvent;
    private _getDisplayValue;
    private _update;
    private _reflectAttributes;
}
interface RangeInputElement {
    name: string;
    min: string;
    max: string;
    step: string;
    value: string;
    disabled: boolean;
}
export default RangeInputElement;
//# sourceMappingURL=index.d.ts.map