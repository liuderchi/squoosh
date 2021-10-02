import { VNode } from 'preact';
export declare function renderPage(vnode: VNode): string;
interface OutputMap {
    [path: string]: string;
}
export declare function writeFiles(toOutput: OutputMap): void;
/**
 * Escape a string for insertion in a style or script tag
 */
export declare function escapeStyleScriptContent(str: string): string;
/**
 * Origin of the site, depending on the environment.
 */
export declare const siteOrigin: string;
export {};
//# sourceMappingURL=utils.d.ts.map