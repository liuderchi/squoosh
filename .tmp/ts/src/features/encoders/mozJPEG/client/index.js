import { h, Component } from 'preact';
import { inputFieldChecked, inputFieldValueAsNumber, preventDefault, } from 'client/lazy-app/util';
import * as style from 'client/lazy-app/Compress/Options/style.css';
import linkState from 'linkstate';
import Range from 'client/lazy-app/Compress/Options/Range';
import Checkbox from 'client/lazy-app/Compress/Options/Checkbox';
import Expander from 'client/lazy-app/Compress/Options/Expander';
import Select from 'client/lazy-app/Compress/Options/Select';
import Revealer from 'client/lazy-app/Compress/Options/Revealer';
export function encode(signal, workerBridge, imageData, options) {
    return workerBridge.mozjpegEncode(signal, imageData, options);
}
export class Options extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            showAdvanced: false,
        };
        this.onChange = (event) => {
            const form = event.currentTarget.closest('form');
            const { options } = this.props;
            const newOptions = {
                // Copy over options the form doesn't currently care about, eg arithmetic
                ...this.props.options,
                // And now stuff from the form:
                // .checked
                baseline: inputFieldChecked(form.baseline, options.baseline),
                progressive: inputFieldChecked(form.progressive, options.progressive),
                optimize_coding: inputFieldChecked(form.optimize_coding, options.optimize_coding),
                trellis_multipass: inputFieldChecked(form.trellis_multipass, options.trellis_multipass),
                trellis_opt_zero: inputFieldChecked(form.trellis_opt_zero, options.trellis_opt_zero),
                trellis_opt_table: inputFieldChecked(form.trellis_opt_table, options.trellis_opt_table),
                auto_subsample: inputFieldChecked(form.auto_subsample, options.auto_subsample),
                separate_chroma_quality: inputFieldChecked(form.separate_chroma_quality, options.separate_chroma_quality),
                // .value
                quality: inputFieldValueAsNumber(form.quality, options.quality),
                chroma_quality: inputFieldValueAsNumber(form.chroma_quality, options.chroma_quality),
                chroma_subsample: inputFieldValueAsNumber(form.chroma_subsample, options.chroma_subsample),
                smoothing: inputFieldValueAsNumber(form.smoothing, options.smoothing),
                color_space: inputFieldValueAsNumber(form.color_space, options.color_space),
                quant_table: inputFieldValueAsNumber(form.quant_table, options.quant_table),
                trellis_loops: inputFieldValueAsNumber(form.trellis_loops, options.trellis_loops),
            };
            this.props.onChange(newOptions);
        };
    }
    render({ options }, { showAdvanced }) {
        // I'm rendering both lossy and lossless forms, as it becomes much easier when
        // gathering the data.
        return (h("form", { class: style.optionsSection, onSubmit: preventDefault },
            h("div", { class: style.optionOneCell },
                h(Range, { name: "quality", min: "0", max: "100", value: options.quality, onInput: this.onChange }, "Quality:")),
            h("label", { class: style.optionReveal },
                h(Revealer, { checked: showAdvanced, onChange: linkState(this, 'showAdvanced') }),
                "Advanced settings"),
            h(Expander, null, showAdvanced ? (h("div", null,
                h("label", { class: style.optionTextFirst },
                    "Channels:",
                    h(Select, { name: "color_space", value: options.color_space, onChange: this.onChange },
                        h("option", { value: 1 /* GRAYSCALE */ }, "Grayscale"),
                        h("option", { value: 2 /* RGB */ }, "RGB"),
                        h("option", { value: 3 /* YCbCr */ }, "YCbCr"))),
                h(Expander, null, options.color_space === 3 /* YCbCr */ ? (h("div", null,
                    h("label", { class: style.optionToggle },
                        "Auto subsample chroma",
                        h(Checkbox, { name: "auto_subsample", checked: options.auto_subsample, onChange: this.onChange })),
                    h(Expander, null, options.auto_subsample ? null : (h("div", { class: style.optionOneCell },
                        h(Range, { name: "chroma_subsample", min: "1", max: "4", value: options.chroma_subsample, onInput: this.onChange }, "Subsample chroma by:")))),
                    h("label", { class: style.optionToggle },
                        "Separate chroma quality",
                        h(Checkbox, { name: "separate_chroma_quality", checked: options.separate_chroma_quality, onChange: this.onChange })),
                    h(Expander, null, options.separate_chroma_quality ? (h("div", { class: style.optionOneCell },
                        h(Range, { name: "chroma_quality", min: "0", max: "100", value: options.chroma_quality, onInput: this.onChange }, "Chroma quality:"))) : null))) : null),
                h("label", { class: style.optionToggle },
                    "Pointless spec compliance",
                    h(Checkbox, { name: "baseline", checked: options.baseline, onChange: this.onChange })),
                h(Expander, null, options.baseline ? null : (h("label", { class: style.optionToggle },
                    "Progressive rendering",
                    h(Checkbox, { name: "progressive", checked: options.progressive, onChange: this.onChange })))),
                h(Expander, null, options.baseline ? (h("label", { class: style.optionToggle },
                    "Optimize Huffman table",
                    h(Checkbox, { name: "optimize_coding", checked: options.optimize_coding, onChange: this.onChange }))) : null),
                h("div", { class: style.optionOneCell },
                    h(Range, { name: "smoothing", min: "0", max: "100", value: options.smoothing, onInput: this.onChange }, "Smoothing:")),
                h("label", { class: style.optionTextFirst },
                    "Quantization:",
                    h(Select, { name: "quant_table", value: options.quant_table, onChange: this.onChange },
                        h("option", { value: "0" }, "JPEG Annex K"),
                        h("option", { value: "1" }, "Flat"),
                        h("option", { value: "2" }, "MSSIM-tuned Kodak"),
                        h("option", { value: "3" }, "ImageMagick"),
                        h("option", { value: "4" }, "PSNR-HVS-M-tuned Kodak"),
                        h("option", { value: "5" }, "Klein et al"),
                        h("option", { value: "6" }, "Watson et al"),
                        h("option", { value: "7" }, "Ahumada et al"),
                        h("option", { value: "8" }, "Peterson et al"))),
                h("label", { class: style.optionToggle },
                    "Trellis multipass",
                    h(Checkbox, { name: "trellis_multipass", checked: options.trellis_multipass, onChange: this.onChange })),
                h(Expander, null, options.trellis_multipass ? (h("label", { class: style.optionToggle },
                    "Optimize zero block runs",
                    h(Checkbox, { name: "trellis_opt_zero", checked: options.trellis_opt_zero, onChange: this.onChange }))) : null),
                h("label", { class: style.optionToggle },
                    "Optimize after trellis quantization",
                    h(Checkbox, { name: "trellis_opt_table", checked: options.trellis_opt_table, onChange: this.onChange })),
                h("div", { class: style.optionOneCell },
                    h(Range, { name: "trellis_loops", min: "1", max: "50", value: options.trellis_loops, onInput: this.onChange }, "Trellis quantization passes:")))) : null)));
    }
}
