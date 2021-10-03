/** Replace the contents of a canvas with the given data */
export function drawDataToCanvas(canvas, data) {
    const ctx = canvas.getContext('2d');
    if (!ctx)
        throw Error('Canvas not initialized');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(data, 0, 0);
}
/**
 * Encode some image data in a given format using the browser's encoders
 *
 * @param {ImageData} data
 * @param {string} type A mime type, eg image/jpeg.
 * @param {number} [quality] Between 0-1.
 */
export async function canvasEncode(data, type, quality) {
    const canvas = document.createElement('canvas');
    canvas.width = data.width;
    canvas.height = data.height;
    const ctx = canvas.getContext('2d');
    if (!ctx)
        throw Error('Canvas not initialized');
    ctx.putImageData(data, 0, 0);
    let blob;
    if ('toBlob' in canvas) {
        blob = await new Promise((r) => canvas.toBlob(r, type, quality));
    }
    else {
        // Welcome to Edge.
        // TypeScript thinks `canvas` is 'never', so it needs casting.
        const dataUrl = canvas.toDataURL(type, quality);
        const result = /data:([^;]+);base64,(.*)$/.exec(dataUrl);
        if (!result)
            throw Error('Data URL reading failed');
        const outputType = result[1];
        const binaryStr = atob(result[2]);
        const data = new Uint8Array(binaryStr.length);
        for (let i = 0; i < data.length; i += 1) {
            data[i] = binaryStr.charCodeAt(i);
        }
        blob = new Blob([data], { type: outputType });
    }
    if (!blob)
        throw Error('Encoding failed');
    return blob;
}
function getWidth(drawable) {
    if ('displayWidth' in drawable) {
        return drawable.displayWidth;
    }
    return drawable.width;
}
function getHeight(drawable) {
    if ('displayHeight' in drawable) {
        return drawable.displayHeight;
    }
    return drawable.height;
}
export function drawableToImageData(drawable, opts = {}) {
    const { width = getWidth(drawable), height = getHeight(drawable), sx = 0, sy = 0, sw = getWidth(drawable), sh = getHeight(drawable), } = opts;
    // Make canvas same size as image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    // Draw image onto canvas
    const ctx = canvas.getContext('2d');
    if (!ctx)
        throw new Error('Could not create canvas context');
    ctx.drawImage(drawable, sx, sy, sw, sh, 0, 0, width, height);
    return ctx.getImageData(0, 0, width, height);
}
export function builtinResize(data, sx, sy, sw, sh, dw, dh, method) {
    const canvasSource = document.createElement('canvas');
    canvasSource.width = data.width;
    canvasSource.height = data.height;
    drawDataToCanvas(canvasSource, data);
    const canvasDest = document.createElement('canvas');
    canvasDest.width = dw;
    canvasDest.height = dh;
    const ctx = canvasDest.getContext('2d');
    if (!ctx)
        throw new Error('Could not create canvas context');
    if (method === 'pixelated') {
        ctx.imageSmoothingEnabled = false;
    }
    else {
        ctx.imageSmoothingQuality = method;
    }
    ctx.drawImage(canvasSource, sx, sy, sw, sh, 0, 0, dw, dh);
    return ctx.getImageData(0, 0, dw, dh);
}
/**
 * Test whether <canvas> can encode to a particular type.
 */
export async function canvasEncodeTest(mimeType) {
    try {
        const blob = await canvasEncode(new ImageData(1, 1), mimeType);
        // According to the spec, the blob should be null if the format isn't supported…
        if (!blob)
            return false;
        // …but Safari & Firefox fall back to PNG, so we need to check the mime type.
        return blob.type === mimeType;
    }
    catch (err) {
        return false;
    }
}
