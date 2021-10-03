import { h, Component } from 'preact';
import * as style from './style.css';
import 'add-css:./style.css';
import { blobToImg, blobToText, builtinDecode, sniffMimeType, canDecodeImageType, abortable, assertSignal, } from '../util';
import { encoderMap, defaultPreprocessorState, defaultProcessorState, } from '../feature-meta';
import Output from './Output';
import Options from './Options';
import ResultCache from './result-cache';
import { cleanMerge, cleanSet } from '../util/clean-modify';
import './custom-els/MultiPanel';
import Results from './Results';
import WorkerBridge from '../worker-bridge';
import { resize } from 'features/processors/resize/client';
import { generateCliInvocation } from '../util/cli';
import { drawableToImageData } from '../util/canvas';
async function decodeImage(signal, blob, workerBridge) {
    assertSignal(signal);
    const mimeType = await abortable(signal, sniffMimeType(blob));
    const canDecode = await abortable(signal, canDecodeImageType(mimeType));
    try {
        if (!canDecode) {
            if (mimeType === 'image/avif') {
                return await workerBridge.avifDecode(signal, blob);
            }
            if (mimeType === 'image/webp') {
                return await workerBridge.webpDecode(signal, blob);
            }
            if (mimeType === 'image/jxl') {
                return await workerBridge.jxlDecode(signal, blob);
            }
            if (mimeType === 'image/webp2') {
                return await workerBridge.wp2Decode(signal, blob);
            }
        }
        // Otherwise fall through and try built-in decoding for a laugh.
        return await builtinDecode(signal, blob, mimeType);
    }
    catch (err) {
        if (err.name === 'AbortError')
            throw err;
        console.log(err);
        throw Error("Couldn't decode image");
    }
}
async function preprocessImage(signal, data, preprocessorState, workerBridge) {
    assertSignal(signal);
    let processedData = data;
    if (preprocessorState.rotate.rotate !== 0) {
        processedData = await workerBridge.rotate(signal, processedData, preprocessorState.rotate);
    }
    return processedData;
}
async function processImage(signal, source, processorState, workerBridge) {
    assertSignal(signal);
    let result = source.preprocessed;
    if (processorState.resize.enabled) {
        result = await resize(signal, source, processorState.resize, workerBridge);
    }
    if (processorState.quantize.enabled) {
        result = await workerBridge.quantize(signal, result, processorState.quantize);
    }
    return result;
}
async function compressImage(signal, image, encodeData, sourceFilename, workerBridge) {
    assertSignal(signal);
    const encoder = encoderMap[encodeData.type];
    const compressedData = await encoder.encode(signal, workerBridge, image, 
    // The type of encodeData.options is enforced via the previous line
    encodeData.options);
    // This type ensures the image mimetype is consistent with our mimetype sniffer
    const type = encoder.meta.mimeType;
    return new File([compressedData], sourceFilename.replace(/.[^.]*$/, `.${encoder.meta.extension}`), { type });
}
function stateForNewSourceData(state) {
    let newState = { ...state };
    for (const i of [0, 1]) {
        // Ditch previous encodings
        const downloadUrl = state.sides[i].downloadUrl;
        if (downloadUrl)
            URL.revokeObjectURL(downloadUrl);
        newState = cleanMerge(state, `sides.${i}`, {
            preprocessed: undefined,
            file: undefined,
            downloadUrl: undefined,
            data: undefined,
            encodedSettings: undefined,
        });
    }
    return newState;
}
async function processSvg(signal, blob) {
    assertSignal(signal);
    // Firefox throws if you try to draw an SVG to canvas that doesn't have width/height.
    // In Chrome it loads, but drawImage behaves weirdly.
    // This function sets width/height if it isn't already set.
    const parser = new DOMParser();
    const text = await abortable(signal, blobToText(blob));
    const document = parser.parseFromString(text, 'image/svg+xml');
    const svg = document.documentElement;
    if (svg.hasAttribute('width') && svg.hasAttribute('height')) {
        return blobToImg(blob);
    }
    const viewBox = svg.getAttribute('viewBox');
    if (viewBox === null)
        throw Error('SVG must have width/height or viewBox');
    const viewboxParts = viewBox.split(/\s+/);
    svg.setAttribute('width', viewboxParts[2]);
    svg.setAttribute('height', viewboxParts[3]);
    const serializer = new XMLSerializer();
    const newSource = serializer.serializeToString(document);
    return abortable(signal, blobToImg(new Blob([newSource], { type: 'image/svg+xml' })));
}
/**
 * If two processors are disabled, they're considered equivalent, otherwise
 * equivalence is based on ===
 */
