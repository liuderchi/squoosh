/** Replace the contents of a canvas with the given data */
export declare function drawDataToCanvas(canvas: HTMLCanvasElement, data: ImageData): void;
/**
 * Encode some image data in a given format using the browser's encoders
 *
 * @param {ImageData} data
 * @param {string} type A mime type, eg image/jpeg.
 * @param {number} [quality] Between 0-1.
 */
export declare function canvasEncode(data: ImageData, type: string, quality?: number): Promise<Blob>;
interface DrawableToImageDataOptions {
    width?: number;
    height?: number;
    sx?: number;
    sy?: number;
    sw?: number;
    sh?: number;
}
export declare function drawableToImageData(drawable: ImageBitmap | HTMLImageElement | VideoFrame, opts?: DrawableToImageDataOptions): ImageData;
export declare type BuiltinResizeMethod = 'pixelated' | 'low' | 'medium' | 'high';
export declare function builtinResize(data: ImageData, sx: number, sy: number, sw: number, sh: number, dw: number, dh: number, method: BuiltinResizeMethod): ImageData;
/**
 * Test whether <canvas> can encode to a particular type.
 */
export declare function canvasEncodeTest(mimeType: string): Promise<boolean>;
export {};
//# sourceMappingURL=canvas.d.ts.map