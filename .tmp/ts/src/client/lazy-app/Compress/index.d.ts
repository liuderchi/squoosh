import { h, Component } from 'preact';
import 'add-css:./style.css';
import { PreprocessorState, ProcessorState, EncoderState, EncoderType } from '../feature-meta';
import './custom-els/MultiPanel';
import type SnackBarElement from 'shared/custom-els/snack-bar';
export declare type OutputType = EncoderType | 'identity';
export interface SourceImage {
    file: File;
    decoded: ImageData;
    preprocessed: ImageData;
    vectorImage?: HTMLImageElement;
}
interface SideSettings {
    processorState: ProcessorState;
    encoderState?: EncoderState;
}
interface Side {
    processed?: ImageData;
    file?: File;
    downloadUrl?: string;
    data?: ImageData;
    latestSettings: SideSettings;
    encodedSettings?: SideSettings;
    loading: boolean;
}
interface Props {
    file: File;
    showSnack: SnackBarElement['showSnackbar'];
    onBack: () => void;
}
interface State {
    source?: SourceImage;
    sides: [Side, Side];
    /** Source image load */
    loading: boolean;
    mobileView: boolean;
    preprocessorState: PreprocessorState;
    encodedPreprocessorState?: PreprocessorState;
}
export default class Compress extends Component<Props, State> {
    widthQuery: MediaQueryList;
    state: State;
    private readonly encodeCache;
    private readonly workerBridges;
    /** Abort controller for actions that impact both sites, like source image decoding and preprocessing */
    private mainAbortController;
    private sideAbortControllers;
    /** For debouncing calls to updateImage for each side. */
    private updateImageTimeout?;
    constructor(props: Props);
    private onMobileWidthChange;
    private onEncoderTypeChange;
    private onProcessorOptionsChange;
    private onEncoderOptionsChange;
    componentWillReceiveProps(nextProps: Props): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: Props, prevState: State): void;
    private onCopyToOtherClick;
    private onPreprocessorChange;
    private onCopyCliClick;
    /**
     * Debounce the heavy lifting of updateImage.
     * Otherwise, the thrashing causes jank, and sometimes crashes iOS Safari.
     */
    private queueUpdateImage;
    private sourceFile;
    /** The in-progress job for decoding and preprocessing */
    private activeMainJob?;
    /** The in-progress job for each side (processing and encoding) */
    private activeSideJobs;
    /**
     * Perform image processing.
     *
     * This function is a monster, but I didn't want to break it up, because it
     * never gets partially called. Instead, it looks at the current state, and
     * decides which steps can be skipped, and which can be cached.
     */
    private updateImage;
    render({ onBack }: Props, { loading, sides, source, mobileView, preprocessorState }: State): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map