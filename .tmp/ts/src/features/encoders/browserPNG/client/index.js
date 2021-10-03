import { canvasEncode } from 'client/lazy-app/util/canvas';
import { mimeType } from '../shared/meta';
export const encode = (signal, workerBridge, imageData, options) => canvasEncode(imageData, mimeType);
