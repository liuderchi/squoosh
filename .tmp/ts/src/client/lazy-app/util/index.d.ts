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
/** If render engine is Safari */
export declare const isSafari: boolean;
/**
 * Compare two objects, returning a boolean indicating if
 * they have the same properties and strictly equal values.
 */
export declare function shallowEqual(one: any, two: any): boolean;
/**
 * Tests whether the browser supports a particular image mime type.
 *
 * @param type Mimetype
 * @example await canDecodeImageType('image/avif')
 */
export declare function canDecodeImageType(type: string): Promise<boolean>;
export declare function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer>;
export declare function blobToText(blob: Blob): Promise<string>;
declare const magicNumberMapInput: readonly [readonly [RegExp, "application/pdf"], readonly [RegExp, "image/gif"], readonly [RegExp, "image/gif"], readonly [RegExp, "image/png"], readonly [RegExp, "image/jpeg"], readonly [RegExp, "image/bmp"], readonly [RegExp, "image/tiff"], readonly [RegExp, "image/tiff"], readonly [RegExp, "image/tiff"], readonly [RegExp, "image/webp"], readonly [RegExp, "image/webp2"], readonly [RegExp, "image/avif"], readonly [RegExp, "image/jxl"], readonly [RegExp, "image/jxl"]];
export declare type ImageMimeTypes = typeof magicNumberMapInput[number][1];
export declare function sniffMimeType(blob: Blob): Promise<ImageMimeTypes | ''>;
export declare function blobToImg(blob: Blob): Promise<HTMLImageElement>;
export declare function builtinDecode(signal: AbortSignal, blob: Blob, mimeType: string): Promise<ImageData>;
/**
 * @param field An HTMLInputElement, but the casting is done here to tidy up onChange.
 * @param defaultVal Value to return if 'field' doesn't exist.
 */
export declare function inputFieldValueAsNumber(field: any, defaultVal?: number): number;
/**
 * @param field An HTMLInputElement, but the casting is done here to tidy up onChange.
 * @param defaultVal Value to return if 'field' doesn't exist.
 */
export declare function inputFieldCheckedAsNumber(field: any, defaultVal?: number): number;
/**
 * @param field An HTMLInputElement, but the casting is done here to tidy up onChange.
 * @param defaultVal Value to return if 'field' doesn't exist.
 */
export declare function inputFieldChecked(field: any, defaultVal?: boolean): boolean;
/**
 * @param field An HTMLInputElement, but the casting is done here to tidy up onChange.
 * @param defaultVal Value to return if 'field' doesn't exist.
 */
export declare function inputFieldValue(field: any, defaultVal?: string): string;
/**
 * Creates a promise that resolves when the user types the konami code.
 */
export declare function konami(): Promise<void>;
interface TransitionOptions {
    from?: number;
    to?: number;
    duration?: number;
    easing?: string;
}
export declare function transitionHeight(el: HTMLElement, opts: TransitionOptions): Promise<void>;
/**
 * Simple event listener that prevents the default.
 */
export declare function preventDefault(event: Event): void;
/**
 * Throw an abort error if a signal is aborted.
 */
export declare function assertSignal(signal: AbortSignal): void;
/**
 * Take a signal and promise, and returns a promise that rejects with an AbortError if the abort is
 * signalled, otherwise resolves with the promise.
 */
export declare function abortable<T>(signal: AbortSignal, promise: Promise<T>): Promise<T>;
export {};
//# sourceMappingURL=index.d.ts.map