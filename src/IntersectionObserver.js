import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { createObserver, observeElement, unobserveElement } from './observer';
import { shallowCompare } from './utils';
import Config from './config';

const observerOptions = ['root', 'rootMargin', 'threshold'];
const observableProps = ['root', 'rootMargin', 'threshold', 'disabled'];
const { hasOwnProperty, toString } = Object.prototype;

const getOptions = (props) => {
    return observerOptions.reduce((options, key) => {
        if (hasOwnProperty.call(props, key)) {
            const rootIsString =
                key === 'root' &&
                toString.call(props[key]) === '[object String]';
            options[key] = rootIsString
                ? document.querySelector(props[key])
                : props[key];
        }
        return options;
    }, {});
};

class IntersectionObserver extends React.Component {
    static displayName = 'IntersectionObserver';

    static propTypes = {
        /**
         * The element that is used as the target to observe.
         */
        children: PropTypes.element,

        /**
         * The element that is used as the viewport for checking visibility of the target.
         * Can be specified as string for selector matching within the document.
         * Defaults to the browser viewport if not specified or if null.
         */
        root: PropTypes.oneOfType(
            [PropTypes.string].concat(
                typeof HTMLElement === 'undefined'
                    ? []
                    : PropTypes.instanceOf(HTMLElement)
            )
        ),

        /**
         * Margin around the root. Can have values similar to the CSS margin property,
         * e.g. "10px 20px 30px 40px" (top, right, bottom, left).
         * If the root element is specified, the values can be percentages.
         * This set of values serves to grow or shrink each side of the root element's
         * bounding box before computing intersections.
         * Defaults to all zeros.
         */
        rootMargin: PropTypes.string,

        /**
         * Either a single number or an array of numbers which indicate at what percentage
         * of the target's visibility the observer's callback should be executed.
         * If you only want to detect when visibility passes the 50% mark, you can use a value of 0.5.
         * If you want the callback run every time visibility passes another 25%,
         * you would specify the array [0, 0.25, 0.5, 0.75, 1].
         * The default is 0 (meaning as soon as even one pixel is visible, the callback will be run).
         * A value of 1.0 means that the threshold isn't considered passed until every pixel is visible.
         */
        threshold: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.arrayOf(PropTypes.number),
        ]),

        /**
         * Controls whether the element should stop being observed by its IntersectionObserver instance.
         * Defaults to false.
         */
        disabled: PropTypes.bool,

        /**
         * Function that will be invoked whenever the intersection value for this element changes.
         */
        onChange: PropTypes.func.isRequired,
    };

    handleChange = (event) => {
        this.props.onChange(event, this.externalUnobserve);
    };

    handleNode = (target) => {
        const { children } = this.props;

        if (children != null) {
            /**
             * Forward hijacked ref to user.
             */
            const nodeRef = children.ref;
            if (nodeRef) {
                if (typeof nodeRef === 'function') {
                    nodeRef(target);
                } else if (typeof nodeRef === 'object') {
                    nodeRef.current = target;
                }
            }
        }

        this.targetNode = target && findDOMNode(target);
    };

    observe = () => {
        if (this.props.children == null || this.props.disabled) {
            return false;
        }
        if (!this.targetNode) {
            throw new Error(
                "ReactIntersectionObserver: Can't find DOM node in the provided children. Make sure to render at least one DOM node in the tree."
            );
        }
        this.observer = createObserver(getOptions(this.props));
        this.target = this.targetNode;
        observeElement(this);

        return true;
    };

    unobserve = (target) => {
        unobserveElement(this, target);
    };

    externalUnobserve = () => {
        this.unobserve(this.targetNode);
    };

    getSnapshotBeforeUpdate(prevProps) {
        this.prevTargetNode = this.targetNode;

        const relatedPropsChanged = observableProps.some((prop) =>
            shallowCompare(this.props[prop], prevProps[prop])
        );
        if (relatedPropsChanged) {
            if (this.prevTargetNode) {
                if (!prevProps.disabled) {
                    this.unobserve(this.prevTargetNode);
                }
            }
        }

        return relatedPropsChanged;
    }

    componentDidUpdate(_, __, relatedPropsChanged) {
        let targetNodeChanged = false;
        // check if we didn't unobserve previously due to a prop change
        if (!relatedPropsChanged) {
            targetNodeChanged = this.prevTargetNode !== this.targetNode;
            // check we have a previous node we want to unobserve
            if (targetNodeChanged && this.prevTargetNode != null) {
                this.unobserve(this.prevTargetNode);
            }
        }

        if (relatedPropsChanged || targetNodeChanged) {
            this.observe();
        }
    }

    componentDidMount() {
        this.observe();
    }

    componentWillUnmount() {
        if (this.targetNode) {
            this.unobserve(this.targetNode);
        }
    }

    render() {
        const { children } = this.props;

        return children != null
            ? React.cloneElement(React.Children.only(children), {
                  ref: this.handleNode,
              })
            : null;
    }
}

class GuardedIntersectionObserver extends React.Component {
    static displayName = 'ErrorBoundary(IntersectionObserver)';

    componentDidCatch(error, info) {
        if (Config.errorReporter) {
            Config.errorReporter(error, info);
        }
    }

    render() {
        return <IntersectionObserver {...this.props} />;
    }
}

export {
    GuardedIntersectionObserver as default,
    IntersectionObserver,
    getOptions,
};
