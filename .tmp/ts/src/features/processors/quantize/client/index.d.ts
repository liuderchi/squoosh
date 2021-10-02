import { h, Component } from 'preact';
import { Options as QuantizeOptions } from '../shared/meta';
interface Props {
    options: QuantizeOptions;
    onChange(newOptions: QuantizeOptions): void;
}
interface State {
    extendedSettings: boolean;
}
export declare class Options extends Component<Props, State> {
    state: State;
    componentDidMount(): void;
    onChange: (event: Event) => void;
    render({ options }: Props, { extendedSettings }: State): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map