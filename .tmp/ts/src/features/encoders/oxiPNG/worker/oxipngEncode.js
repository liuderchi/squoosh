import { threads } from 'wasm-feature-detect';
async function initMT() {
    const { default: init, initThreadPool, optimise } = await import('codecs/oxipng/pkg-parallel/squoosh_oxipng');
    await init();
    await initThreadPool(navigator.hardwareConcurrency);
    return optimise;
}
async function initST() {
    const { default: init, optimise } = await import('codecs/oxipng/pkg/squoosh_oxipng');
    await init();
    return optimise;
}
let wasmReady;
export default async function encode(data, options) {
    if (!wasmReady) {
        wasmReady = threads().then((hasThreads) => hasThreads ? initMT() : initST());
    }
    const optimise = await wasmReady;
    return optimise(new Uint8Array(data), options.level, options.interlace)
        .buffer;
}
