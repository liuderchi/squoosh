import { h, Component } from 'preact';
import 'add-css:./style.css';
import 'shared/custom-els/loading-spinner';
import { SourceImage } from '../';
interface Props {
    loading: boolean;
    source?: SourceImage;
    imageFile?: File;
    downloadUrl?: string;
    flipSide: boolean;
    typeLabel: string;
}
interface State {
    showLoadingState: boolean;
}
export default class Results extends Component<Props, State> {
    state: State;
    /** The timeout ID between entering the loading state, and changing UI */
    private loadingTimeoutId;
    componentDidUpdate(prevProps: Props, prevState: State): void;
    private onDownload;
    render({ source, imageFile, downloadUrl, flipSide, typeLabel }: Props, { showLoadingState }: State): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map