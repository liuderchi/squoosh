import { h, Component } from 'preact';
import { linkRef } from 'shared/prerendered-app/util';
import '../../custom-els/loading-spinner';
import logo from 'url:./imgs/logo.svg';
import githubLogo from 'url:./imgs/github-logo.svg';
import largePhoto from 'url:./imgs/demos/demo-large-photo.jpg';
import artwork from 'url:./imgs/demos/demo-artwork.jpg';
import deviceScreen from 'url:./imgs/demos/demo-device-screen.png';
import largePhotoIcon from 'url:./imgs/demos/icon-demo-large-photo.jpg';
import artworkIcon from 'url:./imgs/demos/icon-demo-artwork.jpg';
import deviceScreenIcon from 'url:./imgs/demos/icon-demo-device-screen.jpg';
import smallSectionAsset from 'url:./imgs/info-content/small.svg';
import simpleSectionAsset from 'url:./imgs/info-content/simple.svg';
import secureSectionAsset from 'url:./imgs/info-content/secure.svg';
import logoIcon from 'url:./imgs/demos/icon-demo-logo.png';
import logoWithText from 'data-url-text:./imgs/logo-with-text.svg';
import * as style from './style.css';
import 'shared/custom-els/snack-bar';
import { startBlobs } from './blob-anim/meta';
import SlideOnScroll from './SlideOnScroll';
const demos = [
    {
        description: 'Large photo',
        size: '2.8mb',
        filename: 'photo.jpg',
        url: largePhoto,
        iconUrl: largePhotoIcon,
    },
    {
        description: 'Artwork',
        size: '2.9mb',
        filename: 'art.jpg',
        url: artwork,
        iconUrl: artworkIcon,
    },
    {
        description: 'Device screen',
        size: '1.6mb',
        filename: 'pixel3.png',
        url: deviceScreen,
        iconUrl: deviceScreenIcon,
    },
    {
        description: 'SVG icon',
        size: '13k',
        filename: 'squoosh.svg',
        url: logo,
        iconUrl: logoIcon,
    },
];
const blobAnimImport = !__PRERENDER__ && matchMedia('(prefers-reduced-motion: reduce)').matches
    ? undefined
    : import('./blob-anim');
