define(['exports', './idb-keyval-9d9b390d'], function (exports, idbKeyval) { 'use strict';

    /** Tell the service worker to skip waiting */
    async function skipWaiting() {
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg || !reg.waiting)
            return;
        reg.waiting.postMessage('skip-waiting');
    }
    /** Find the service worker that's 'active' or closest to 'active' */
    async function getMostActiveServiceWorker() {
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg)
            return null;
        return reg.active || reg.waiting || reg.installing;
    }
    /** Wait for an installing worker */
    async function installingWorker(reg) {
        if (reg.installing)
            return reg.installing;
        return new Promise((resolve) => {
            reg.addEventListener('updatefound', () => resolve(reg.installing), {
                once: true,
            });
        });
    }
    /** Wait a service worker to become waiting */
    async function updateReady(reg) {
        if (reg.waiting)
            return;
        const installing = await installingWorker(reg);
        return new Promise((resolve) => {
            installing.addEventListener('statechange', () => {
                if (installing.state === 'installed')
                    resolve();
            });
        });
    }
    /** Wait for a shared image */
    function getSharedImage() {
        return new Promise((resolve) => {
            const onmessage = (event) => {
                if (event.data.action !== 'load-image')
                    return;
                resolve(event.data.file);
                navigator.serviceWorker.removeEventListener('message', onmessage);
            };
            navigator.serviceWorker.addEventListener('message', onmessage);
            // This message is picked up by the service worker - it's how it knows we're ready to receive
            // the file.
            navigator.serviceWorker.controller.postMessage('share-ready');
        });
    }
    /** Set up the service worker and monitor changes */
    async function offliner(showSnack) {
        const hasController = !!navigator.serviceWorker.controller;
        // Look for changes in the controller
        navigator.serviceWorker.addEventListener('controllerchange', async () => {
            // Is it the first install?
            if (!hasController) {
                showSnack('Ready to work offline', { timeout: 5000 });
                return;
            }
            // Otherwise reload (the user will have agreed to this).
            location.reload();
        });
        // If we don't have a controller, we don't need to check for updates – we've just loaded from the
        // network.
        if (!hasController)
            return;
        const reg = await navigator.serviceWorker.getRegistration();
        // Service worker not registered yet.
        if (!reg)
            return;
        // Look for updates
        await updateReady(reg);
        // Ask the user if they want to update.
        const result = await showSnack('Update available', {
            actions: ['reload', 'dismiss'],
        });
        // Tell the waiting worker to activate, this will change the controller and cause a reload (see
        // 'controllerchange')
        if (result === 'reload')
            skipWaiting();
    }
    /**
     * Tell the service worker the main app has loaded. If it's the first time the service worker has
     * heard about this, cache the heavier assets like codecs.
     */
    async function mainAppLoaded() {
        // If the user has already interacted, no need to tell the service worker anything.
        const userInteracted = await idbKeyval.get('user-interacted');
        if (userInteracted)
            return;
        idbKeyval.set('user-interacted', true);
        const serviceWorker = await getMostActiveServiceWorker();
        if (!serviceWorker)
            return; // Service worker not installing yet.
        serviceWorker.postMessage('cache-all');
    }

    exports.getSharedImage = getSharedImage;
    exports.mainAppLoaded = mainAppLoaded;
    exports.offliner = offliner;

});
