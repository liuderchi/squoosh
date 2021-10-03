import { h, Component } from 'preact';
import { inputFieldCheckedAsNumber, inputFieldValueAsNumber, preventDefault, } from 'client/lazy-app/util';
import * as style from 'client/lazy-app/Compress/Options/style.css';
import linkState from 'linkstate';
import Range from 'client/lazy-app/Compress/Options/Range';
import Checkbox from 'client/lazy-app/Compress/Options/Checkbox';
import Expander from 'client/lazy-app/Compress/Options/Expander';
import Select from 'client/lazy-app/Compress/Options/Select';
import Revealer from 'client/lazy-app/Compress/Options/Revealer';
export const encode = (signal, workerBridge, imageData, options) => workerBridge.webpEncode(signal, imageData, options);
// From kLosslessPresets in config_enc.c
// The format is [method, quality].
const losslessPresets = [
    [0, 0],
    [1, 20],
    [2, 25],
    [3, 30],
    [3, 50],
    [4, 50],
    [4, 75],
    [4, 90],
    [5, 90],
    [6, 100],
];
const losslessPresetDefault = 6;
function determineLosslessQuality(quality, method) {
    const index = losslessPresets.findIndex(([presetMethod, presetQuality]) => presetMethod === method && presetQuality === quality);
    if (index !== -1)
        return index;
    // Quality doesn't match one of the presets.
    // This can happen when toggling 'lossless'.
    return losslessPresetDefault;
}
export class Options extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            showAdvanced: false,
        };
        this.onChange = (event) => {
            const form = event.currentTarget.closest('form');
            const lossless = inputFieldCheckedAsNumber(form.lossless);
            const { options } = this.props;
            const losslessPresetValue = inputFieldValueAsNumber(form.lossless_preset, determineLosslessQuality(options.quality, options.method));
            const newOptions = {
                // Copy over options the form doesn't care about, eg emulate_jpeg_size
                ...options,
                // And now stuff from the form:
                lossless,
                // Special-cased inputs:
                // In lossless mode, the quality is derived from the preset.
                quality: lossless
                    ? losslessPresets[losslessPresetValue][1]
                    : inputFieldValueAsNumber(form.quality, options.quality),
                // In lossless mode, the method is derived from the preset.
                method: lossless
                    ? losslessPresets[losslessPresetValue][0]
                    : inputFieldValueAsNumber(form.method_input, options.method),
                image_hint: inputFieldCheckedAsNumber(form.image_hint, options.image_hint)
                    ? 3 /* WEBP_HINT_GRAPH */
                    : 0 /* WEBP_HINT_DEFAULT */,
                // .checked
                exact: inputFieldCheckedAsNumber(form.exact, options.exact),
                alpha_compression: inputFieldCheckedAsNumber(form.alpha_compression, options.alpha_compression),
                autofilter: inputFieldCheckedAsNumber(form.autofilter, options.autofilter),
                filter_type: inputFieldCheckedAsNumber(form.filter_type, options.filter_type),
                use_sharp_yuv: inputFieldCheckedAsNumber(form.use_sharp_yuv, options.use_sharp_yuv),
                // .value
                near_lossless: 100 -
                    inputFieldValueAsNumber(form.near_lossless, 100 - options.near_lossless),
                alpha_quality: inputFieldValueAsNumber(form.alpha_quality, options.alpha_quality),
                alpha_filtering: inputFieldValueAsNumber(form.alpha_filtering, options.alpha_filtering),
                sns_strength: inputFieldValueAsNumber(form.sns_strength, options.sns_strength),
                filter_strength: inputFieldValueAsNumber(form.filter_strength, options.filter_strength),
                filter_sharpness: 7 -
                    inputFieldValueAsNumber(form.filter_sharpness, 7 - options.filter_sharpness),
                pass: inputFieldValueAsNumber(form.pass, options.pass),
                preprocessing: inputFieldValueAsNumber(form.preprocessing, options.preprocessing),
                segments: inputFieldValueAsNumber(form.segments, options.segments),
                partitions: inputFieldValueAsNumber(form.partitions, options.partitions),
            };
            this.props.onChange(newOptions);
        };
    }
    _losslessSpecificOptions(options) {
        return (h("div", { key: "lossless" },
            h("div", { class: style.optionOneCell },
                h(Range, { name: "lossless_preset", min: "0", max: "9", value: determineLosslessQuality(options.quality, options.method), onInput: this.onChange }, "Effort:")),
            h("div", { class: style.optionOneCell },
                h(Range, { name: "near_lossless", min: "0", max: "100", value: '' + (100 - options.near_lossless), onInput: this.onChange }, "Slight loss:")),
            h("label", { class: style.optionToggle },
                "Discrete tone image",
                h(Checkbox, { name: "image_hint", checked: options.image_hint === 3 /* WEBP_HINT_GRAPH */, onChange: this.onChange }))));
    }
    _lossySpecificOptions(options) {
        const { showAdvanced } = this.state;
        return (h("div", { key: "lossy" },
            h("div", { class: style.optionOneCell },
                h(Range, { name: "method_input", min: "0", max: "6", value: options.method, onInput: this.onChange }, "Effort:")),
            h("div", { class: style.optionOneCell },
                h(Range, { name: "quality", min: "0", max: "100", step: "0.1", value: options.quality, onInput: this.onChange }, "Quality:")),
            h("label", { class: style.optionReveal },
                h(Revealer, { checked: showAdvanced, onChange: linkState(this, 'showAdvanced') }),
                "Advanced settings"),
            h(Expander, null, showAdvanced ? (h("div", null,
                h("label", { class: style.optionToggle },
                    "Compress alpha",
                    h(Checkbox, { name: "alpha_compression", checked: !!options.alpha_compression, onChange: this.onChange })),
                h("div", { class: style.optionOneCell },
                    h(Range, { name: "alpha_quality", min: "0", max: "100", value: options.alpha_quality, onInput: this.onChange }, "Alpha quality:")),
                h("div", { class: style.optionOneCell },
                    h(Range, { name: "alpha_filtering", min: "0", max: "2", value: options.alpha_filtering, onInput: this.onChange }, "Alpha filter quality:")),
                h("label", { class: style.optionToggle },
                    "Auto adjust filter strength",
                    h(Checkbox, { name: "autofilter", checked: !!options.autofilter, onChange: this.onChange })),
                h(Expander, null, options.autofilter ? null : (h("div", { class: style.optionOneCell },
                    h(Range, { name: "filter_strength", min: "0", max: "100", value: options.filter_strength, onInput: this.onChange }, "Filter strength:")))),
                h("label", { class: style.optionToggle },
                    "Strong filter",
                    h(Checkbox, { name: "filter_type", checked: !!options.filter_type, onChange: this.onChange })),
                h("div", { class: style.optionOneCell },
                    h(Range, { name: "filter_sharpness", min: "0", max: "7", value: 7 - options.filter_sharpness, onInput: this.onChange }, "Filter sharpness:")),
                h("label", { class: style.optionToggle },
                    "Sharp RGB\u2192YUV conversion",
                    h(Checkbox, { name: "use_sharp_yuv", checked: !!options.use_sharp_yuv, onChange: this.onChange })),
                h("div", { class: style.optionOneCell },
                    h(Range, { name: "pass", min: "1", max: "10", value: options.pass, onInput: this.onChange }, "Passes:")),
                h("div", { class: style.optionOneCell },
                    h(Range, { name: "sns_strength", min: "0", max: "100", value: options.sns_strength, onInput: this.onChange }, "Spatial noise shaping:")),
                h("label", { class: style.optionTextFirst },
                    "Preprocess:",
                    h(Select, { name: "preprocessing", value: options.preprocessing, onChange: this.onChange },
                        h("option", { value: "0" }, "None"),
                        h("option", { value: "1" }, "Segment smooth"),
                        h("option", { value: "2" }, "Pseudo-random dithering"))),
                h("div", { class: style.optionOneCell },
                    h(Range, { name: "segments", min: "1", max: "4", value: options.segments, onInput: this.onChange }, "Segments:")),
                h("div", { class: style.optionOneCell },
                    h(Range, { name: "partitions", min: "0", max: "3", value: options.partitions, onInput: this.onChange }, "Partitions:")))) : null)));
    }
    render({ options }) {
        // I'm rendering both lossy and lossless forms, as it becomes much easier when
        // gathering the data.
        return (h("form", { class: style.optionsSection, onSubmit: preventDefault },
            h("label", { class: style.optionToggle },
                "Lossless",
                h(Checkbox, { name: "lossless", checked: !!options.lossless, onChange: this.onChange })),
            options.lossless
                ? this._losslessSpecificOptions(options)
                : this._lossySpecificOptions(options),
            h("label", { class: style.optionToggle },
                "Preserve transparent data",
                h(Checkbox, { name: "exact", checked: !!options.exact, onChange: this.onChange }))));
    }
}
