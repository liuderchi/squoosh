import { initEmscriptenModule } from 'features/worker-utils';
import { threads, simd } from 'wasm-feature-detect';
let emscriptenModule;
async function init() {
    if (await threads()) {
        if (await simd()) {
            const jxlEncoder = await import('codecs/jxl/enc/jxl_enc_mt_simd');
            return initEmscriptenModule(jxlEncoder.default);
        }
        const jxlEncoder = await import('codecs/jxl/enc/jxl_enc_mt');
        return initEmscriptenModule(jxlEncoder.default);
    }
    const jxlEncoder = await import('codecs/jxl/enc/jxl_enc');
    return initEmscriptenModule(jxlEncoder.default);
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
