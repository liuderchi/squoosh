'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');
var render = require('preact-render-to-string');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var render__default = /*#__PURE__*/_interopDefaultLegacy(render);

/**
 * Copyright 2020 Google Inc. All Rights Reserved.
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
function renderPage(vnode) {
    return '<!DOCTYPE html>' + render__default['default'](vnode);
}
function writeFiles(toOutput) {
    Promise.all(Object.entries(toOutput).map(async ([path$1, content]) => {
        const pathParts = ['.tmp', 'build', 'static', ...path$1.split('/')];
        await fs.promises.mkdir(path.join(...pathParts.slice(0, -1)), { recursive: true });
        const fullPath = path.join(...pathParts);
        try {
            await fs.promises.writeFile(fullPath, content, {
                encoding: 'utf8',
            });
        }
        catch (err) {
            console.error('Failed to write ' + fullPath);
            throw err;
        }
    })).catch((err) => {
        console.error(err);
        process.exit(1);
    });
}
/**
 * Escape a string for insertion in a style or script tag
 */
function escapeStyleScriptContent(str) {
    return str
        .replace(/<!--/g, '<\\!--')
        .replace(/<script/g, '<\\script')
        .replace(/<\/script/g, '<\\/script')
        .replace(/<style/g, '<\\style')
        .replace(/<\/style/g, '<\\/style');
}
/**
 * Origin of the site, depending on the environment.
 */
const siteOrigin = (() => {
    if (process.env.DEV_PORT)
        return `http://localhost:${process.env.DEV_PORT}`;
    // https://docs.netlify.com/configure-builds/environment-variables/#build-metadata
    if (process.env.CONTEXT === 'production')
        return 'https://squoosh.app';
    if (process.env.DEPLOY_PRIME_URL)
        return process.env.DEPLOY_PRIME_URL;
    console.warn('Unable to determine site origin, defaulting to https://squoosh.app');
    return 'https://squoosh.app';
})();

exports.escapeStyleScriptContent = escapeStyleScriptContent;
exports.renderPage = renderPage;
exports.siteOrigin = siteOrigin;
exports.writeFiles = writeFiles;
