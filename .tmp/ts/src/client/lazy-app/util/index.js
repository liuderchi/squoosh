/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as WebCodecs from '../util/web-codecs';
import { drawableToImageData } from './canvas';
/** If render engine is Safari */
export const isSafari = /Safari\//.test(navigator.userAgent) &&
    !/Chrom(e|ium)\//.test(navigator.userAgent);
/**
 * Compare two objects, returning a boolean indicating if
 * they have the same properties and strictly equal values.
 */
export function shallowEqual(one, two) {
    for (const i in one)
        if (one[i] !== two[i])
            return false;
    for (const i in two)
        if (!(i in one))
            return false;
    return true;
}
async function decodeImage(url) {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    const loaded = new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(Error('Image loading error'));
    });
    if (img.decode) {
        // Nice off-thread way supported in Safari/Chrome.
        // Safari throws on decode if the source is SVG.
        // https://bugs.webkit.org/show_bug.cgi?id=188347
        await img.decode().catch(() => null);
    }
    // Always await loaded, as we may have bailed due to the Safari bug above.
    await loaded;
    return img;
}
/** Caches results from canDecodeImageType */
const canDecodeCache = new Map();
/**
 * Tests whether the browser supports a particular image mime type.
 *
 * @param type Mimetype
 * @example await canDecodeImageType('image/avif')
 */
export function canDecodeImageType(type) {
    if (!canDecodeCache.has(type)) {
        const resultPromise = (async () => {
            const picture = document.createElement('picture');
            const img = document.createElement('img');
            const source = document.createElement('source');
            source.srcset = 'data:,x';
            source.type = type;
            picture.append(source, img);
            // Wait a single microtick just for the `img.currentSrc` to get populated.
            await 0;
            // At this point `img.currentSrc` will contain "data:,x" if format is supported and ""
            // otherwise.
            return !!img.currentSrc;
        })();
        canDecodeCache.set(type, resultPromise);
    }
    return canDecodeCache.get(type);
}
export function blobToArrayBuffer(blob) {
    return new Response(blob).arrayBuffer();
}
export function blobToText(blob) {
    return new Response(blob).text();
}
const magicNumberMapInput = [
    [/^%PDF-/, 'application/pdf'],
    [/^GIF87a/, 'image/gif'],
    [/^GIF89a/, 'image/gif'],
    [/^\x89PNG\x0D\x0A\x1A\x0A/, 'image/png'],
    [/^\xFF\xD8\xFF/, 'image/jpeg'],
    [/^BM/, 'image/bmp'],
    [/^I I/, 'image/tiff'],
    [/^II*/, 'image/tiff'],
    [/^MM\x00*/, 'image/tiff'],
    [/^RIFF....WEBPVP8[LX ]/s, 'image/webp'],
    [/^\xF4\xFF\x6F/, 'image/webp2'],
    [/^\x00\x00\x00 ftypavif\x00\x00\x00\x00/, 'image/avif'],
    [/^\xff\x0a/, 'image/jxl'],
    [/^\x00\x00\x00\x0cJXL \x0d\x0a\x87\x0a/, 'image/jxl'],
];
const magicNumberToMimeType = new Map(magicNumberMapInput);
export async function sniffMimeType(blob) {
    const firstChunk = await blobToArrayBuffer(blob.slice(0, 16));
    const firstChunkString = Array.from(new Uint8Array(firstChunk))
        .map((v) => String.fromCodePoint(v))
        .join('');
    for (const [detector, mimeType] of magicNumberToMimeType) {
        if (detector.test(firstChunkString)) {
            return mimeType;
        }
    }
    return '';
}
export async function blobToImg(blob) {
    const url = URL.createObjectURL(blob);
    try {
        return await decodeImage(url);
    }
    finally {
        URL.revokeObjectURL(url);
    }
}
export async function builtinDecode(signal, blob, mimeType) {
    // If WebCodecs are supported, use that.
    if (await WebCodecs.isTypeSupported(mimeType)) {
        assertSignal(signal);
        try {
            return await abortable(signal, WebCodecs.decode(blob, mimeType));
        }
        catch (e) { }
    }
    assertSignal(signal);
    // Prefer createImageBitmap as it's the off-thread option for Firefox.
    const drawable = await abortable(signal, 'createImageBitmap' in self ? createImageBitmap(blob) : blobToImg(blob));
    return drawableToImageData(drawable);
}
/**
 * @param field An HTMLInputElement, but the casting is done here to tidy up onChange.
 * @param defaultVal Value to return if 'field' doesn't exist.
 */
export function inputFieldValueAsNumber(field, defaultVal = 0) {
    if (!field)
        return defaultVal;
    return Number(inputFieldValue(field));
}
/**
 * @param field An HTMLInputElement, but the casting is done here to tidy up onChange.
 * @param defaultVal Value to return if 'field' doesn't exist.
 */
export function inputFieldCheckedAsNumber(field, defaultVal = 0) {
    if (!field)
        return defaultVal;
    return Number(inputFieldChecked(field));
}
/**
 * @param field An HTMLInputElement, but the casting is done here to tidy up onChange.
 * @param defaultVal Value to return if 'field' doesn't exist.
 */
export function inputFieldChecked(field, defaultVal = false) {
    if (!field)
        return defaultVal;
    return field.checked;
}
/**
 * @param field An HTMLInputElement, but the casting is done here to tidy up onChange.
 * @param defaultVal Value to return if 'field' doesn't exist.
 */
export function inputFieldValue(field, defaultVal = '') {
    if (!field)
        return defaultVal;
    return field.value;
}
/**
 * Creates a promise that resolves when the user types the konami code.
 */
export function konami() {
    return new Promise((resolve) => {
        // Keycodes for: ↑ ↑ ↓ ↓ ← → ← → B A
        const expectedPattern = '38384040373937396665';
        let rollingPattern = '';
        const listener = (event) => {
            rollingPattern += event.keyCode;
            rollingPattern = rollingPattern.slice(-expectedPattern.length);
            if (rollingPattern === expectedPattern) {
                window.removeEventListener('keydown', listener);
                resolve();
            }
        };
        window.addEventListener('keydown', listener);
    });
}
export async function transitionHeight(el, opts) {
    const { from = el.getBoundingClientRect().height, to = el.getBoundingClientRect().height, duration = 1000, easing = 'ease-in-out', } = opts;
    if (from === to || duration === 0) {
        el.style.height = to + 'px';
        return;
    }
    el.style.height = from + 'px';
    // Force a style calc so the browser picks up the start value.
    getComputedStyle(el).transform;
    el.style.transition = `height ${duration}ms ${easing}`;
    el.style.height = to + 'px';
    return new Promise((resolve) => {
        const listener = (event) => {
            if (event.target !== el)
                return;
            el.style.transition = '';
            el.removeEventListener('transitionend', listener);
            el.removeEventListener('transitioncancel', listener);
            resolve();
        };
        el.addEventListener('transitionend', listener);
        el.addEventListener('transitioncancel', listener);
    });
}
/**
 * Simple event listener that prevents the default.
 */
export function preventDefault(event) {
    event.preventDefault();
}
/**
 * Throw an abort error if a signal is aborted.
 */
export function assertSignal(signal) {
    if (signal.aborted)
        throw new DOMException('AbortError', 'AbortError');
}
/**
 * Take a signal and promise, and returns a promise that rejects with an AbortError if the abort is
 * signalled, otherwise resolves with the promise.
 */
export async function abortable(signal, promise) {
    assertSignal(signal);
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            signal.addEventListener('abort', () => reject(new DOMException('AbortError', 'AbortError')));
        }),
    ]);
}
