'use strict';

var preact = require('preact');
var utils = require('./utils.js');
var index = require('./pages/index/index.js');
var iconLargeMaskable_png = require('../_virtual/icon-large-maskable.png.js');
var iconLarge_png = require('../_virtual/icon-large.png.js');
var screenshot1_png = require('../_virtual/screenshot1.png.js');
var screenshot2_jpg = require('../_virtual/screenshot2.jpg.js');
var screenshot3_jpg = require('../_virtual/screenshot3.jpg.js');
var dedent = require('dedent');
var mimeTypes = require('mime-types');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var dedent__default = /*#__PURE__*/_interopDefaultLegacy(dedent);

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
const manifestSize = ({ width, height }) => `${width}x${height}`;
const toOutput = {
    'index.html': utils.renderPage(preact.h(index['default'], null)),
    'manifest.json': JSON.stringify({
        name: 'Squoosh',
        short_name: 'Squoosh',
        start_url: '/?utm_medium=PWA&utm_source=launcher',
        display: 'standalone',
        orientation: 'any',
        background_color: '#fff',
        theme_color: '#ff3385',
        icons: [
            {
                src: iconLarge_png['default'],
                type: mimeTypes.lookup(iconLarge_png['default']),
                sizes: manifestSize(iconLarge_png),
            },
            {
                src: iconLargeMaskable_png['default'],
                type: mimeTypes.lookup(iconLargeMaskable_png['default']),
                sizes: manifestSize(iconLargeMaskable_png),
                purpose: 'maskable',
            },
        ],
        description: 'Compress and compare images with different codecs, right in your browser.',
        lang: 'en',
        categories: ['photo', 'productivity', 'utilities'],
        screenshots: [
            {
                src: screenshot1_png['default'],
                type: mimeTypes.lookup(screenshot1_png['default']),
                sizes: manifestSize(screenshot1_png),
            },
            {
                src: screenshot2_jpg['default'],
                type: mimeTypes.lookup(screenshot2_jpg['default']),
                sizes: manifestSize(screenshot2_jpg),
            },
            {
                src: screenshot3_jpg['default'],
                type: mimeTypes.lookup(screenshot3_jpg['default']),
                sizes: manifestSize(screenshot3_jpg),
            },
        ],
        share_target: {
            action: '/?utm_medium=PWA&utm_source=share-target&share-target',
            method: 'POST',
            enctype: 'multipart/form-data',
            params: {
                files: [
                    {
                        name: 'file',
                        accept: ['image/*'],
                    },
                ],
            },
        },
    }),
    _headers: dedent__default['default'] `
    /*
      Cache-Control: no-cache

    # I don't think Rollup is cache-busting files correctly.
    #/c/*
    #  Cache-Control: max-age=31536000

    # COOP+COEP for WebAssembly threads.
    /*
      Cross-Origin-Embedder-Policy: require-corp
      Cross-Origin-Opener-Policy: same-origin
  `,
};
utils.writeFiles(toOutput);
