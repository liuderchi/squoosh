import { h, Component } from 'preact';
import 'add-css:./style.css';
import RangeInputElement from './custom-els/RangeInput';
import './custom-els/RangeInput';
interface Props extends preact.JSX.HTMLAttributes {
}
interface State {
    textFocused: boolean;
}
export default class Range extends Component<Props, State> {
    rangeWc?: RangeInputElement;
    inputEl?: HTMLInputElement;
    private onTextInput;
    private onTextFocus;
    private onTextBlur;
    render(props: Props, state: State): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map