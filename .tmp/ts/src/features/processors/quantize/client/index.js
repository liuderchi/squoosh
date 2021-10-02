import { h, Component } from 'preact';
import * as style from 'client/lazy-app/Compress/Options/style.css';
import { inputFieldValueAsNumber, konami, preventDefault, } from 'client/lazy-app/util';
import Expander from 'client/lazy-app/Compress/Options/Expander';
import Select from 'client/lazy-app/Compress/Options/Select';
import Range from 'client/lazy-app/Compress/Options/Range';
const konamiPromise = konami();
export class Options extends Component {
    constructor() {
        super(...arguments);
        this.state = { extendedSettings: false };
        this.onChange = (event) => {
            const form = event.currentTarget.closest('form');
            const { options } = this.props;
            const newOptions = {
                zx: inputFieldValueAsNumber(form.zx, options.zx),
                maxNumColors: inputFieldValueAsNumber(form.maxNumColors, options.maxNumColors),
                dither: inputFieldValueAsNumber(form.dither),
            };
            this.props.onChange(newOptions);
        };
    }
    componentDidMount() {
        konamiPromise.then(() => {
            this.setState({ extendedSettings: true });
        });
    }
    render({ options }, { extendedSettings }) {
        return (h("form", { class: style.optionsSection, onSubmit: preventDefault },
            h(Expander, null, extendedSettings ? (h("label", { class: style.optionTextFirst },
                "Type:",
                h(Select, { name: "zx", value: '' + options.zx, onChange: this.onChange },
                    h("option", { value: "0" }, "Standard"),
                    h("option", { value: "1" }, "ZX")))) : null),
            h(Expander, null, options.zx ? null : (h("div", { class: style.optionOneCell },
                h(Range, { name: "maxNumColors", min: "2", max: "256", value: options.maxNumColors, onInput: this.onChange }, "Colors:")))),
            h("div", { class: style.optionOneCell },
                h(Range, { name: "dither", min: "0", max: "1", step: "0.01", value: options.dither, onInput: this.onChange }, "Dithering:"))));
    }
}
