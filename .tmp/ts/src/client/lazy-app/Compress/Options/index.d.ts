import { h, Component } from 'preact';
import 'add-css:./style.css';
import type { SourceImage, OutputType } from '..';
import { EncoderOptions, EncoderState, ProcessorState, encoderMap } from '../../feature-meta';
interface Props {
    index: 0 | 1;
    mobileView: boolean;
    source?: SourceImage;
    encoderState?: EncoderState;
    processorState: ProcessorState;
    onEncoderTypeChange(index: 0 | 1, newType: OutputType): void;
    onEncoderOptionsChange(index: 0 | 1, newOptions: EncoderOptions): void;
    onProcessorOptionsChange(index: 0 | 1, newOptions: ProcessorState): void;
    onCopyToOtherSideClick(index: 0 | 1): void;
    onCopyCliClick(index: 0 | 1): void;
}
interface State {
    supportedEncoderMap?: PartialButNotUndefined<typeof encoderMap>;
}
declare type PartialButNotUndefined<T> = {
    [P in keyof T]: T[P];
};
export default class Options extends Component<Props, State> {
    state: State;
    constructor();
    private onEncoderTypeChange;
    private onProcessorEnabledChange;
    private onQuantizerOptionsChange;
    private onResizeOptionsChange;
    private onEncoderOptionsChange;
    private onCopyCliClick;
    private onCopyToOtherSideClick;
    render({ source, encoderState, processorState }: Props, { supportedEncoderMap }: State): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map