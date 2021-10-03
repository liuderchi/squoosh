import { h, Component } from 'preact';
import * as style from './style.css';
import 'add-css:./style.css';
import { cleanSet, cleanMerge } from '../../util/clean-modify';
import { encoderMap, } from '../../feature-meta';
import Expander from './Expander';
import Toggle from './Toggle';
import Select from './Select';
import { Options as QuantOptionsComponent } from 'features/processors/quantize/client';
import { Options as ResizeOptionsComponent } from 'features/processors/resize/client';
import { CLIIcon, SwapIcon } from 'client/lazy-app/icons';
const supportedEncoderMapP = (async () => {
    const supportedEncoderMap = {
        ...encoderMap,
    };
    // Filter out entries where the feature test fails
    await Promise.all(Object.entries(encoderMap).map(async ([encoderName, details]) => {
        if ('featureTest' in details && !(await details.featureTest())) {
            delete supportedEncoderMap[encoderName];
        }
    }));
    return supportedEncoderMap;
})();
export default class Options extends Component {
    constructor() {
        super();
        this.state = {
            supportedEncoderMap: undefined,
        };
        this.onEncoderTypeChange = (event) => {
            const el = event.currentTarget;
            // The select element only has values matching encoder types,
            // so 'as' is safe here.
            const type = el.value;
            this.props.onEncoderTypeChange(this.props.index, type);
        };
        this.onProcessorEnabledChange = (event) => {
            const el = event.currentTarget;
            const processor = el.name.split('.')[0];
            this.props.onProcessorOptionsChange(this.props.index, cleanSet(this.props.processorState, `${processor}.enabled`, el.checked));
        };
        this.onQuantizerOptionsChange = (opts) => {
            this.props.onProcessorOptionsChange(this.props.index, cleanMerge(this.props.processorState, 'quantize', opts));
        };
        this.onResizeOptionsChange = (opts) => {
            this.props.onProcessorOptionsChange(this.props.index, cleanMerge(this.props.processorState, 'resize', opts));
        };
        this.onEncoderOptionsChange = (newOptions) => {
            this.props.onEncoderOptionsChange(this.props.index, newOptions);
        };
        this.onCopyCliClick = () => {
            this.props.onCopyCliClick(this.props.index);
        };
        this.onCopyToOtherSideClick = () => {
            this.props.onCopyToOtherSideClick(this.props.index);
        };
        supportedEncoderMapP.then((supportedEncoderMap) => this.setState({ supportedEncoderMap }));
    }
    render({ source, encoderState, processorState }, { supportedEncoderMap }) {
        const encoder = encoderState && encoderMap[encoderState.type];
        const EncoderOptionComponent = encoder && 'Options' in encoder ? encoder.Options : undefined;
        return (h("div", { class: style.optionsScroller +
                ' ' +
                (encoderState ? '' : style.originalImage) },
            h(Expander, null, !encoderState ? null : (h("div", null,
                h("h3", { class: style.optionsTitle },
                    h("div", { class: style.titleAndButtons },
                        "Edit",
                        h("button", { class: style.cliButton, title: "Copy npx command", onClick: this.onCopyCliClick },
                            h(CLIIcon, null)),
                        h("button", { class: style.copyOverButton, title: "Copy settings to other side", onClick: this.onCopyToOtherSideClick },
                            h(SwapIcon, null)))),
                h("label", { class: style.sectionEnabler },
                    "Resize",
                    h(Toggle, { name: "resize.enable", checked: !!processorState.resize.enabled, onChange: this.onProcessorEnabledChange })),
                h(Expander, null, processorState.resize.enabled ? (h(ResizeOptionsComponent, { isVector: Boolean(source && source.vectorImage), inputWidth: source ? source.preprocessed.width : 1, inputHeight: source ? source.preprocessed.height : 1, options: processorState.resize, onChange: this.onResizeOptionsChange })) : null),
                h("label", { class: style.sectionEnabler },
                    "Reduce palette",
                    h(Toggle, { name: "quantize.enable", checked: !!processorState.quantize.enabled, onChange: this.onProcessorEnabledChange })),
                h(Expander, null, processorState.quantize.enabled ? (h(QuantOptionsComponent, { options: processorState.quantize, onChange: this.onQuantizerOptionsChange })) : null)))),
            h("h3", { class: style.optionsTitle }, "Compress"),
            h("section", { class: `${style.optionOneCell} ${style.optionsSection}` }, supportedEncoderMap ? (h(Select, { value: encoderState ? encoderState.type : 'identity', onChange: this.onEncoderTypeChange, large: true },
                h("option", { value: "identity" }, "Original Image"),
                Object.entries(supportedEncoderMap).map(([type, encoder]) => (h("option", { value: type }, encoder.meta.label))))) : (h(Select, { large: true },
                h("option", null, "Loading\u2026")))),
            h(Expander, null, EncoderOptionComponent && (h(EncoderOptionComponent, { options: 
                // Casting options, as encoderOptionsComponentMap[encodeData.type] ensures
                // the correct type, but typescript isn't smart enough.
                encoderState.options, onChange: this.onEncoderOptionsChange })))));
    }
}
