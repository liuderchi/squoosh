import { h, Component, ComponentChildren } from 'preact';
import 'add-css:./style.css';
interface Props {
    children: ComponentChildren;
}
interface State {
    children: ComponentChildren;
    outgoingChildren: ComponentChildren;
}
export default class Expander extends Component<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null;
    componentDidUpdate(_: Props, previousState: State): Promise<void>;
    render({}: Props, { children, outgoingChildren }: State): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map