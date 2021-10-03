import { initEmscriptenModule, blobToArrayBuffer } from 'features/worker-utils';
let emscriptenModule;
export default async function decode(blob) {
    if (!emscriptenModule) {
        const decoder = await import('codecs/webp/dec/webp_dec');
        emscriptenModule = initEmscriptenModule(decoder.default);
    }
    const [module, data] = await Promise.all([
        emscriptenModule,
        blobToArrayBuffer(blob),
    ]);
    const result = module.decode(data);
    if (!result)
        throw new Error('Decoding error');
    return result;
}
