import { EncoderState, ProcessorState } from '../feature-meta';
interface CacheResult {
    processed: ImageData;
    data: ImageData;
    file: File;
}
interface CacheEntry extends CacheResult {
    processorState: ProcessorState;
    encoderState: EncoderState;
    preprocessed: ImageData;
}
export default class ResultCache {
    private readonly _entries;
    add(entry: CacheEntry): void;
    match(preprocessed: ImageData, processorState: ProcessorState, encoderState: EncoderState): CacheResult | undefined;
}
export {};
//# sourceMappingURL=result-cache.d.ts.map