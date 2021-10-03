import { h, Component } from 'preact';
import * as style from './style.css';
import 'add-css:./style.css';
import { Arrow } from '../../../icons';
export default class Revealer extends Component {
    render(props) {
        return (h("div", { class: style.checkbox },
            h("input", Object.assign({ class: style.realCheckbox, type: "checkbox" }, props)),
            h("div", { class: style.arrow },
                h(Arrow, null))));
    }
}
