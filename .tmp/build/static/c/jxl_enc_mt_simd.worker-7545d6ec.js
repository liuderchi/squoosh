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
define(['require'], function (require) { 'use strict';

	var Module={};var initializedJS=false;function threadPrintErr(){var text=Array.prototype.slice.call(arguments).join(" ");console.error(text);}function threadAlert(){var text=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:text,threadId:Module["_pthread_self"]()});}var err=threadPrintErr;self.alert=threadAlert;Module["instantiateWasm"]=function(info,receiveInstance){var instance=new WebAssembly.Instance(Module["wasmModule"],info);receiveInstance(instance);Module["wasmModule"]=null;return instance.exports};function moduleLoaded(){}self.onmessage=function(e){try{if(e.data.cmd==="load"){Module["wasmModule"]=e.data.wasmModule;Module["wasmMemory"]=e.data.wasmMemory;Module["buffer"]=Module["wasmMemory"].buffer;Module["ENVIRONMENT_IS_PTHREAD"]=true;(e.data.urlOrBlob?require(e.data.urlOrBlob):require('./jxl_enc_mt_simd-c25f553e')).then(function(exports){return exports.default(Module)}).then(function(instance){Module=instance;moduleLoaded();});}else if(e.data.cmd==="objectTransfer"){Module["PThread"].receiveObjectTransfer(e.data);}else if(e.data.cmd==="run"){Module["__performance_now_clock_drift"]=performance.now()-e.data.time;Module["__emscripten_thread_init"](e.data.threadInfoStruct,0,0);var max=e.data.stackBase;var top=e.data.stackBase+e.data.stackSize;Module["establishStackSpace"](top,max);Module["PThread"].receiveObjectTransfer(e.data);Module["PThread"].threadInit();if(!initializedJS){Module["___embind_register_native_and_builtin_types"]();initializedJS=true;}try{var result=Module["invokeEntryPoint"](e.data.start_routine,e.data.arg);if(Module["keepRuntimeAlive"]()){Module["PThread"].setExitStatus(result);}else {Module["PThread"].threadExit(result);}}catch(ex){if(ex==="Canceled!"){Module["PThread"].threadCancel();}else if(ex!="unwind"){if(ex instanceof Module["ExitStatus"]){if(Module["keepRuntimeAlive"]()){}else {Module["PThread"].threadExit(ex.status);}}else {Module["PThread"].threadExit(-2);throw ex}}}}else if(e.data.cmd==="cancel"){if(Module["_pthread_self"]()){Module["PThread"].threadCancel();}}else if(e.data.target==="setimmediate"){}else if(e.data.cmd==="processThreadQueue"){if(Module["_pthread_self"]()){Module["_emscripten_current_thread_process_queued_calls"]();}}else {err("worker.js received unknown command "+e.data.cmd);err(e.data);}}catch(ex){err("worker.js onmessage() captured an uncaught exception: "+ex);if(ex&&ex.stack)err(ex.stack);throw ex}};

});
