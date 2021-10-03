import { h, Component } from 'preact';
import '../../custom-els/loading-spinner';
import type SnackBarElement from 'shared/custom-els/snack-bar';
import 'shared/custom-els/snack-bar';
interface Props {
    onFile?: (file: File) => void;
    showSnack?: SnackBarElement['showSnackbar'];
}
interface State {
    fetchingDemoIndex?: number;
    beforeInstallEvent?: BeforeInstallPromptEvent;
    showBlobSVG: boolean;
}
export default class Intro extends Component<Props, State> {
    state: State;
    private fileInput?;
    private blobCanvas?;
    private installingViaButton;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private onFileChange;
    private onOpenClick;
    private onDemoClick;
    private onBeforeInstallPromptEvent;
    private onInstallClick;
    private onAppInstalled;
    private onPasteClick;
    render({}: Props, { fetchingDemoIndex, beforeInstallEvent, showBlobSVG }: State): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map