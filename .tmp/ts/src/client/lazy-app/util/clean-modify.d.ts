/**
 * @param source Object to copy from.
 * @param keys Path to modify, eg "foo.bar.baz".
 * @param toMerge A value to merge into the value at the path.
 */
export declare function cleanMerge<A extends any[] | object>(source: A, keys: string | number | string[], toMerge: any[] | object): A;
/**
 * @param source Object to copy from.
 * @param keys Path to modify, eg "foo.bar.baz".
 * @param newValue A value to set at the path.
 */
export declare function cleanSet<A extends any[] | object>(source: A, keys: string | number | string[], newValue: any): A;
//# sourceMappingURL=clean-modify.d.ts.map