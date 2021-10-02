import { h, Component, Fragment } from 'preact';
import * as style from './style.css';
import 'add-css:./style.css';
import 'shared/custom-els/loading-spinner';
import prettyBytes from './pretty-bytes';
import { Arrow, DownloadIcon } from 'client/lazy-app/icons';
const loadingReactionDelay = 500;
export default class Results extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            showLoadingState: this.props.loading,
        };
        /** The timeout ID between entering the loading state, and changing UI */
        this.loadingTimeoutId = 0;
        this.onDownload = () => {
            // GA can’t do floats. So we round to ints. We're deliberately rounding to nearest kilobyte to
            // avoid cases where exact image sizes leak something interesting about the user.
            const before = Math.round(this.props.source.file.size / 1024);
            const after = Math.round(this.props.imageFile.size / 1024);
            const change = Math.round((after / before) * 1000);
            ga('send', 'event', 'compression', 'download', {
                metric1: before,
                metric2: after,
                metric3: change,
            });
        };
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.loading && !this.props.loading) {
            // Just stopped loading
            clearTimeout(this.loadingTimeoutId);
            this.setState({ showLoadingState: false });
        }
        else if (!prevProps.loading && this.props.loading) {
            // Just started loading
            this.loadingTimeoutId = self.setTimeout(() => this.setState({ showLoadingState: true }), loadingReactionDelay);
        }
    }
    render({ source, imageFile, downloadUrl, flipSide, typeLabel }, { showLoadingState }) {
        const prettySize = imageFile && prettyBytes(imageFile.size);
        const isOriginal = !source || !imageFile || source.file === imageFile;
        let diff;
        let percent;
        if (source && imageFile) {
            diff = imageFile.size / source.file.size;
            const absolutePercent = Math.round(Math.abs(diff) * 100);
            percent = diff > 1 ? absolutePercent - 100 : 100 - absolutePercent;
        }
        return (h("div", { class: (flipSide ? style.resultsRight : style.resultsLeft) +
                ' ' +
                (isOriginal ? style.isOriginal : '') },
            h("div", { class: style.expandArrow },
                h(Arrow, null)),
            h("div", { class: style.bubble },
                h("div", { class: style.bubbleInner },
                    h("div", { class: style.sizeInfo },
                        h("div", { class: style.fileSize }, prettySize ? (h(Fragment, null,
                            prettySize.value,
                            ' ',
                            h("span", { class: style.unit }, prettySize.unit),
                            h("span", { class: style.typeLabel },
                                " ",
                                typeLabel))) : ('…'))),
                    h("div", { class: style.percentInfo },
                        h("svg", { viewBox: "0 0 1 2", class: style.bigArrow, preserveAspectRatio: "none" },
                            h("path", { d: "M1 0v2L0 1z" })),
                        h("div", { class: style.percentOutput },
                            diff && diff !== 1 && (h("span", { class: style.sizeDirection }, diff < 1 ? '↓' : '↑')),
                            h("span", { class: style.sizeValue }, percent || 0),
                            h("span", { class: style.percentChar }, "%"))))),
            h("a", { class: showLoadingState ? style.downloadDisable : style.download, href: downloadUrl, download: imageFile ? imageFile.name : '', title: "Download", onClick: this.onDownload },
                h("svg", { class: style.downloadBlobs, viewBox: "0 0 89.6 86.9" },
                    h("title", null, "Download"),
                    h("path", { d: "M27.3 72c-8-4-15.6-12.3-16.9-21-1.2-8.7 4-17.8 10.5-26s14.4-15.6 24-16 21.2 6 28.6 16.5c7.4 10.5 10.8 25 6.6 34S64.1 71.8 54 73.6c-10.2 2-18.7 2.3-26.7-1.6z" }),
                    h("path", { d: "M19.8 24.8c4.3-7.8 13-15 21.8-15.7 8.7-.8 17.5 4.8 25.4 11.8 7.8 6.9 14.8 15.2 14.7 24.9s-7.1 20.7-18 27.6c-10.8 6.8-25.5 9.5-34.2 4.8S18.1 61.6 16.7 51.4c-1.3-10.3-1.3-18.8 3-26.6z" })),
                h("div", { class: style.downloadIcon },
                    h(DownloadIcon, null)),
                showLoadingState && h("loading-spinner", null))));
    }
}
