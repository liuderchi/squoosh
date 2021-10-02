import type avifDecode from '../../../features/decoders/avif/worker/avifDecode';
import type jxlDecode from '../../../features/decoders/jxl/worker/jxlDecode';
import type webpDecode from '../../../features/decoders/webp/worker/webpDecode';
import type wp2Decode from '../../../features/decoders/wp2/worker/wp2Decode';
import type avifEncode from '../../../features/encoders/avif/worker/avifEncode';
import type jxlEncode from '../../../features/encoders/jxl/worker/jxlEncode';
import type mozjpegEncode from '../../../features/encoders/mozJPEG/worker/mozjpegEncode';
import type oxipngEncode from '../../../features/encoders/oxiPNG/worker/oxipngEncode';
import type webpEncode from '../../../features/encoders/webP/worker/webpEncode';
import type wp2Encode from '../../../features/encoders/wp2/worker/wp2Encode';
import type rotate from '../../../features/preprocessors/rotate/worker/rotate';
import type quantize from '../../../features/processors/quantize/worker/quantize';
import type resize from '../../../features/processors/resize/worker/resize';
export declare const methodNames: readonly ["avifDecode", "jxlDecode", "webpDecode", "wp2Decode", "avifEncode", "jxlEncode", "mozjpegEncode", "oxipngEncode", "webpEncode", "wp2Encode", "rotate", "quantize", "resize"];
export interface BridgeMethods {
    avifDecode(signal: AbortSignal, ...args: Parameters<typeof avifDecode>): Promise<ReturnType<typeof avifDecode>>;
    jxlDecode(signal: AbortSignal, ...args: Parameters<typeof jxlDecode>): Promise<ReturnType<typeof jxlDecode>>;
    webpDecode(signal: AbortSignal, ...args: Parameters<typeof webpDecode>): Promise<ReturnType<typeof webpDecode>>;
    wp2Decode(signal: AbortSignal, ...args: Parameters<typeof wp2Decode>): Promise<ReturnType<typeof wp2Decode>>;
    avifEncode(signal: AbortSignal, ...args: Parameters<typeof avifEncode>): Promise<ReturnType<typeof avifEncode>>;
    jxlEncode(signal: AbortSignal, ...args: Parameters<typeof jxlEncode>): Promise<ReturnType<typeof jxlEncode>>;
    mozjpegEncode(signal: AbortSignal, ...args: Parameters<typeof mozjpegEncode>): Promise<ReturnType<typeof mozjpegEncode>>;
    oxipngEncode(signal: AbortSignal, ...args: Parameters<typeof oxipngEncode>): Promise<ReturnType<typeof oxipngEncode>>;
    webpEncode(signal: AbortSignal, ...args: Parameters<typeof webpEncode>): Promise<ReturnType<typeof webpEncode>>;
    wp2Encode(signal: AbortSignal, ...args: Parameters<typeof wp2Encode>): Promise<ReturnType<typeof wp2Encode>>;
    rotate(signal: AbortSignal, ...args: Parameters<typeof rotate>): Promise<ReturnType<typeof rotate>>;
    quantize(signal: AbortSignal, ...args: Parameters<typeof quantize>): Promise<ReturnType<typeof quantize>>;
    resize(signal: AbortSignal, ...args: Parameters<typeof resize>): Promise<ReturnType<typeof resize>>;
}
//# sourceMappingURL=meta.d.ts.map