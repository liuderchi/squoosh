import { h, Component } from 'preact';
import * as style from './style.css';
import 'add-css:./style.css';
import { UncheckedIcon, CheckedIcon } from '../../../icons';
export default class Checkbox extends Component {
    render(props) {
        return (h("div", { class: style.checkbox },
            props.checked ? (h(CheckedIcon, { class: `${style.icon} ${style.checked}` })) : (h(UncheckedIcon, { class: style.icon })),
            h("input", Object.assign({ class: style.realCheckbox, type: "checkbox" }, props))));
    }
}
