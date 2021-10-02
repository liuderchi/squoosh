define(['exports'], function (exports) { 'use strict';

    class Store {
        constructor(dbName = 'keyval-store', storeName = 'keyval') {
            this.storeName = storeName;
            this._dbp = new Promise((resolve, reject) => {
                const openreq = indexedDB.open(dbName, 1);
                openreq.onerror = () => reject(openreq.error);
                openreq.onsuccess = () => resolve(openreq.result);
                // First time setup: create an empty object store
                openreq.onupgradeneeded = () => {
                    openreq.result.createObjectStore(storeName);
                };
            });
        }
        _withIDBStore(type, callback) {
            return this._dbp.then(db => new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, type);
                transaction.oncomplete = () => resolve();
                transaction.onabort = transaction.onerror = () => reject(transaction.error);
                callback(transaction.objectStore(this.storeName));
            }));
        }
    }
    let store;
    function getDefaultStore() {
        if (!store)
            store = new Store();
        return store;
    }
    function get(key, store = getDefaultStore()) {
        let req;
        return store._withIDBStore('readonly', store => {
            req = store.get(key);
        }).then(() => req.result);
    }
    function set(key, value, store = getDefaultStore()) {
        return store._withIDBStore('readwrite', store => {
            store.put(value, key);
        });
    }

    exports.get = get;
    exports.set = set;

});
