'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var preact = require('preact');
var base = require('../../../_virtual/base.css');
var _initialCss = require('../../../_virtual/_initialCss');
var index_tsx = require('../../../_virtual/index.tsx.js');
var favicon_ico = require('../../../_virtual/favicon.ico.js');
var iconLargeMaskable_png = require('../../../_virtual/icon-large-maskable.png2.js');
var utils = require('../../utils.js');
var index = require('../../../shared/prerendered-app/Intro/index.js');

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
const Index = () => (preact.h("html", { lang: "en" },
    preact.h("head", null,
        preact.h("title", null, "Squoosh"),
        preact.h("meta", { name: "description", content: "Squoosh is the ultimate image optimizer that allows you to compress and compare images with different codecs in your browser." }),
        preact.h("meta", { name: "twitter:card", content: "summary" }),
        preact.h("meta", { name: "twitter:site", content: "@SquooshApp" }),
        preact.h("meta", { property: "og:title", content: "Squoosh" }),
        preact.h("meta", { property: "og:type", content: "website" }),
        preact.h("meta", { property: "og:image", content: `${utils.siteOrigin}${iconLargeMaskable_png['default']}` }),
        preact.h("meta", { property: "og:image:secure_url", content: `${utils.siteOrigin}${iconLargeMaskable_png['default']}` }),
        preact.h("meta", { property: "og:image:type", content: "image/png" }),
        preact.h("meta", { property: "og:image:width", content: "500" }),
        preact.h("meta", { property: "og:image:height", content: "500" }),
        preact.h("meta", { property: "og:image:alt", content: "A cartoon of a hand squeezing an image file on a dark background." }),
        preact.h("meta", { name: "og:description", content: "Squoosh is the ultimate image optimizer that allows you to compress and compare images with different codecs in your browser." }),
        preact.h("meta", { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" }),
        preact.h("meta", { name: "mobile-web-app-capable", content: "yes" }),
        preact.h("meta", { name: "apple-mobile-web-app-capable", content: "yes" }),
        preact.h("link", { rel: "shortcut icon", href: favicon_ico['default'] }),
        preact.h("meta", { name: "theme-color", content: "#ff3385" }),
        preact.h("link", { rel: "manifest", href: "/manifest.json" }),
        preact.h("link", { rel: "canonical", href: utils.siteOrigin }),
        preact.h("style", { dangerouslySetInnerHTML: { __html: utils.escapeStyleScriptContent(base['default']) } }),
        preact.h("style", { dangerouslySetInnerHTML: {
                __html: utils.escapeStyleScriptContent(_initialCss['default']),
            } })),
    preact.h("body", null,
        preact.h("div", { id: "app" },
            preact.h(index['default'], null)),
        preact.h("script", { dangerouslySetInnerHTML: {
                __html: utils.escapeStyleScriptContent(index_tsx.allSrc),
            } }))));

exports.default = Index;
