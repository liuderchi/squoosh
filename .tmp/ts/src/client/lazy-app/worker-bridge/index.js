import { wrap } from 'comlink';
import { methodNames } from './meta';
import workerURL from 'omt:../../../features-worker';
import { abortable } from '../util';
/** How long the worker should be idle before terminating. */
const workerTimeout = 10000;
class WorkerBridge {
    constructor() {
        this._queue = Promise.resolve();
    }
    _terminateWorker() {
        if (!this._worker)
            return;
        this._worker.terminate();
        this._worker = undefined;
        this._workerApi = undefined;
    }
    _startWorker() {
        this._worker = new Worker(workerURL);
        this._workerApi = wrap(this._worker);
    }
}
for (const methodName of methodNames) {
    WorkerBridge.prototype[methodName] = function (signal, ...args) {
        this._queue = this._queue
            // Ignore any errors in the queue
            .catch(() => { })
            .then(async () => {
            if (signal.aborted)
                throw new DOMException('AbortError', 'AbortError');
            clearTimeout(this._workerTimeout);
            if (!this._worker)
                this._startWorker();
            const onAbort = () => this._terminateWorker();
            signal.addEventListener('abort', onAbort);
            return abortable(signal, 
            // @ts-ignore - TypeScript can't figure this out
            this._workerApi[methodName](...args)).finally(() => {
                // No longer care about aborting - this task is complete.
                signal.removeEventListener('abort', onAbort);
                // Start a timer to clear up the worker.
                this._workerTimeout = setTimeout(() => {
                    this._terminateWorker();
                }, workerTimeout);
            });
        });
        return this._queue;
    };
}
export default WorkerBridge;
