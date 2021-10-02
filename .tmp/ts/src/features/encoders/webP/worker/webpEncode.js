import { initEmscriptenModule } from 'features/worker-utils';
import { simd } from 'wasm-feature-detect';
let emscriptenModule;
async function init() {
    if (await simd()) {
        const webpEncoder = await import('codecs/webp/enc/webp_enc_simd');
        return initEmscriptenModule(webpEncoder.default);
    }
    const webpEncoder = await import('codecs/webp/enc/webp_enc');
    return initEmscriptenModule(webpEncoder.default);
}
export default async function encode(data, options) {
    if (!emscriptenModule)
        emscriptenModule = init();
    const module = await emscriptenModule;
    const result = module.encode(data.data, data.width, data.height, options);
    if (!result)
        throw new Error('Encoding error.');
    return result.buffer;
}
