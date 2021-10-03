const ASSETS = [
  "c/github-logo-bc05494c.svg",
  "c/logo-bcc20dd5.svg",
  "c/icon-demo-large-photo-18da387a.jpg",
  "c/icon-demo-logo-326ed9b6.png",
  "c/icon-demo-device-screen-5d52d8b9.jpg",
  "c/secure-a66bbdfe.svg",
  "c/small-db1eae6f.svg",
  "c/icon-demo-artwork-9eba1655.jpg",
  "c/simple-258b6ed5.svg",
  "c/rotate-e8fb6784.wasm",
  "c/imagequant-a10bbe1a.wasm",
  "c/webp_dec-12bed04a.wasm",
  "c/demo-device-screen-b9d088e8.png",
  "c/squoosh_oxipng_bg-bb6b7672.wasm",
  "c/squoosh_resize_bg-3d426466.wasm",
  "c/webp_enc-a8223a7d.wasm",
  "c/squoosh_oxipng_bg-89ef9006.wasm",
  "c/mozjpeg_enc-f6bf569c.wasm",
  "c/webp_enc_simd-75acd924.wasm",
  "c/squooshhqx_bg-6e04a330.wasm",
  "c/wp2_dec-9a40adf1.wasm",
  "c/jxl_dec-e89756e1.wasm",
  "c/wp2_enc-89317929.wasm",
  "c/wp2_enc_mt-1feb6658.wasm",
  "c/wp2_enc_mt_simd-0b0595e9.wasm",
  "c/jxl_enc-e7b0b516.wasm",
  "c/jxl_enc_mt-db5f6972.wasm",
  "c/avif_dec-07eff3d3.wasm",
  "c/demo-large-photo-a6b23f7b.jpg",
  "c/demo-artwork-c444f915.jpg",
  "c/jxl_enc_mt_simd-bec880cc.wasm",
  "c/avif_enc-b345922b.wasm",
  "c/avif_enc_mt-e6a6332c.wasm",
  "c/initial-app-51477545.js",
  "c/idb-keyval-9d9b390d.js",
  "c/index-5f659321.js",
  "c/features-worker-ed44e102.js",
  "c/util-06ce6ead.js",
  "c/jxl_enc_mt.worker-e0ddfa16.js",
  "c/jxl_enc_mt_simd.worker-7545d6ec.js",
  "c/avif_enc_mt.worker-be418551.js",
  "c/wp2_enc_mt_simd.worker-d4445a36.js",
  "c/wp2_enc_mt.worker-e14ebccf.js",
  "c/workerHelpers-df704e42.js",
  "c/debug-ecb398ca.js",
  "c/Compress-717d0c3a.js",
  "c/sw-bridge-eb1b7b9b.js",
  "c/blob-anim-87d44b87.js",
  "c/avif_dec-d2924c58.js",
  "c/webp_dec-318dc2b4.js",
  "c/avif_enc_mt-3ca53a00.js",
  "c/avif_enc-31cf8e60.js",
  "c/jxl_enc_mt_simd-c25f553e.js",
  "c/jxl_enc_mt-2c3e9d0b.js",
  "c/jxl_enc-0ad4f3ec.js",
  "c/squoosh_oxipng-79c59f3a.js",
  "c/squoosh_oxipng-65aca905.js",
  "c/webp_enc_simd-ad66a6ff.js",
  "c/webp_enc-de8661ab.js",
  "c/wp2_enc_mt_simd-773810ee.js",
  "c/wp2_enc_mt-c0fc8f9c.js",
  "c/wp2_enc-f854d67c.js"
];
const VERSION = "c7526283aeca041de9d4509158f5d0f2b8d34737";
/**
 * Copyright 2021 Google Inc. All Rights Reserved.
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

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  const singleRequire = (uri, parentUri) => {
    uri = uri.startsWith(location.origin) ? uri : new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "script";
            link.href = uri;
            link.onload = () => {
              const script = document.createElement("script");
              script.src = uri;
              script.onload = resolve;
              document.head.appendChild(script);
            };
            document.head.appendChild(link);
          } else {
            self.nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = self.nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    // Note: Promise.resolve() is necessary to delay loading until all the
    // `define`s on the current page had a chance to execute first.
    // This allows to inline some deps on the main page.
    registry[uri] = Promise.resolve().then(() => Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    ))).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['require', './c/index-5f659321', './c/idb-keyval-9d9b390d'], function (require, index, idbKeyval) { 'use strict';

    var webpDataUrl = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";

    var avifDataUrl = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABUAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgS0AAAAAABNjb2xybmNseAACAAIAAoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB1tZGF0EgAKBDgADskyCx/wAABYAAAAAK+w";

    const main = "/c/initial-app-51477545.js";
    const deps = ["/c/logo-bcc20dd5.svg","/c/github-logo-bc05494c.svg","/c/demo-large-photo-a6b23f7b.jpg","/c/demo-artwork-c444f915.jpg","/c/demo-device-screen-b9d088e8.png","/c/icon-demo-large-photo-18da387a.jpg","/c/icon-demo-artwork-9eba1655.jpg","/c/icon-demo-device-screen-5d52d8b9.jpg","/c/small-db1eae6f.svg","/c/simple-258b6ed5.svg","/c/secure-a66bbdfe.svg","/c/icon-demo-logo-326ed9b6.png"];

    var swUrl = "/serviceworker.js";

    const main$1 = "/c/Compress-717d0c3a.js";
    const deps$1 = ["/c/initial-app-51477545.js","/c/util-06ce6ead.js","/c/features-worker-ed44e102.js","/c/logo-bcc20dd5.svg","/c/github-logo-bc05494c.svg","/c/demo-large-photo-a6b23f7b.jpg","/c/demo-artwork-c444f915.jpg","/c/demo-device-screen-b9d088e8.png","/c/icon-demo-large-photo-18da387a.jpg","/c/icon-demo-artwork-9eba1655.jpg","/c/icon-demo-device-screen-5d52d8b9.jpg","/c/small-db1eae6f.svg","/c/simple-258b6ed5.svg","/c/secure-a66bbdfe.svg","/c/icon-demo-logo-326ed9b6.png"];

    const main$2 = "/c/sw-bridge-eb1b7b9b.js";
    const deps$2 = ["/c/idb-keyval-9d9b390d.js"];

    const main$3 = "/c/blob-anim-87d44b87.js";
    const deps$3 = ["/c/initial-app-51477545.js","/c/logo-bcc20dd5.svg","/c/github-logo-bc05494c.svg","/c/demo-large-photo-a6b23f7b.jpg","/c/demo-artwork-c444f915.jpg","/c/demo-device-screen-b9d088e8.png","/c/icon-demo-large-photo-18da387a.jpg","/c/icon-demo-artwork-9eba1655.jpg","/c/icon-demo-device-screen-5d52d8b9.jpg","/c/small-db1eae6f.svg","/c/simple-258b6ed5.svg","/c/secure-a66bbdfe.svg","/c/icon-demo-logo-326ed9b6.png"];

    const main$4 = "/c/features-worker-ed44e102.js";
    const deps$4 = ["/c/util-06ce6ead.js","/c/index-5f659321.js","/c/jxl_dec-e89756e1.wasm","/c/wp2_dec-9a40adf1.wasm","/c/mozjpeg_enc-f6bf569c.wasm","/c/rotate-e8fb6784.wasm","/c/imagequant-a10bbe1a.wasm","/c/squoosh_resize_bg-3d426466.wasm","/c/squooshhqx_bg-6e04a330.wasm"];

    var featuresWorker = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$4,
        deps: deps$4
    });

    const main$5 = "/c/avif_dec-d2924c58.js";
    const deps$5 = ["/c/avif_dec-07eff3d3.wasm"];

    var avifDec = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$5,
        deps: deps$5
    });

    const main$6 = "/c/webp_dec-318dc2b4.js";
    const deps$6 = ["/c/webp_dec-12bed04a.wasm"];

    var webpDec = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$6,
        deps: deps$6
    });

    const main$7 = "/c/avif_enc_mt-3ca53a00.js";
    const deps$7 = ["/c/avif_enc_mt-e6a6332c.wasm","/c/avif_enc_mt.worker-be418551.js"];

    var avifEncMt = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$7,
        deps: deps$7
    });

    const main$8 = "/c/avif_enc-31cf8e60.js";
    const deps$8 = ["/c/avif_enc-b345922b.wasm"];

    var avifEnc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$8,
        deps: deps$8
    });

    const main$9 = "/c/jxl_enc_mt_simd-c25f553e.js";
    const deps$9 = ["/c/jxl_enc_mt_simd-bec880cc.wasm","/c/jxl_enc_mt_simd.worker-7545d6ec.js"];

    var jxlEncMtSimd = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$9,
        deps: deps$9
    });

    const main$a = "/c/jxl_enc_mt-2c3e9d0b.js";
    const deps$a = ["/c/jxl_enc_mt-db5f6972.wasm","/c/jxl_enc_mt.worker-e0ddfa16.js"];

    var jxlEncMt = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$a,
        deps: deps$a
    });

    const main$b = "/c/jxl_enc-0ad4f3ec.js";
    const deps$b = ["/c/jxl_enc-e7b0b516.wasm"];

    var jxlEnc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$b,
        deps: deps$b
    });

    const main$c = "/c/squoosh_oxipng-79c59f3a.js";
    const deps$c = ["/c/workerHelpers-df704e42.js","/c/squoosh_oxipng_bg-89ef9006.wasm"];

    var oxiMt = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$c,
        deps: deps$c
    });

    const main$d = "/c/squoosh_oxipng-65aca905.js";
    const deps$d = ["/c/squoosh_oxipng_bg-bb6b7672.wasm"];

    var oxi = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$d,
        deps: deps$d
    });

    const main$e = "/c/webp_enc_simd-ad66a6ff.js";
    const deps$e = ["/c/webp_enc_simd-75acd924.wasm"];

    var webpEncSimd = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$e,
        deps: deps$e
    });

    const main$f = "/c/webp_enc-de8661ab.js";
    const deps$f = ["/c/webp_enc-a8223a7d.wasm"];

    var webpEnc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$f,
        deps: deps$f
    });

    const main$g = "/c/wp2_enc_mt_simd-773810ee.js";
    const deps$g = ["/c/wp2_enc_mt_simd-0b0595e9.wasm","/c/wp2_enc_mt_simd.worker-d4445a36.js"];

    var wp2EncMtSimd = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$g,
        deps: deps$g
    });

    const main$h = "/c/wp2_enc_mt-c0fc8f9c.js";
    const deps$h = ["/c/wp2_enc_mt-1feb6658.wasm","/c/wp2_enc_mt.worker-e14ebccf.js"];

    var wp2EncMt = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$h,
        deps: deps$h
    });

    const main$i = "/c/wp2_enc-f854d67c.js";
    const deps$i = ["/c/wp2_enc-89317929.wasm"];

    var wp2Enc = /*#__PURE__*/Object.freeze({
        __proto__: null,
        main: main$i,
        deps: deps$i
    });

    function subtractSets(set1, set2) {
        const result = new Set(set1);
        for (const item of set2)
            result.delete(item);
        return result;
    }
    function shouldCacheDynamically(url) {
        return url.startsWith('/c/demo-');
    }
    let initialJs = new Set([
        main$1,
        ...deps$1,
        main$2,
        ...deps$2,
        main$3,
        ...deps$3,
    ]);
    initialJs = subtractSets(initialJs, new Set([
        main,
        ...deps.filter((item) => 
        // Exclude JS deps that have been inlined:
        item.endsWith('.js') ||
            // As well as large image deps we want to keep dynamic:
            shouldCacheDynamically(item)),
        // Exclude features Worker itself - it's referenced from the main app,
        // but is meant to be cached lazily.
        main$4,
        // Also exclude Service Worker itself (we're inside right now).
        swUrl,
    ]));
    const initial = ['/', ...initialJs];
    const theRest = (async () => {
        const [supportsThreads, supportsSimd, supportsWebP, supportsAvif,] = await Promise.all([
            index.threads(),
            index.simd(),
            ...[webpDataUrl, avifDataUrl].map(async (dataUrl) => {
                if (!self.createImageBitmap)
                    return false;
                const response = await fetch(dataUrl);
                const blob = await response.blob();
                return createImageBitmap(blob).then(() => true, () => false);
            }),
        ]);
        const items = [];
        function addWithDeps(entry) {
            items.push(entry.main, ...entry.deps);
        }
        addWithDeps(featuresWorker);
        if (!supportsAvif)
            addWithDeps(avifDec);
        if (!supportsWebP)
            addWithDeps(webpDec);
        // AVIF
        if (supportsThreads) {
            addWithDeps(avifEncMt);
        }
        else {
            addWithDeps(avifEnc);
        }
        // JXL
        if (supportsThreads && supportsSimd) {
            addWithDeps(jxlEncMtSimd);
        }
        else if (supportsThreads) {
            addWithDeps(jxlEncMt);
        }
        else {
            addWithDeps(jxlEnc);
        }
        // OXI
        if (supportsThreads) {
            addWithDeps(oxiMt);
        }
        else {
            addWithDeps(oxi);
        }
        // WebP
        if (supportsSimd) {
            addWithDeps(webpEncSimd);
        }
        else {
            addWithDeps(webpEnc);
        }
        // WP2
        if (supportsThreads && supportsSimd) {
            addWithDeps(wp2EncMtSimd);
        }
        else if (supportsThreads) {
            addWithDeps(wp2EncMt);
        }
        else {
            addWithDeps(wp2Enc);
        }
        return [...new Set(items)];
    })();

    function cacheOrNetwork(event) {
        event.respondWith((async function () {
            const cachedResponse = await caches.match(event.request, {
                ignoreSearch: true,
            });
            return cachedResponse || fetch(event.request);
        })());
    }
    function cacheOrNetworkAndCache(event, cacheName) {
        event.respondWith((async function () {
            const { request } = event;
            // Return from cache if possible.
            const cachedResponse = await caches.match(request);
            if (cachedResponse)
                return cachedResponse;
            // Else go to the network.
            const response = await fetch(request);
            const responseToCache = response.clone();
            event.waitUntil((async function () {
                // Cache what we fetched.
                const cache = await caches.open(cacheName);
                await cache.put(request, responseToCache);
            })());
            // Return the network response.
            return response;
        })());
    }
    function serveShareTarget(event) {
        const dataPromise = event.request.formData();
        // Redirect so the user can refresh the page without resending data.
        event.respondWith(Response.redirect('/?share-target'));
        event.waitUntil((async function () {
            // The page sends this message to tell the service worker it's ready to receive the file.
            await nextMessage('share-ready');
            const client = await self.clients.get(event.resultingClientId);
            const data = await dataPromise;
            const file = data.get('file');
            client.postMessage({ file, action: 'load-image' });
        })());
    }
    function cleanupCache(event, cacheName, keepAssets) {
        event.waitUntil((async function () {
            const cache = await caches.open(cacheName);
            // Clean old entries from the dynamic cache.
            const requests = await cache.keys();
            const promises = requests.map((cachedRequest) => {
                // Get pathname without leading /
                const assetPath = new URL(cachedRequest.url).pathname.slice(1);
                // If it isn't one of our keepAssets, we don't need it anymore.
                if (!keepAssets.includes(assetPath))
                    return cache.delete(cachedRequest);
            });
            await Promise.all(promises);
        })());
    }
    function urlsToRequests(urls) {
        // Using no-cache, as our hashing aren't updating properly right now.
        return urls.map((url) => new Request(url, { cache: 'no-cache' }));
    }
    async function cacheBasics(cacheName) {
        const cache = await caches.open(cacheName);
        return cache.addAll(urlsToRequests(initial));
    }
    async function cacheAdditionalProcessors(cacheName) {
        const cache = await caches.open(cacheName);
        return cache.addAll(urlsToRequests(await theRest));
    }
    const nextMessageResolveMap = new Map();
    /**
     * Wait on a message with a particular event.data value.
     *
     * @param dataVal The event.data value.
     */
    function nextMessage(dataVal) {
        return new Promise((resolve) => {
            if (!nextMessageResolveMap.has(dataVal)) {
                nextMessageResolveMap.set(dataVal, []);
            }
            nextMessageResolveMap.get(dataVal).push(resolve);
        });
    }
    self.addEventListener('message', (event) => {
        const resolvers = nextMessageResolveMap.get(event.data);
        if (!resolvers)
            return;
        nextMessageResolveMap.delete(event.data);
        for (const resolve of resolvers)
            resolve();
    });

    const versionedCache = 'static-' + VERSION;
    const dynamicCache = 'dynamic';
    const expectedCaches = [versionedCache, dynamicCache];
    self.addEventListener('install', (event) => {
        event.waitUntil((async function () {
            const promises = [];
            promises.push(cacheBasics(versionedCache));
            // If the user has already interacted with the app, update the codecs too.
            if (await idbKeyval.get('user-interacted')) {
                promises.push(cacheAdditionalProcessors(versionedCache));
            }
            await Promise.all(promises);
        })());
    });
    self.addEventListener('activate', (event) => {
        self.clients.claim();
        event.waitUntil((async function () {
            // Remove old caches.
            const promises = (await caches.keys()).map((cacheName) => {
                if (!expectedCaches.includes(cacheName))
                    return caches.delete(cacheName);
            });
            await Promise.all(promises);
        })());
    });
    self.addEventListener('fetch', (event) => {
        const url = new URL(event.request.url);
        // Don't care about other-origin URLs
        if (url.origin !== location.origin)
            return;
        if (url.pathname === '/editor') {
            event.respondWith(Response.redirect('/'));
            return;
        }
        if (url.pathname === '/' &&
            url.searchParams.has('share-target') &&
            event.request.method === 'POST') {
            serveShareTarget(event);
            return;
        }
        // We only care about GET from here on in.
        if (event.request.method !== 'GET')
            return;
        if (shouldCacheDynamically(url.pathname)) {
            cacheOrNetworkAndCache(event, dynamicCache);
            cleanupCache(event, dynamicCache, ASSETS);
            return;
        }
        cacheOrNetwork(event);
    });
    self.addEventListener('message', (event) => {
        switch (event.data) {
            case 'cache-all':
                event.waitUntil(cacheAdditionalProcessors(versionedCache));
                break;
            case 'skip-waiting':
                self.skipWaiting();
                break;
        }
    });

});
