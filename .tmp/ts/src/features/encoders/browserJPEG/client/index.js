import { canvasEncode } from 'client/lazy-app/util/canvas';
import { qualityOption } from 'features/client-utils';
import { mimeType } from '../shared/meta';
export const encode = (signal, workerBridge, imageData, options) => canvasEncode(imageData, mimeType, options.quality);
export const Options = qualityOption({ min: 0, max: 1, step: 0.01 });
