import { EncodeOptions } from '../shared/meta';
import type WorkerBridge from 'client/lazy-app/worker-bridge';
import { h, Component } from 'preact';
export declare const encode: (signal: AbortSignal, workerBridge: WorkerBridge, imageData: ImageData, options: EncodeOptions) => Promise<Promise<ArrayBuffer>>;
interface Props {
    options: EncodeOptions;
    onChange(newOptions: EncodeOptions): void;
}
interface State {
    options: EncodeOptions;
    effort: number;
    quality: number;
    alphaQuality: number;
    passes: number;
    sns: number;
    uvMode: number;
    lossless: boolean;
    slightLoss: number;
    colorSpace: number;
    errorDiffusion: number;
    useRandomMatrix: boolean;
    showAdvanced: boolean;
    separateAlpha: boolean;
}
export declare class Options extends Component<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null;
    state: State;
    private _inputChangeCallbacks;
    private _inputChange;
    render({}: Props, { effort, alphaQuality, passes, quality, sns, uvMode, lossless, slightLoss, colorSpace, errorDiffusion, useRandomMatrix, separateAlpha, showAdvanced, }: State): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map