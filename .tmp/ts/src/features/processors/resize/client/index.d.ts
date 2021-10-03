import { Options as ResizeOptions } from '../shared/meta';
import type { SourceImage } from 'client/lazy-app/Compress';
import type WorkerBridge from 'client/lazy-app/worker-bridge';
import { h, Component } from 'preact';
export declare function resize(signal: AbortSignal, source: SourceImage, options: ResizeOptions, workerBridge: WorkerBridge): Promise<ImageData>;
interface Props {
    isVector: Boolean;
    inputWidth: number;
    inputHeight: number;
    options: ResizeOptions;
    onChange(newOptions: ResizeOptions): void;
}
interface State {
    maintainAspect: boolean;
}
export declare class Options extends Component<Props, State> {
    state: State;
    private form?;
    private presetWidths;
    private presetHeights;
    constructor(props: Props);
    private reportOptions;
    private onChange;
    private getAspect;
    componentDidUpdate(prevProps: Props, prevState: State): void;
    componentWillReceiveProps(nextProps: Props): void;
    private onWidthInput;
    private onHeightInput;
    private generatePresetValues;
    private getPreset;
    private onPresetChange;
    render({ options, isVector }: Props, { maintainAspect }: State): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map