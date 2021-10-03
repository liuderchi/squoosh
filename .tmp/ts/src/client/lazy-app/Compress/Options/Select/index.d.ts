import { h, Component } from 'preact';
import 'add-css:./style.css';
interface Props extends preact.JSX.HTMLAttributes {
    large?: boolean;
}
interface State {
}
export default class Select extends Component<Props, State> {
    render(props: Props): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map