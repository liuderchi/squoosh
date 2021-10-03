import * as avifEncoderMeta from '../../../features/encoders/avif/shared/meta';
import * as browserGIFEncoderMeta from '../../../features/encoders/browserGIF/shared/meta';
import * as browserJPEGEncoderMeta from '../../../features/encoders/browserJPEG/shared/meta';
import * as browserPNGEncoderMeta from '../../../features/encoders/browserPNG/shared/meta';
import * as jxlEncoderMeta from '../../../features/encoders/jxl/shared/meta';
import * as mozJPEGEncoderMeta from '../../../features/encoders/mozJPEG/shared/meta';
import * as oxiPNGEncoderMeta from '../../../features/encoders/oxiPNG/shared/meta';
import * as webPEncoderMeta from '../../../features/encoders/webP/shared/meta';
import * as wp2EncoderMeta from '../../../features/encoders/wp2/shared/meta';
import * as avifEncoderEntry from '../../../features/encoders/avif/client';
import * as jxlEncoderEntry from '../../../features/encoders/jxl/client';
import * as mozJPEGEncoderEntry from '../../../features/encoders/mozJPEG/client';
import * as oxiPNGEncoderEntry from '../../../features/encoders/oxiPNG/client';
import * as webPEncoderEntry from '../../../features/encoders/webP/client';
import * as wp2EncoderEntry from '../../../features/encoders/wp2/client';
export declare type EncoderState = {
    type: "avif";
    options: avifEncoderMeta.EncodeOptions;
} | {
    type: "browserGIF";
    options: browserGIFEncoderMeta.EncodeOptions;
} | {
    type: "browserJPEG";
    options: browserJPEGEncoderMeta.EncodeOptions;
} | {
    type: "browserPNG";
    options: browserPNGEncoderMeta.EncodeOptions;
} | {
    type: "jxl";
    options: jxlEncoderMeta.EncodeOptions;
} | {
    type: "mozJPEG";
    options: mozJPEGEncoderMeta.EncodeOptions;
} | {
    type: "oxiPNG";
    options: oxiPNGEncoderMeta.EncodeOptions;
} | {
    type: "webP";
    options: webPEncoderMeta.EncodeOptions;
} | {
    type: "wp2";
    options: wp2EncoderMeta.EncodeOptions;
};
export declare type EncoderOptions = avifEncoderMeta.EncodeOptions | browserGIFEncoderMeta.EncodeOptions | browserJPEGEncoderMeta.EncodeOptions | browserPNGEncoderMeta.EncodeOptions | jxlEncoderMeta.EncodeOptions | mozJPEGEncoderMeta.EncodeOptions | oxiPNGEncoderMeta.EncodeOptions | webPEncoderMeta.EncodeOptions | wp2EncoderMeta.EncodeOptions;
export declare const encoderMap: {
    avif: {
        encode: (signal: AbortSignal, workerBridge: import("../worker-bridge").default, imageData: ImageData, options: avifEncoderMeta.EncodeOptions) => Promise<Promise<ArrayBuffer>>;
        Options: typeof avifEncoderEntry.Options;
        meta: typeof avifEncoderMeta;
    };
    browserGIF: {
        featureTest: () => Promise<boolean>;
        encode: (signal: AbortSignal, workerBridge: import("../worker-bridge").default, imageData: ImageData, options: browserGIFEncoderMeta.EncodeOptions) => Promise<Blob>;
        meta: typeof browserGIFEncoderMeta;
    };
    browserJPEG: {
        encode: (signal: AbortSignal, workerBridge: import("../worker-bridge").default, imageData: ImageData, options: browserJPEGEncoderMeta.EncodeOptions) => Promise<Blob>;
        Options: new (...args: any[]) => import("../../../features/client-utils").QualityOptionsInterface;
        meta: typeof browserJPEGEncoderMeta;
    };
    browserPNG: {
        encode: (signal: AbortSignal, workerBridge: import("../worker-bridge").default, imageData: ImageData, options: browserPNGEncoderMeta.EncodeOptions) => Promise<Blob>;
        meta: typeof browserPNGEncoderMeta;
    };
    jxl: {
        encode: (signal: AbortSignal, workerBridge: import("../worker-bridge").default, imageData: ImageData, options: jxlEncoderMeta.EncodeOptions) => Promise<Promise<ArrayBuffer>>;
        Options: typeof jxlEncoderEntry.Options;
        meta: typeof jxlEncoderMeta;
    };
    mozJPEG: {
        encode(signal: AbortSignal, workerBridge: import("../worker-bridge").default, imageData: ImageData, options: mozJPEGEncoderMeta.EncodeOptions): Promise<Promise<ArrayBuffer>>;
        Options: typeof mozJPEGEncoderEntry.Options;
        meta: typeof mozJPEGEncoderMeta;
    };
    oxiPNG: {
        encode(signal: AbortSignal, workerBridge: import("../worker-bridge").default, imageData: ImageData, options: oxiPNGEncoderMeta.EncodeOptions): Promise<ArrayBuffer>;
        Options: typeof oxiPNGEncoderEntry.Options;
        meta: typeof oxiPNGEncoderMeta;
    };
    webP: {
        encode: (signal: AbortSignal, workerBridge: import("../worker-bridge").default, imageData: ImageData, options: webPEncoderMeta.EncodeOptions) => Promise<Promise<ArrayBuffer>>;
        Options: typeof webPEncoderEntry.Options;
        meta: typeof webPEncoderMeta;
    };
    wp2: {
        encode: (signal: AbortSignal, workerBridge: import("../worker-bridge").default, imageData: ImageData, options: wp2EncoderMeta.EncodeOptions) => Promise<Promise<ArrayBuffer>>;
        Options: typeof wp2EncoderEntry.Options;
        meta: typeof wp2EncoderMeta;
    };
};
export declare type EncoderType = keyof typeof encoderMap;
import * as quantizeProcessorMeta from '../../../features/processors/quantize/shared/meta';
import * as resizeProcessorMeta from '../../../features/processors/resize/shared/meta';
interface Enableable {
    enabled: boolean;
}
export interface ProcessorOptions {
    quantize: quantizeProcessorMeta.Options;
    resize: resizeProcessorMeta.Options;
}
export interface ProcessorState {
    quantize: Enableable & quantizeProcessorMeta.Options;
    resize: Enableable & resizeProcessorMeta.Options;
}
export declare const defaultProcessorState: ProcessorState;
import * as rotatePreprocessorMeta from '../../../features/preprocessors/rotate/shared/meta';
export interface PreprocessorState {
    rotate: rotatePreprocessorMeta.Options;
}
export declare const defaultPreprocessorState: PreprocessorState;
export {};
//# sourceMappingURL=index.d.ts.map