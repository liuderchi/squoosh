import { h, Component } from 'preact';
import * as style from './style.css';
import 'add-css:./style.css';
export default class Toggle extends Component {
    render(props) {
        return (h("div", { class: style.checkbox },
            h("input", Object.assign({ class: style.realCheckbox, type: "checkbox" }, props)),
            h("div", { class: style.track },
                h("div", { class: style.thumbTrack },
                    h("div", { class: style.thumb })))));
    }
}
