import { EncodeOptions } from '../shared/meta';
import type WorkerBridge from 'client/lazy-app/worker-bridge';
import { h, Component } from 'preact';
export declare function encode(signal: AbortSignal, workerBridge: WorkerBridge, imageData: ImageData, options: EncodeOptions): Promise<Promise<ArrayBuffer>>;
interface Props {
    options: EncodeOptions;
    onChange(newOptions: EncodeOptions): void;
}
interface State {
    showAdvanced: boolean;
}
export declare class Options extends Component<Props, State> {
    state: State;
    onChange: (event: Event) => void;
    render({ options }: Props, { showAdvanced }: State): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map