function processorStateEquivalent(a, b) {
    // Quick exit
    if (a === b)
        return true;
    // All processors have the same keys
    for (const key of Object.keys(a)) {
        // If both processors are disabled, they're the same.
        if (!a[key].enabled && !b[key].enabled)
            continue;
        if (a !== b)
            return false;
    }
    return true;
}
const loadingIndicator = '⏳ ';
const originalDocumentTitle = document.title;
function updateDocumentTitle(loadingFileInfo) {
    const { loading, filename } = loadingFileInfo;
    let title = '';
    if (loading)
        title += loadingIndicator;
    if (filename)
        title += filename + ' - ';
    title += originalDocumentTitle;
    document.title = title;
}
export default class Compress extends Component {
    constructor(props) {
        super(props);
        this.widthQuery = window.matchMedia('(max-width: 599px)');
        this.state = {
            source: undefined,
            loading: false,
            preprocessorState: defaultPreprocessorState,
            sides: [
                {
                    latestSettings: {
                        processorState: defaultProcessorState,
                        encoderState: undefined,
                    },
                    loading: false,
                },
                {
                    latestSettings: {
                        processorState: defaultProcessorState,
                        encoderState: {
                            type: 'mozJPEG',
                            options: encoderMap.mozJPEG.meta.defaultOptions,
                        },
                    },
                    loading: false,
                },
            ],
            mobileView: this.widthQuery.matches,
        };
        this.encodeCache = new ResultCache();
        // One for each side
        this.workerBridges = [new WorkerBridge(), new WorkerBridge()];
        /** Abort controller for actions that impact both sites, like source image decoding and preprocessing */
        this.mainAbortController = new AbortController();
        // And again one for each side
        this.sideAbortControllers = [new AbortController(), new AbortController()];
        this.onMobileWidthChange = () => {
            this.setState({ mobileView: this.widthQuery.matches });
        };
        this.onEncoderTypeChange = (index, newType) => {
            this.setState({
                sides: cleanSet(this.state.sides, `${index}.latestSettings.encoderState`, newType === 'identity'
                    ? undefined
                    : {
                        type: newType,
                        options: encoderMap[newType].meta.defaultOptions,
                    }),
            });
        };
        this.onProcessorOptionsChange = (index, options) => {
            this.setState({
                sides: cleanSet(this.state.sides, `${index}.latestSettings.processorState`, options),
            });
        };
        this.onEncoderOptionsChange = (index, options) => {
            this.setState({
                sides: cleanSet(this.state.sides, `${index}.latestSettings.encoderState.options`, options),
            });
        };
        this.onCopyToOtherClick = async (index) => {
            const otherIndex = index ? 0 : 1;
            const oldSettings = this.state.sides[otherIndex];
            const newSettings = { ...this.state.sides[index] };
            // Create a new object URL for the new settings. This avoids both sides sharing a URL, which
            // means it can be safely revoked without impacting the other side.
            if (newSettings.file) {
                newSettings.downloadUrl = URL.createObjectURL(newSettings.file);
            }
            this.setState({
                sides: cleanSet(this.state.sides, otherIndex, newSettings),
            });
            const result = await this.props.showSnack('Settings copied across', {
                timeout: 5000,
                actions: ['undo', 'dismiss'],
            });
            if (result !== 'undo')
                return;
            this.setState({
                sides: cleanSet(this.state.sides, otherIndex, oldSettings),
            });
        };
        this.onPreprocessorChange = async (preprocessorState) => {
            const source = this.state.source;
            if (!source)
                return;
            const oldRotate = this.state.preprocessorState.rotate.rotate;
            const newRotate = preprocessorState.rotate.rotate;
            const orientationChanged = oldRotate % 180 !== newRotate % 180;
            this.setState((state) => ({
                loading: true,
                preprocessorState,
                // Flip resize values if orientation has changed
                sides: !orientationChanged
                    ? state.sides
                    : state.sides.map((side) => {
                        const currentResizeSettings = side.latestSettings.processorState.resize;
                        const resizeSettings = {
                            width: currentResizeSettings.height,
                            height: currentResizeSettings.width,
                        };
                        return cleanMerge(side, 'latestSettings.processorState.resize', resizeSettings);
                    }),
            }));
        };
        this.onCopyCliClick = async (index) => {
            try {
                const cliInvocation = generateCliInvocation(this.state.sides[index].latestSettings.encoderState, this.state.sides[index].latestSettings.processorState);
                await navigator.clipboard.writeText(cliInvocation);
                const result = await this.props.showSnack('CLI command copied to clipboard', {
                    timeout: 8000,
                    actions: ['usage', 'dismiss'],
                });
                if (result === 'usage') {
                    open('https://github.com/GoogleChromeLabs/squoosh/tree/dev/cli');
                }
            }
            catch (e) {
                this.props.showSnack(e);
            }
        };
        /** The in-progress job for each side (processing and encoding) */
        this.activeSideJobs = [undefined, undefined];
        this.widthQuery.addListener(this.onMobileWidthChange);
        this.sourceFile = props.file;
        this.queueUpdateImage({ immediate: true });
        import('../sw-bridge').then(({ mainAppLoaded }) => mainAppLoaded());
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.file !== this.props.file) {
            this.sourceFile = nextProps.file;
            this.queueUpdateImage({ immediate: true });
        }
    }
    componentWillUnmount() {
        updateDocumentTitle({ loading: false });
        this.widthQuery.removeListener(this.onMobileWidthChange);
        this.mainAbortController.abort();
        for (const controller of this.sideAbortControllers) {
            controller.abort();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        var _a;
        const wasLoading = prevState.loading ||
            prevState.sides[0].loading ||
            prevState.sides[1].loading;
        const isLoading = this.state.loading ||
            this.state.sides[0].loading ||
            this.state.sides[1].loading;
        const sourceChanged = prevState.source !== this.state.source;
        if (wasLoading !== isLoading || sourceChanged) {
            updateDocumentTitle({
                loading: isLoading,
                filename: (_a = this.state.source) === null || _a === void 0 ? void 0 : _a.file.name,
            });
        }
        this.queueUpdateImage();
    }
    /**
     * Debounce the heavy lifting of updateImage.
     * Otherwise, the thrashing causes jank, and sometimes crashes iOS Safari.
     */
    queueUpdateImage({ immediate } = {}) {
        // Call updateImage after this delay, unless queueUpdateImage is called
        // again, in which case the timeout is reset.
        const delay = 100;
        clearTimeout(this.updateImageTimeout);
        if (immediate) {
            this.updateImage();
        }
        else {
            this.updateImageTimeout = setTimeout(() => this.updateImage(), delay);
        }
    }
    /**
     * Perform image processing.
     *
     * This function is a monster, but I didn't want to break it up, because it
     * never gets partially called. Instead, it looks at the current state, and
     * decides which steps can be skipped, and which can be cached.
     */
    async updateImage() {
        const currentState = this.state;
        // State of the last completed job, or ongoing job
        const latestMainJobState = this.activeMainJob || {
            file: currentState.source && currentState.source.file,
            preprocessorState: currentState.encodedPreprocessorState,
        };
        const latestSideJobStates = currentState.sides.map((side, i) => this.activeSideJobs[i] || {
            processorState: side.encodedSettings && side.encodedSettings.processorState,
            encoderState: side.encodedSettings && side.encodedSettings.encoderState,
        });
        // State for this job
        const mainJobState = {
            file: this.sourceFile,
            preprocessorState: currentState.preprocessorState,
        };
        const sideJobStates = currentState.sides.map((side) => ({
            // If there isn't an encoder selected, we don't process either
            processorState: side.latestSettings.encoderState
                ? side.latestSettings.processorState
                : defaultProcessorState,
            encoderState: side.latestSettings.encoderState,
        }));
        // Figure out what needs doing:
        const needsDecoding = latestMainJobState.file != mainJobState.file;
        const needsPreprocessing = needsDecoding ||
            latestMainJobState.preprocessorState !== mainJobState.preprocessorState;
        const sideWorksNeeded = latestSideJobStates.map((latestSideJob, i) => {
            const needsProcessing = needsPreprocessing ||
                !latestSideJob.processorState ||
                // If we're going to or from 'original image' we should reprocess
                !!latestSideJob.encoderState !== !!sideJobStates[i].encoderState ||
                !processorStateEquivalent(latestSideJob.processorState, sideJobStates[i].processorState);
            return {
                processing: needsProcessing,
                encoding: needsProcessing ||
                    latestSideJob.encoderState !== sideJobStates[i].encoderState,
            };
        });
        let jobNeeded = false;
        // Abort running tasks & cycle the controllers
        if (needsDecoding || needsPreprocessing) {
            this.mainAbortController.abort();
            this.mainAbortController = new AbortController();
            jobNeeded = true;
            this.activeMainJob = mainJobState;
        }
        for (const [i, sideWorkNeeded] of sideWorksNeeded.entries()) {
            if (sideWorkNeeded.processing || sideWorkNeeded.encoding) {
                this.sideAbortControllers[i].abort();
                this.sideAbortControllers[i] = new AbortController();
                jobNeeded = true;
                this.activeSideJobs[i] = sideJobStates[i];
            }
        }
        if (!jobNeeded)
            return;
        const mainSignal = this.mainAbortController.signal;
        const sideSignals = this.sideAbortControllers.map((ac) => ac.signal);
        let decoded;
        let vectorImage;
        // Handle decoding
        if (needsDecoding) {
            try {
                assertSignal(mainSignal);
                this.setState({
                    source: undefined,
                    loading: true,
                });
                // Special-case SVG. We need to avoid createImageBitmap because of
                // https://bugs.chromium.org/p/chromium/issues/detail?id=606319.
                // Also, we cache the HTMLImageElement so we can perform vector resizing later.
                if (mainJobState.file.type.startsWith('image/svg+xml')) {
                    vectorImage = await processSvg(mainSignal, mainJobState.file);
                    decoded = drawableToImageData(vectorImage);
                }
                else {
                    decoded = await decodeImage(mainSignal, mainJobState.file, 
                    // Either worker is good enough here.
                    this.workerBridges[0]);
                }
                // Set default resize values
                this.setState((currentState) => {
                    if (mainSignal.aborted)
                        return {};
                    const sides = currentState.sides.map((side) => {
                        const resizeState = {
                            width: decoded.width,
                            height: decoded.height,
                            method: vectorImage ? 'vector' : 'lanczos3',
                            // Disable resizing, to make it clearer to the user that something changed here
                            enabled: false,
                        };
                        return cleanMerge(side, 'latestSettings.processorState.resize', resizeState);
                    });
                    return { sides };
                });
            }
            catch (err) {
                if (err.name === 'AbortError')
                    return;
                this.props.showSnack(`Source decoding error: ${err}`);
                throw err;
            }
        }
        else {
            ({ decoded, vectorImage } = currentState.source);
        }
        let source;
        // Handle preprocessing
        if (needsPreprocessing) {
            try {
                assertSignal(mainSignal);
                this.setState({
                    loading: true,
                });
                const preprocessed = await preprocessImage(mainSignal, decoded, mainJobState.preprocessorState, 
                // Either worker is good enough here.
                this.workerBridges[0]);
                source = {
                    decoded,
                    vectorImage,
                    preprocessed,
                    file: mainJobState.file,
                };
                // Update state for process completion, including intermediate render
                this.setState((currentState) => {
                    if (mainSignal.aborted)
                        return {};
                    let newState = {
                        ...currentState,
                        loading: false,
                        source,
                        encodedPreprocessorState: mainJobState.preprocessorState,
                        sides: currentState.sides.map((side) => {
                            if (side.downloadUrl)
                                URL.revokeObjectURL(side.downloadUrl);
                            const newSide = {
                                ...side,
                                // Intermediate render
                                data: preprocessed,
                                processed: undefined,
                                encodedSettings: undefined,
                            };
                            return newSide;
                        }),
                    };
                    newState = stateForNewSourceData(newState);
                    return newState;
                });
            }
            catch (err) {
                if (err.name === 'AbortError')
                    return;
                this.setState({ loading: false });
                this.props.showSnack(`Preprocessing error: ${err}`);
                throw err;
            }
        }
        else {
            source = currentState.source;
        }
        // That's the main part of the job done.
        this.activeMainJob = undefined;
        // Allow side jobs to happen in parallel
        sideWorksNeeded.forEach(async (sideWorkNeeded, sideIndex) => {
            try {
                // If processing is true, encoding is always true.
                if (!sideWorkNeeded.encoding)
                    return;
                const signal = sideSignals[sideIndex];
                const jobState = sideJobStates[sideIndex];
                const workerBridge = this.workerBridges[sideIndex];
                let file;
                let data;
                let processed = undefined;
                // If there's no encoder state, this is "original image", which also
                // doesn't allow processing.
                if (!jobState.encoderState) {
                    file = source.file;
                    data = source.preprocessed;
                }
                else {
                    const cacheResult = this.encodeCache.match(source.preprocessed, jobState.processorState, jobState.encoderState);
                    if (cacheResult) {
                        ({ file, processed, data } = cacheResult);
                    }
                    else {
                        // Set loading state for this side
                        this.setState((currentState) => {
                            if (signal.aborted)
                                return {};
                            const sides = cleanMerge(currentState.sides, sideIndex, {
                                loading: true,
                            });
                            return { sides };
                        });
                        if (sideWorkNeeded.processing) {
                            processed = await processImage(signal, source, jobState.processorState, workerBridge);
                            // Update state for process completion, including intermediate render
                            this.setState((currentState) => {
                                if (signal.aborted)
                                    return {};
                                const currentSide = currentState.sides[sideIndex];
                                const side = {
                                    ...currentSide,
                                    processed,
                                    // Intermediate render
                                    data: processed,
                                    encodedSettings: {
                                        ...currentSide.encodedSettings,
                                        processorState: jobState.processorState,
                                    },
                                };
                                const sides = cleanSet(currentState.sides, sideIndex, side);
                                return { sides };
                            });
                        }
                        else {
                            processed = currentState.sides[sideIndex].processed;
                        }
                        file = await compressImage(signal, processed, jobState.encoderState, source.file.name, workerBridge);
                        data = await decodeImage(signal, file, workerBridge);
                        this.encodeCache.add({
                            data,
                            processed,
                            file,
                            preprocessed: source.preprocessed,
                            encoderState: jobState.encoderState,
                            processorState: jobState.processorState,
                        });
                    }
                }
                this.setState((currentState) => {
                    if (signal.aborted)
                        return {};
                    const currentSide = currentState.sides[sideIndex];
                    if (currentSide.downloadUrl) {
                        URL.revokeObjectURL(currentSide.downloadUrl);
                    }
                    const side = {
                        ...currentSide,
                        data,
                        file,
                        downloadUrl: URL.createObjectURL(file),
                        loading: false,
                        processed,
                        encodedSettings: {
                            processorState: jobState.processorState,
                            encoderState: jobState.encoderState,
                        },
                    };
                    const sides = cleanSet(currentState.sides, sideIndex, side);
                    return { sides };
                });
                this.activeSideJobs[sideIndex] = undefined;
            }
            catch (err) {
                if (err.name === 'AbortError')
                    return;
                this.setState((currentState) => {
                    const sides = cleanMerge(currentState.sides, sideIndex, {
                        loading: false,
                    });
                    return { sides };
                });
                this.props.showSnack(`Processing error: ${err}`);
                throw err;
            }
        });
    }
    render({ onBack }, { loading, sides, source, mobileView, preprocessorState }) {
        const [leftSide, rightSide] = sides;
        const [leftImageData, rightImageData] = sides.map((i) => i.data);
        const options = sides.map((side, index) => (h(Options, { index: index, source: source, mobileView: mobileView, processorState: side.latestSettings.processorState, encoderState: side.latestSettings.encoderState, onEncoderTypeChange: this.onEncoderTypeChange, onEncoderOptionsChange: this.onEncoderOptionsChange, onProcessorOptionsChange: this.onProcessorOptionsChange, onCopyCliClick: this.onCopyCliClick, onCopyToOtherSideClick: this.onCopyToOtherClick })));
        const results = sides.map((side, index) => (h(Results, { downloadUrl: side.downloadUrl, imageFile: side.file, source: source, loading: loading || side.loading, flipSide: mobileView || index === 1, typeLabel: side.latestSettings.encoderState
                ? encoderMap[side.latestSettings.encoderState.type].meta.label
                : 'Original Image' })));
        // For rendering, we ideally want the settings that were used to create the
        // data, not the latest settings.
        const leftDisplaySettings = leftSide.encodedSettings || leftSide.latestSettings;
        const rightDisplaySettings = rightSide.encodedSettings || rightSide.latestSettings;
        const leftImgContain = leftDisplaySettings.processorState.resize.enabled &&
            leftDisplaySettings.processorState.resize.fitMethod === 'contain';
        const rightImgContain = rightDisplaySettings.processorState.resize.enabled &&
            rightDisplaySettings.processorState.resize.fitMethod === 'contain';
        return (h("div", { class: style.compress },
            h(Output, { source: source, mobileView: mobileView, leftCompressed: leftImageData, rightCompressed: rightImageData, leftImgContain: leftImgContain, rightImgContain: rightImgContain, preprocessorState: preprocessorState, onPreprocessorChange: this.onPreprocessorChange }),
            h("button", { class: style.back, onClick: onBack },
                h("svg", { viewBox: "0 0 61 53.3" },
                    h("title", null, "Back"),
                    h("path", { class: style.backBlob, d: "M0 25.6c-.5-7.1 4.1-14.5 10-19.1S23.4.1 32.2 0c8.8 0 19 1.6 24.4 8s5.6 17.8 1.7 27a29.7 29.7 0 01-20.5 18c-8.4 1.5-17.3-2.6-24.5-8S.5 32.6.1 25.6z" }),
                    h("path", { class: style.backX, d: "M41.6 17.1l-2-2.1-8.3 8.2-8.2-8.2-2 2 8.2 8.3-8.3 8.2 2.1 2 8.2-8.1 8.3 8.2 2-2-8.2-8.3z" }))),
            mobileView ? (h("div", { class: style.options },
                h("multi-panel", { class: style.multiPanel, "open-one-only": true },
                    h("div", { class: style.options1Theme }, results[0]),
                    h("div", { class: style.options1Theme }, options[0]),
                    h("div", { class: style.options2Theme }, results[1]),
                    h("div", { class: style.options2Theme }, options[1])))) : ([
                h("div", { class: style.options1, key: "options1" },
                    options[0],
                    results[0]),
                h("div", { class: style.options2, key: "options2" },
                    options[1],
                    results[1]),
            ])));
    }
}
