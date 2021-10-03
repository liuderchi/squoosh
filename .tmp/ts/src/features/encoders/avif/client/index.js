import { defaultOptions } from '../shared/meta';
import { h, Component } from 'preact';
import { preventDefault, shallowEqual } from 'client/lazy-app/util';
import * as style from 'client/lazy-app/Compress/Options/style.css';
import Checkbox from 'client/lazy-app/Compress/Options/Checkbox';
import Expander from 'client/lazy-app/Compress/Options/Expander';
import Select from 'client/lazy-app/Compress/Options/Select';
import Range from 'client/lazy-app/Compress/Options/Range';
import linkState from 'linkstate';
import Revealer from 'client/lazy-app/Compress/Options/Revealer';
export const encode = (signal, workerBridge, imageData, options) => workerBridge.avifEncode(signal, imageData, options);
const maxQuant = 63;
const maxSpeed = 10;
export class Options extends Component {
    constructor() {
        super(...arguments);
        // The rest of the defaults are set in getDerivedStateFromProps
        this.state = {
            showAdvanced: false,
        };
        this._inputChangeCallbacks = new Map();
        this._inputChange = (prop, type) => {
            // Cache the callback for performance
            if (!this._inputChangeCallbacks.has(prop)) {
                this._inputChangeCallbacks.set(prop, (event) => {
                    const formEl = event.target;
                    const newVal = type === 'boolean'
                        ? 'checked' in formEl
                            ? formEl.checked
                            : !!formEl.value
                        : type === 'number'
                            ? Number(formEl.value)
                            : formEl.value;
                    const newState = {
                        [prop]: newVal,
                    };
                    const optionState = {
                        ...this.state,
                        ...newState,
                    };
                    const newOptions = {
                        cqLevel: optionState.lossless ? 0 : maxQuant - optionState.quality,
                        cqAlphaLevel: optionState.lossless || !optionState.separateAlpha
                            ? -1
                            : maxQuant - optionState.alphaQuality,
                        // Always set to 4:4:4 if lossless
                        subsample: optionState.lossless ? 3 : optionState.subsample,
                        tileColsLog2: optionState.tileCols,
                        tileRowsLog2: optionState.tileRows,
                        speed: maxSpeed - optionState.effort,
                        chromaDeltaQ: optionState.chromaDeltaQ,
                        sharpness: optionState.sharpness,
                        denoiseLevel: optionState.denoiseLevel,
                        tune: optionState.tune,
                    };
                    // Updating options, so we don't recalculate in getDerivedStateFromProps.
                    newState.options = newOptions;
                    this.setState(
                    // It isn't clear to me why I have to cast this :)
                    newState);
                    this.props.onChange(newOptions);
                });
            }
            return this._inputChangeCallbacks.get(prop);
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (state.options && shallowEqual(state.options, props.options)) {
            return null;
        }
        const { options } = props;
        const lossless = options.cqLevel === 0 &&
            options.cqAlphaLevel <= 0 &&
            options.subsample == 3;
        const separateAlpha = options.cqAlphaLevel !== -1;
        const cqLevel = lossless ? defaultOptions.cqLevel : options.cqLevel;
        // Create default form state from options
        return {
            options,
            lossless,
            quality: maxQuant - cqLevel,
            separateAlpha,
            alphaQuality: maxQuant -
                (separateAlpha ? options.cqAlphaLevel : defaultOptions.cqLevel),
            subsample: options.subsample === 0 || lossless
                ? defaultOptions.subsample
                : options.subsample,
            tileRows: options.tileRowsLog2,
            tileCols: options.tileColsLog2,
            effort: maxSpeed - options.speed,
            chromaDeltaQ: options.chromaDeltaQ,
            sharpness: options.sharpness,
            denoiseLevel: options.denoiseLevel,
            tune: options.tune,
        };
    }
    render(_, { effort, lossless, alphaQuality, separateAlpha, quality, showAdvanced, subsample, tileCols, tileRows, chromaDeltaQ, sharpness, denoiseLevel, tune, }) {
        return (h("form", { class: style.optionsSection, onSubmit: preventDefault },
            h("label", { class: style.optionToggle },
                "Lossless",
                h(Checkbox, { checked: lossless, onChange: this._inputChange('lossless', 'boolean') })),
            h(Expander, null, !lossless && (h("div", { class: style.optionOneCell },
                h(Range, { min: "0", max: "63", value: quality, onInput: this._inputChange('quality', 'number') }, "Quality:")))),
            h("label", { class: style.optionReveal },
                h(Revealer, { checked: showAdvanced, onChange: linkState(this, 'showAdvanced') }),
                "Advanced settings"),
            h(Expander, null, showAdvanced && (h("div", null,
                h(Expander, null, !lossless && (h("div", null,
                    h("label", { class: style.optionTextFirst },
                        "Subsample chroma:",
                        h(Select, { value: subsample, onChange: this._inputChange('subsample', 'number') },
                            h("option", { value: "1" }, "Half"),
                            h("option", { value: "3" }, "Off"))),
                    h("label", { class: style.optionToggle },
                        "Separate alpha quality",
                        h(Checkbox, { checked: separateAlpha, onChange: this._inputChange('separateAlpha', 'boolean') })),
                    h(Expander, null, separateAlpha && (h("div", { class: style.optionOneCell },
                        h(Range, { min: "0", max: "63", value: alphaQuality, onInput: this._inputChange('alphaQuality', 'number') }, "Alpha quality:")))),
                    h("label", { class: style.optionToggle },
                        "Extra chroma compression",
                        h(Checkbox, { checked: chromaDeltaQ, onChange: this._inputChange('chromaDeltaQ', 'boolean') })),
                    h("div", { class: style.optionOneCell },
                        h(Range, { min: "0", max: "7", value: sharpness, onInput: this._inputChange('sharpness', 'number') }, "Sharpness:")),
                    h("div", { class: style.optionOneCell },
                        h(Range, { min: "0", max: "50", value: denoiseLevel, onInput: this._inputChange('denoiseLevel', 'number') }, "Noise synthesis:")),
                    h("label", { class: style.optionTextFirst },
                        "Tuning:",
                        h(Select, { value: tune, onChange: this._inputChange('tune', 'number') },
                            h("option", { value: 0 /* auto */ }, "Auto"),
                            h("option", { value: 1 /* psnr */ }, "PSNR"),
                            h("option", { value: 2 /* ssim */ }, "SSIM")))))),
                h("div", { class: style.optionOneCell },
                    h(Range, { min: "0", max: "6", value: tileRows, onInput: this._inputChange('tileRows', 'number') }, "Log2 of tile rows:")),
                h("div", { class: style.optionOneCell },
                    h(Range, { min: "0", max: "6", value: tileCols, onInput: this._inputChange('tileCols', 'number') }, "Log2 of tile cols:"))))),
            h("div", { class: style.optionOneCell },
                h(Range, { min: "0", max: "10", value: effort, onInput: this._inputChange('effort', 'number') }, "Effort:"))));
    }
}