const installButtonSource = 'introInstallButton-Purple';
const supportsClipboardAPI = !__PRERENDER__ && navigator.clipboard && navigator.clipboard.read;
async function getImageClipboardItem(items) {
    for (const item of items) {
        const type = item.types.find((type) => type.startsWith('image/'));
        if (type)
            return item.getType(type);
    }
}
export default class Intro extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            showBlobSVG: true,
        };
        this.installingViaButton = false;
        this.onFileChange = (event) => {
            const fileInput = event.target;
            const file = fileInput.files && fileInput.files[0];
            if (!file)
                return;
            this.fileInput.value = '';
            this.props.onFile(file);
        };
        this.onOpenClick = () => {
            this.fileInput.click();
        };
        this.onDemoClick = async (index, event) => {
            try {
                this.setState({ fetchingDemoIndex: index });
                const demo = demos[index];
                const blob = await fetch(demo.url).then((r) => r.blob());
                const file = new File([blob], demo.filename, { type: blob.type });
                this.props.onFile(file);
            }
            catch (err) {
                this.setState({ fetchingDemoIndex: undefined });
                this.props.showSnack("Couldn't fetch demo image");
            }
        };
        this.onBeforeInstallPromptEvent = (event) => {
            // Don't show the mini-infobar on mobile
            event.preventDefault();
            // Save the beforeinstallprompt event so it can be called later.
            this.setState({ beforeInstallEvent: event });
            // Log the event.
            const gaEventInfo = {
                eventCategory: 'pwa-install',
                eventAction: 'promo-shown',
                nonInteraction: true,
            };
            ga('send', 'event', gaEventInfo);
        };
        this.onInstallClick = async (event) => {
            // Get the deferred beforeinstallprompt event
            const beforeInstallEvent = this.state.beforeInstallEvent;
            // If there's no deferred prompt, bail.
            if (!beforeInstallEvent)
                return;
            this.installingViaButton = true;
            // Show the browser install prompt
            beforeInstallEvent.prompt();
            // Wait for the user to accept or dismiss the install prompt
            const { outcome } = await beforeInstallEvent.userChoice;
            // Send the analytics data
            const gaEventInfo = {
                eventCategory: 'pwa-install',
                eventAction: 'promo-clicked',
                eventLabel: installButtonSource,
                eventValue: outcome === 'accepted' ? 1 : 0,
            };
            ga('send', 'event', gaEventInfo);
            // If the prompt was dismissed, we aren't going to install via the button.
            if (outcome === 'dismissed') {
                this.installingViaButton = false;
            }
        };
        this.onAppInstalled = () => {
            // We don't need the install button, if it's shown
            this.setState({ beforeInstallEvent: undefined });
            // Don't log analytics if page is not visible
            if (document.hidden)
                return;
            // Try to get the install, if it's not set, use 'browser'
            const source = this.installingViaButton ? installButtonSource : 'browser';
            ga('send', 'event', 'pwa-install', 'installed', source);
            // Clear the install method property
            this.installingViaButton = false;
        };
        this.onPasteClick = async () => {
            let clipboardItems;
            try {
                clipboardItems = await navigator.clipboard.read();
            }
            catch (err) {
                this.props.showSnack(`No permission to access clipboard`);
                return;
            }
            const blob = await getImageClipboardItem(clipboardItems);
            if (!blob) {
                this.props.showSnack(`No image found in the clipboard`);
                return;
            }
            this.props.onFile(new File([blob], 'image.unknown'));
        };
    }
    componentDidMount() {
        // Listen for beforeinstallprompt events, indicating Squoosh is installable.
        window.addEventListener('beforeinstallprompt', this.onBeforeInstallPromptEvent);
        // Listen for the appinstalled event, indicating Squoosh has been installed.
        window.addEventListener('appinstalled', this.onAppInstalled);
        if (blobAnimImport) {
            blobAnimImport.then((module) => {
                this.setState({
                    showBlobSVG: false,
                }, () => module.startBlobAnim(this.blobCanvas));
            });
        }
    }
    componentWillUnmount() {
        window.removeEventListener('beforeinstallprompt', this.onBeforeInstallPromptEvent);
        window.removeEventListener('appinstalled', this.onAppInstalled);
    }
    render({}, { fetchingDemoIndex, beforeInstallEvent, showBlobSVG }) {
        return (h("div", { class: style.intro },
            h("input", { class: style.hide, ref: linkRef(this, 'fileInput'), type: "file", onChange: this.onFileChange }),
            h("div", { class: style.main },
                !__PRERENDER__ && (h("canvas", { ref: linkRef(this, 'blobCanvas'), class: style.blobCanvas })),
                h("h1", { class: style.logoContainer },
                    h("img", { class: style.logo, src: logoWithText, alt: "Squoosh", width: "539", height: "162" })),
                h("div", { class: style.loadImg },
                    showBlobSVG && (h("svg", { class: style.blobSvg, viewBox: "-1.25 -1.25 2.5 2.5", preserveAspectRatio: "xMidYMid slice" }, startBlobs.map((points) => (h("path", { d: points
                            .map((point, i) => {
                            const nextI = i === points.length - 1 ? 0 : i + 1;
                            let d = '';
                            if (i === 0) {
                                d += `M${point[2]} ${point[3]}`;
                            }
                            return (d +
                                `C${point[4]} ${point[5]} ${points[nextI][0]} ${points[nextI][1]} ${points[nextI][2]} ${points[nextI][3]}`);
                        })
                            .join('') }))))),
                    h("div", { class: style.loadImgContent, style: { visibility: __PRERENDER__ ? 'hidden' : '' } },
                        h("button", { class: style.loadBtn, onClick: this.onOpenClick },
                            h("svg", { viewBox: "0 0 24 24", class: style.loadIcon },
                                h("path", { d: "M19 7v3h-2V7h-3V5h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5a2 2 0 00-2 2v12c0 1.1.9 2 2 2h12a2 2 0 002-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z" }))),
                        h("div", null,
                            h("span", { class: style.dropText }, "Drop "),
                            "OR",
                            ' ',
                            supportsClipboardAPI ? (h("button", { class: style.pasteBtn, onClick: this.onPasteClick }, "Paste")) : ('Paste'))))),
            h("div", { class: style.demosContainer },
                h("svg", { viewBox: "0 0 1920 140", class: style.topWave },
                    h("path", { d: "M1920 0l-107 28c-106 29-320 85-533 93-213 7-427-36-640-50s-427 0-533 7L0 85v171h1920z", class: style.subWave }),
                    h("path", { d: "M0 129l64-26c64-27 192-81 320-75 128 5 256 69 384 64 128-6 256-80 384-91s256 43 384 70c128 26 256 26 320 26h64v96H0z", class: style.mainWave })),
                h("div", { class: style.contentPadding },
                    h("p", { class: style.demoTitle },
                        "Or ",
                        h("strong", null, "try one"),
                        " of these:"),
                    h("ul", { class: style.demos }, demos.map((demo, i) => (h("li", null,
                        h("button", { class: "unbutton", onClick: (event) => this.onDemoClick(i, event) },
                            h("div", null,
                                h("div", { class: style.demoIconContainer },
                                    h("img", { class: style.demoIcon, src: demo.iconUrl, alt: demo.description }),
                                    fetchingDemoIndex === i && (h("div", { class: style.demoLoader },
                                        h("loading-spinner", null)))),
                                h("div", { class: style.demoSize }, demo.size))))))))),
            h("div", { class: style.bottomWave },
                h("svg", { viewBox: "0 0 1920 79", class: style.topWave },
                    h("path", { d: "M0 59l64-11c64-11 192-34 320-43s256-5 384 4 256 23 384 34 256 21 384 14 256-30 320-41l64-11v94H0z", class: style.infoWave }))),
            h("section", { class: style.info },
                h("div", { class: style.infoContainer },
                    h(SlideOnScroll, null,
                        h("div", { class: style.infoContent },
                            h("div", { class: style.infoTextWrapper },
                                h("h2", { class: style.infoTitle }, "Small"),
                                h("p", { class: style.infoCaption }, "Smaller images mean faster load times. Squoosh can reduce file size and maintain high quality.")),
                            h("div", { class: style.infoImgWrapper },
                                h("img", { class: style.infoImg, src: smallSectionAsset, alt: "silhouette of a large 1.4 megabyte image shrunk into a smaller 80 kilobyte image", width: "536", height: "522" })))))),
            h("section", { class: style.info },
                h("div", { class: style.infoContainer },
                    h(SlideOnScroll, null,
                        h("div", { class: style.infoContent },
                            h("div", { class: style.infoTextWrapper },
                                h("h2", { class: style.infoTitle }, "Simple"),
                                h("p", { class: style.infoCaption }, "Open your image, inspect the differences, then save instantly. Feeling adventurous? Adjust the settings for even smaller files.")),
                            h("div", { class: style.infoImgWrapper },
                                h("img", { class: style.infoImg, src: simpleSectionAsset, alt: "grid of multiple shrunk images displaying various options", width: "538", height: "384" })))))),
            h("section", { class: style.info },
                h("div", { class: style.infoContainer },
                    h(SlideOnScroll, null,
                        h("div", { class: style.infoContent },
                            h("div", { class: style.infoTextWrapper },
                                h("h2", { class: style.infoTitle }, "Secure"),
                                h("p", { class: style.infoCaption }, "Worried about privacy? Images never leave your device since Squoosh does all the work locally.")),
                            h("div", { class: style.infoImgWrapper },
                                h("img", { class: style.infoImg, src: secureSectionAsset, alt: "silhouette of a cloud with a 'no' symbol on top", width: "498", height: "333" })))))),
            h("footer", { class: style.footer },
                h("div", { class: style.footerContainer },
                    h("svg", { viewBox: "0 0 1920 79", class: style.topWave },
                        h("path", { d: "M0 59l64-11c64-11 192-34 320-43s256-5 384 4 256 23 384 34 256 21 384 14 256-30 320-41l64-11v94H0z", class: style.footerWave })),
                    h("div", { class: style.footerPadding },
                        h("footer", { class: style.footerItems },
                            h("a", { class: style.footerLink, href: "https://github.com/GoogleChromeLabs/squoosh/blob/dev/README.md#privacy" }, "Privacy"),
                            h("a", { class: style.footerLink, href: "https://github.com/GoogleChromeLabs/squoosh/tree/dev/cli" }, "Squoosh CLI"),
                            h("a", { class: style.footerLinkWithLogo, href: "https://github.com/GoogleChromeLabs/squoosh" },
                                h("img", { src: githubLogo, alt: "", width: "10", height: "10" }),
                                "Source on Github"))))),
            beforeInstallEvent && (h("button", { class: style.installBtn, onClick: this.onInstallClick }, "Install"))));
    }
}
