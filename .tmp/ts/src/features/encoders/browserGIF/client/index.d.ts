import WorkerBridge from 'client/lazy-app/worker-bridge';
import { EncodeOptions } from '../shared/meta';
export declare const featureTest: () => Promise<boolean>;
export declare const encode: (signal: AbortSignal, workerBridge: WorkerBridge, imageData: ImageData, options: EncodeOptions) => Promise<Blob>;
//# sourceMappingURL=index.d.ts.map