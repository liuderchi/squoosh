import { EncodeOptions, AVIFTune } from '../shared/meta';
import type WorkerBridge from 'client/lazy-app/worker-bridge';
import { h, Component } from 'preact';
export declare const encode: (signal: AbortSignal, workerBridge: WorkerBridge, imageData: ImageData, options: EncodeOptions) => Promise<Promise<ArrayBuffer>>;
interface Props {
    options: EncodeOptions;
    onChange(newOptions: EncodeOptions): void;
}
interface State {
    options: EncodeOptions;
    lossless: boolean;
    quality: number;
    showAdvanced: boolean;
    separateAlpha: boolean;
    alphaQuality: number;
    chromaDeltaQ: boolean;
    subsample: number;
    tileRows: number;
    tileCols: number;
    effort: number;
    sharpness: number;
    denoiseLevel: number;
    aqMode: number;
    tune: AVIFTune;
}
export declare class Options extends Component<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null;
    state: State;
    private _inputChangeCallbacks;
    private _inputChange;
    render(_: Props, { effort, lossless, alphaQuality, separateAlpha, quality, showAdvanced, subsample, tileCols, tileRows, chromaDeltaQ, sharpness, denoiseLevel, tune, }: State): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map