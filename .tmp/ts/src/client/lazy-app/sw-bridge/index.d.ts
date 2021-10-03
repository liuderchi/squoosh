import type SnackBarElement from 'shared/custom-els/snack-bar';
/** Wait for a shared image */
export declare function getSharedImage(): Promise<File>;
/** Set up the service worker and monitor changes */
export declare function offliner(showSnack: SnackBarElement['showSnackbar']): Promise<void>;
/**
 * Tell the service worker the main app has loaded. If it's the first time the service worker has
 * heard about this, cache the heavier assets like codecs.
 */
export declare function mainAppLoaded(): Promise<void>;
//# sourceMappingURL=index.d.ts.map