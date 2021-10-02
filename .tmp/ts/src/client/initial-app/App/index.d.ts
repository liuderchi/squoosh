import type SnackBarElement from 'shared/custom-els/snack-bar';
import { h, Component } from 'preact';
import 'add-css:./style.css';
import 'file-drop-element';
import 'shared/custom-els/snack-bar';
import 'shared/custom-els/loading-spinner';
interface Props {
}
interface State {
    awaitingShareTarget: boolean;
    file?: File;
    isEditorOpen: Boolean;
    Compress?: typeof import('client/lazy-app/Compress').default;
}
export default class App extends Component<Props, State> {
    state: State;
    snackbar?: SnackBarElement;
    constructor();
    private onFileDrop;
    private onIntroPickFile;
    private showSnack;
    private onPopState;
    private openEditor;
    render({}: Props, { file, isEditorOpen, Compress, awaitingShareTarget }: State): h.JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map