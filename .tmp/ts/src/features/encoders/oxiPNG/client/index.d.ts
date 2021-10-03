import { EncodeOptions } from '../shared/meta';
import type WorkerBridge from 'client/lazy-app/worker-bridge';
import { h, Component } from 'preact';
export declare function encode(signal: AbortSignal, workerBridge: WorkerBridge, imageData: ImageData, options: EncodeOptions): Promise<ArrayBuffer>;
declare type Props = {
    options: EncodeOptions;
    onChange(newOptions: EncodeOptions): void;
};
export declare class Options extends Component<Props, {}> {
    onChange: (event: Event) => void;
    render({ options }: Props): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map