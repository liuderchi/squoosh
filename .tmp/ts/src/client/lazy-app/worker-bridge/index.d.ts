import { BridgeMethods } from './meta';
import type { ProcessorWorkerApi } from '../../../features-worker';
interface WorkerBridge extends BridgeMethods {
}
declare class WorkerBridge {
    protected _queue: Promise<unknown>;
    /** Worker instance associated with this processor. */
    protected _worker?: Worker;
    /** Comlinked worker API. */
    protected _workerApi?: ProcessorWorkerApi;
    /** ID from setTimeout */
    protected _workerTimeout?: number;
    protected _terminateWorker(): void;
    protected _startWorker(): void;
}
export default WorkerBridge;
//# sourceMappingURL=index.d.ts.map