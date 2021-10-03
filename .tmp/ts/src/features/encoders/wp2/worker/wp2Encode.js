import { initEmscriptenModule } from 'features/worker-utils';
import { threads, simd } from 'wasm-feature-detect';
let emscriptenModule;
async function init() {
    if (await threads()) {
        if (await simd()) {
            const wp2Encoder = await import('codecs/wp2/enc/wp2_enc_mt_simd');
            return initEmscriptenModule(wp2Encoder.default);
        }
        const wp2Encoder = await import('codecs/wp2/enc/wp2_enc_mt');
        return initEmscriptenModule(wp2Encoder.default);
    }
    const wp2Encoder = await import('codecs/wp2/enc/wp2_enc');
    return initEmscriptenModule(wp2Encoder.default);
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
