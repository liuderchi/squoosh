import 'add-css:./styles.css';
declare const HTMLEl: {
    new (): HTMLElement;
    prototype: HTMLElement;
};
export interface SnackOptions {
    timeout?: number;
    actions?: string[];
}
export default class SnackBarElement extends HTMLEl {
    private _snackbars;
    private _processingQueue;
    /**
     * Show a snackbar. Returns a promise for the name of the action clicked, or an empty string if no
     * action is clicked.
     */
    showSnackbar(message: string, options?: SnackOptions): Promise<string>;
    private _processQueue;
}
export {};
//# sourceMappingURL=index.d.ts.map