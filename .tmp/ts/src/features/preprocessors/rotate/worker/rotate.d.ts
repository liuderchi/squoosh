import { Options } from '../shared/meta';
export interface RotateModuleInstance {
    exports: {
        memory: WebAssembly.Memory;
        rotate(width: number, height: number, rotate: 0 | 90 | 180 | 270): void;
    };
}
export default function rotate(data: ImageData, opts: Options): Promise<ImageData>;
//# sourceMappingURL=rotate.d.ts.map