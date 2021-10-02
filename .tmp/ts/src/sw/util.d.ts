export declare function cacheOrNetwork(event: FetchEvent): void;
export declare function cacheOrNetworkAndCache(event: FetchEvent, cacheName: string): void;
export declare function serveShareTarget(event: FetchEvent): void;
export declare function cleanupCache(event: FetchEvent, cacheName: string, keepAssets: string[]): void;
export declare function cacheBasics(cacheName: string): Promise<void>;
export declare function cacheAdditionalProcessors(cacheName: string): Promise<void>;
//# sourceMappingURL=util.d.ts.map