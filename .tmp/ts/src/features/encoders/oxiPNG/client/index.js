import { canvasEncode } from 'client/lazy-app/util/canvas';
import { abortable, blobToArrayBuffer, inputFieldChecked, } from 'client/lazy-app/util';
import { h, Component } from 'preact';
import { inputFieldValueAsNumber, preventDefault } from 'client/lazy-app/util';
import * as style from 'client/lazy-app/Compress/Options/style.css';
import Range from 'client/lazy-app/Compress/Options/Range';
import Checkbox from 'client/lazy-app/Compress/Options/Checkbox';
export async function encode(signal, workerBridge, imageData, options) {
    const pngBlob = await abortable(signal, canvasEncode(imageData, 'image/png'));
    const pngBuffer = await abortable(signal, blobToArrayBuffer(pngBlob));
    return workerBridge.oxipngEncode(signal, pngBuffer, options);
}
export class Options extends Component {
    constructor() {
        super(...arguments);
        this.onChange = (event) => {
            const form = event.currentTarget.closest('form');
            const options = {
                level: inputFieldValueAsNumber(form.level),
                interlace: inputFieldChecked(form.interlace),
            };
            this.props.onChange(options);
        };
    }
    render({ options }) {
        return (h("form", { class: style.optionsSection, onSubmit: preventDefault },
            h("label", { class: style.optionToggle },
                "Interlace",
                h(Checkbox, { name: "interlace", checked: options.interlace, onChange: this.onChange })),
            h("div", { class: style.optionOneCell },
                h(Range, { name: "level", min: "0", max: "3", step: "1", value: options.level, onInput: this.onChange }, "Effort:"))));
    }
}
