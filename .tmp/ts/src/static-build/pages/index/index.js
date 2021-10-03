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
import { h } from 'preact';
import baseCss from 'css:./base.css';
import initialCss from 'initial-css:';
import { allSrc } from 'client-bundle:client/initial-app';
import favicon from 'url:static-build/assets/favicon.ico';
import ogImage from 'url:static-build/assets/icon-large-maskable.png';
import { escapeStyleScriptContent, siteOrigin } from 'static-build/utils';
import Intro from 'shared/prerendered-app/Intro';
const Index = () => (h("html", { lang: "en" },
    h("head", null,
        h("title", null, "Squoosh"),
        h("meta", { name: "description", content: "Squoosh is the ultimate image optimizer that allows you to compress and compare images with different codecs in your browser." }),
        h("meta", { name: "twitter:card", content: "summary" }),
        h("meta", { name: "twitter:site", content: "@SquooshApp" }),
        h("meta", { property: "og:title", content: "Squoosh" }),
        h("meta", { property: "og:type", content: "website" }),
        h("meta", { property: "og:image", content: `${siteOrigin}${ogImage}` }),
        h("meta", { property: "og:image:secure_url", content: `${siteOrigin}${ogImage}` }),
        h("meta", { property: "og:image:type", content: "image/png" }),
        h("meta", { property: "og:image:width", content: "500" }),
        h("meta", { property: "og:image:height", content: "500" }),
        h("meta", { property: "og:image:alt", content: "A cartoon of a hand squeezing an image file on a dark background." }),
        h("meta", { name: "og:description", content: "Squoosh is the ultimate image optimizer that allows you to compress and compare images with different codecs in your browser." }),
        h("meta", { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" }),
        h("meta", { name: "mobile-web-app-capable", content: "yes" }),
        h("meta", { name: "apple-mobile-web-app-capable", content: "yes" }),
        h("link", { rel: "shortcut icon", href: favicon }),
        h("meta", { name: "theme-color", content: "#ff3385" }),
        h("link", { rel: "manifest", href: "/manifest.json" }),
        h("link", { rel: "canonical", href: siteOrigin }),
        h("style", { dangerouslySetInnerHTML: { __html: escapeStyleScriptContent(baseCss) } }),
        h("style", { dangerouslySetInnerHTML: {
                __html: escapeStyleScriptContent(initialCss),
            } })),
    h("body", null,
        h("div", { id: "app" },
            h(Intro, null)),
        h("script", { dangerouslySetInnerHTML: {
                __html: escapeStyleScriptContent(allSrc),
            } }))));
export default Index;
