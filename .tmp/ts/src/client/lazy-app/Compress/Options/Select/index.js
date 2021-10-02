import { h, Component } from 'preact';
import * as style from './style.css';
import 'add-css:./style.css';
import { Arrow } from 'client/lazy-app/icons';
export default class Select extends Component {
    render(props) {
        const { large, ...otherProps } = props;
        return (h("div", { class: style.select },
            h("select", Object.assign({ class: `${style.builtinSelect} ${large ? style.large : ''}` }, otherProps)),
            h("div", { class: style.arrow },
                h(Arrow, null))));
    }
}
