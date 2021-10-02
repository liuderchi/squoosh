import { h, Component } from 'preact';
import * as style from './style.css';
import 'add-css:./style.css';
import { transitionHeight } from '../../../util';
export default class Expander extends Component {
    static getDerivedStateFromProps(props, state) {
        if (!props.children && state.children) {
            return { children: props.children, outgoingChildren: state.children };
        }
        if (props.children !== state.children) {
            return { children: props.children, outgoingChildren: undefined };
        }
        return null;
    }
    async componentDidUpdate(_, previousState) {
        let heightFrom;
        let heightTo;
        if (previousState.children && !this.state.children) {
            heightFrom = this.base.getBoundingClientRect().height;
            heightTo = 0;
        }
        else if (!previousState.children && this.state.children) {
            heightFrom = 0;
            heightTo = this.base.getBoundingClientRect().height;
        }
        else {
            return;
        }
        this.base.style.overflow = 'hidden';
        await transitionHeight(this.base, {
            duration: 300,
            from: heightFrom,
            to: heightTo,
        });
        // Unset the height & overflow, so element changes do the right thing.
        this.base.style.height = '';
        this.base.style.overflow = '';
        this.setState({ outgoingChildren: undefined });
    }
    render({}, { children, outgoingChildren }) {
        return (h("div", { class: outgoingChildren ? style.childrenExiting : '' }, outgoingChildren || children));
    }
}
