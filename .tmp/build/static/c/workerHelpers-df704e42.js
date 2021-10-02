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
define(['module', 'require', 'exports'], function (module, require, exports) { 'use strict';

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

  // Note: we use `wasm_bindgen_worker_`-prefixed message types to make sure
  // we can handle bundling into other files, which might happen to have their
  // own `postMessage`/`onmessage` communication channels.
  //
  // If we didn't take that into the account, we could send much simpler signals
  // like just `0` or whatever, but the code would be less resilient.

  function waitForMsgType(target, type) {
    return new Promise(resolve => {
      target.addEventListener('message', function onMsg({ data }) {
        if (data == null || data.type !== type) return;
        target.removeEventListener('message', onMsg);
        resolve(data);
      });
    });
  }

  waitForMsgType(self, 'wasm_bindgen_worker_init').then(async data => {
    // # Note 1
    // Our JS should have been generated in
    // `[out-dir]/snippets/wasm-bindgen-rayon-[hash]/workerHelpers.js`,
    // resolve the main module via `../../..`.
    //
    // This might need updating if the generated structure changes on wasm-bindgen
    // side ever in the future, but works well with bundlers today. The whole
    // point of this crate, after all, is to abstract away unstable features
    // and temporary bugs so that you don't need to deal with them in your code.
    //
    // # Note 2
    // This could be a regular import, but then some bundlers complain about
    // circular deps.
    //
    // Dynamic import could be cheap if this file was inlined into the parent,
    // which would require us just using `../../..` in `new Worker` below,
    // but that doesn't work because wasm-pack unconditionally adds
    // "sideEffects":false (see below).
    //
    // OTOH, even though it can't be inlined, it should be still reasonably
    // cheap since the requested file is already in cache (it was loaded by
    // the main thread).
    const pkg = await require('./squoosh_oxipng-79c59f3a');
    await pkg.default(data.module, data.memory);
    postMessage({ type: 'wasm_bindgen_worker_ready' });
    pkg.wbg_rayon_start_worker(data.receiver);
  });

  async function startWorkers(module$1, memory, builder) {
    const workerInit = {
      type: 'wasm_bindgen_worker_init',
      module: module$1,
      memory,
      receiver: builder.receiver()
    };

    try {
      await Promise.all(
        Array.from({ length: builder.numThreads() }, () => {
          // Self-spawn into a new Worker.
          //
          // TODO: while `new URL('...', import.meta.url) becomes a semi-standard
          // way to get asset URLs relative to the module across various bundlers
          // and browser, ideally we should switch to `import.meta.resolve`
          // once it becomes a standard.
          //
          // Note: we could use `../../..` as the URL here to inline workerHelpers.js
          // into the parent entry instead of creating another split point -
          // this would be preferable from optimization perspective -
          // however, Webpack then eliminates all message handler code
          // because wasm-pack produces "sideEffects":false in package.json
          // unconditionally.
          //
          // The only way to work around that is to have side effect code
          // in an entry point such as Worker file itself.
          const worker = new Worker(new URL("/c/workerHelpers-df704e42.js", module.uri));
          worker.postMessage(workerInit);
          return waitForMsgType(worker, 'wasm_bindgen_worker_ready');
        })
      );
      builder.build();
    } finally {
      builder.free();
    }
  }

  exports.startWorkers = startWorkers;

  Object.defineProperty(exports, '__esModule', { value: true });

});
