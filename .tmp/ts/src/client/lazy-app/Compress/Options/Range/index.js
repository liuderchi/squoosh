import { h, Component } from 'preact';
import * as style from './style.css';
import 'add-css:./style.css';
import './custom-els/RangeInput';
import { linkRef } from 'shared/prerendered-app/util';
export default class Range extends Component {
    constructor() {
        super(...arguments);
        this.onTextInput = (event) => {
            const input = event.target;
            const value = input.value.trim();
            if (!value)
                return;
            this.rangeWc.value = input.value;
            this.rangeWc.dispatchEvent(new InputEvent('input', {
                bubbles: event.bubbles,
            }));
        };
        this.onTextFocus = () => {
            this.setState({ textFocused: true });
        };
        this.onTextBlur = () => {
            this.setState({ textFocused: false });
        };
    }
    render(props, state) {
        const { children, ...otherProps } = props;
        const { value, min, max, step } = props;
        const textValue = state.textFocused ? this.inputEl.value : value;
        return (h("label", { class: style.range },
            h("span", { class: style.labelText }, children),
            h("div", { class: style.rangeWcContainer },
                h("range-input", Object.assign({ ref: linkRef(this, 'rangeWc'), class: style.rangeWc }, otherProps))),
            h("input", { ref: linkRef(this, 'inputEl'), type: "number", class: style.textInput, value: textValue, min: min, max: max, step: step, onInput: this.onTextInput, onFocus: this.onTextFocus, onBlur: this.onTextBlur })));
    }
}
