import { Component } from 'preact';
interface EncodeOptions {
    quality: number;
}
interface Props {
    options: EncodeOptions;
    onChange(newOptions: EncodeOptions): void;
}
interface QualityOptionArg {
    min?: number;
    max?: number;
    step?: number;
}
declare type Constructor<T extends {} = {}> = new (...args: any[]) => T;
export interface QualityOptionsInterface extends Component<Props, {}> {
}
export declare function qualityOption(opts?: QualityOptionArg): Constructor<QualityOptionsInterface>;
export {};
//# sourceMappingURL=index.d.ts.map