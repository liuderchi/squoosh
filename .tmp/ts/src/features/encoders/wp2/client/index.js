import { defaultOptions } from '../shared/meta';
import { h, Component } from 'preact';
import { preventDefault, shallowEqual } from 'client/lazy-app/util';
import * as style from 'client/lazy-app/Compress/Options/style.css';
import Range from 'client/lazy-app/Compress/Options/Range';
import Select from 'client/lazy-app/Compress/Options/Select';
import Checkbox from 'client/lazy-app/Compress/Options/Checkbox';
import Expander from 'client/lazy-app/Compress/Options/Expander';
import linkState from 'linkstate';
import Revealer from 'client/lazy-app/Compress/Options/Revealer';
export const encode = (signal, workerBridge, imageData, options) => workerBridge.wp2Encode(signal, imageData, options);
export class Options extends Component {
    constructor() {
        super(...arguments);
        // Other state is set in getDerivedStateFromProps
        this.state = {
            lossless: false,
            slightLoss: 0,
            quality: defaultOptions.quality,
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
                        : Number(formEl.value);
                    const newState = {
                        [prop]: newVal,
                    };
                    const optionState = {
                        ...this.state,
                        ...newState,
                    };
                    const newOptions = {
                        effort: optionState.effort,
                        quality: optionState.lossless
                            ? 100 - optionState.slightLoss
                            : optionState.quality,
                        alpha_quality: optionState.separateAlpha
                            ? optionState.alphaQuality
                            : optionState.quality,
                        pass: optionState.passes,
                        sns: optionState.sns,
                        uv_mode: optionState.uvMode,
                        csp_type: optionState.colorSpace,
                        error_diffusion: optionState.errorDiffusion,
                        use_random_matrix: optionState.useRandomMatrix,
                    };
                    // Updating options, so we don't recalculate in getDerivedStateFromProps.
                    newState.options = newOptions;
                    this.setState(newState);
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
        const modifyState = {
            options,
            effort: options.effort,
            alphaQuality: options.alpha_quality,
            passes: options.pass,
            sns: options.sns,
            uvMode: options.uv_mode,
            colorSpace: options.csp_type,
            errorDiffusion: options.error_diffusion,
            useRandomMatrix: options.use_random_matrix,
            separateAlpha: options.quality !== options.alpha_quality,
        };
        // If quality is > 95, it's lossless with slight loss
        if (options.quality > 95) {
            modifyState.lossless = true;
            modifyState.slightLoss = 100 - options.quality;
        }
        else {
            modifyState.quality = options.quality;
            modifyState.lossless = false;
        }
        return modifyState;
    }
    render({}, { effort, alphaQuality, passes, quality, sns, uvMode, lossless, slightLoss, colorSpace, errorDiffusion, useRandomMatrix, separateAlpha, showAdvanced, }) {
        return (h("form", { class: style.optionsSection, onSubmit: preventDefault },
            h("label", { class: style.optionToggle },
                "Lossless",
                h(Checkbox, { checked: lossless, onChange: this._inputChange('lossless', 'boolean') })),
            h(Expander, null, lossless && (h("div", { class: style.optionOneCell },
                h(Range, { min: "0", max: "5", step: "0.1", value: slightLoss, onInput: this._inputChange('slightLoss', 'number') }, "Slight loss:")))),
            h(Expander, null, !lossless && (h("div", null,
                h("div", { class: style.optionOneCell },
                    h(Range, { min: "0", max: "95", step: "0.1", value: quality, onInput: this._inputChange('quality', 'number') }, "Quality:")),
                h("label", { class: style.optionToggle },
                    "Separate alpha quality",
                    h(Checkbox, { checked: separateAlpha, onChange: this._inputChange('separateAlpha', 'boolean') })),
                h(Expander, null, separateAlpha && (h("div", { class: style.optionOneCell },
                    h(Range, { min: "0", max: "100", step: "1", value: alphaQuality, onInput: this._inputChange('alphaQuality', 'number') }, "Alpha Quality:")))),
                h("label", { class: style.optionReveal },
                    h(Revealer, { checked: showAdvanced, onChange: linkState(this, 'showAdvanced') }),
                    "Advanced settings"),
                h(Expander, null, showAdvanced && (h("div", null,
                    h("div", { class: style.optionOneCell },
                        h(Range, { min: "1", max: "10", step: "1", value: passes, onInput: this._inputChange('passes', 'number') }, "Passes:")),
                    h("div", { class: style.optionOneCell },
                        h(Range, { min: "0", max: "100", step: "1", value: sns, onInput: this._inputChange('sns', 'number') }, "Spatial noise shaping:")),
                    h("div", { class: style.optionOneCell },
                        h(Range, { min: "0", max: "100", step: "1", value: errorDiffusion, onInput: this._inputChange('errorDiffusion', 'number') }, "Error diffusion:")),
                    h("label", { class: style.optionTextFirst },
                        "Subsample chroma:",
                        h(Select, { value: uvMode, onInput: this._inputChange('uvMode', 'number') },
                            h("option", { value: 3 /* UVModeAuto */ }, "Auto"),
                            h("option", { value: 0 /* UVModeAdapt */ }, "Vary"),
                            h("option", { value: 1 /* UVMode420 */ }, "Half"),
                            h("option", { value: 2 /* UVMode444 */ }, "Off"))),
                    h("label", { class: style.optionTextFirst },
                        "Color space:",
                        h(Select, { value: colorSpace, onInput: this._inputChange('colorSpace', 'number') },
                            h("option", { value: 0 /* kYCoCg */ }, "YCoCg"),
                            h("option", { value: 1 /* kYCbCr */ }, "YCbCr"),
                            h("option", { value: 3 /* kYIQ */ }, "YIQ"))),
                    h("label", { class: style.optionToggle },
                        "Random matrix",
                        h(Checkbox, { checked: useRandomMatrix, onChange: this._inputChange('useRandomMatrix', 'boolean') })))))))),
            h("div", { class: style.optionOneCell },
                h(Range, { min: "0", max: "9", step: "1", value: effort, onInput: this._inputChange('effort', 'number') }, "Effort:"))));
    }
}
