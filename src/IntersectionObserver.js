import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import IntersectionObserverContainer from './IntersectionObserverContainer';
import { isDOMTypeElement, shallowCompareOptions } from './utils';

/**
 * The Intersection Observer API callback that is called whenever one element,
 * called the target, intersects either the device viewport or a specified element.
 * Also will get caled whenever the visibility of the target element changes and
 * crosses desired amounts of intersection with the root.
 * @param {array} changes
 * @param {IntersectionObserver} observer
 */
export function callback(changes, observer) {
    changes.forEach(entry => {
        const instance = IntersectionObserverContainer.findElement(entry, observer);
        if (instance) {
            instance.handleChange(entry);
        }
    });
}

const observerOptions = ['root', 'rootMargin', 'threshold'];
const objectProto = Object.prototype;

export default class IntersectionObserver extends React.Component {
    static displayName = 'IntersectionObserver';

    static propTypes = {
        /**
         * The element that is used as the target to observe.
         */
        children: PropTypes.element.isRequired,

        /**
         * The element that is used as the viewport for checking visibility of the target.
         * Can be specified as string for selector matching within the document.
         * Defaults to the browser viewport if not specified or if null.
         */
        root: PropTypes.oneOfType(
            [PropTypes.string].concat(typeof HTMLElement === 'undefined' ? [] : PropTypes.instanceOf(HTMLElement)),
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
        threshold: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),

        /**
         * When true indicate that events fire only until the element is intersecting.
         * Different browsers behave differently towards the isIntersecting property, make sure
         * you polyfill and/or override the IntersectionObserverEntry object's prototype to your needs.
         * Defaults to false.
         */
        onlyOnce: PropTypes.bool,

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

    get options() {
        return observerOptions.reduce((prev, key) => {
            if (objectProto.hasOwnProperty.call(this.props, key)) {
                let value = this.props[key];
                if (key === 'root' && objectProto.toString.call(this.props[key]) === '[object String]') {
                    value = document.querySelector(value);
                }
                return {
                    ...prev,
                    [key]: value,
                };
            }
            return prev;
        }, {});
    }

    handleChange = event => {
        this.props.onChange(event);

        if (this.props.onlyOnce) {
            // eslint-disable-next-line no-undef
            if (process.env.NODE_ENV !== 'production') {
                invariant(
                    'isIntersecting' in event,
                    "onlyOnce requires isIntersecting to exists in IntersectionObserverEntry's prototype. Either your browser or your polyfill lacks support.",
                );
            }
            if (event.isIntersecting) {
                this.unobserve();
            }
        }
    };

    handleNode = node => {
        if (typeof this.props.children.ref === 'function') {
            this.props.children.ref(node);
        }
        if (this.currentTarget && node && this.currentTarget !== node) {
            this.unobserve();
            this.shouldResetObserver = true;
        }
        this.target = node;
    };

    observe() {
        this.target = isDOMTypeElement(this.target) ? this.target : this.target ? findDOMNode(this.target) : findDOMNode(this);
        this.observer = IntersectionObserverContainer.create(callback, this.options);
        IntersectionObserverContainer.observe(this);
    }

    unobserve() {
        IntersectionObserverContainer.unobserve(this);
    }

    reobserve() {
        this.unobserve();
        if (!this.props.disabled) {
            this.observe();
        }
    }

    componentDidMount() {
        // eslint-disable-next-line no-undef
        if (process.env.NODE_ENV !== 'production' && parseInt(React.version, 10) < 16) {
            invariant(
                this.target,
                'Stateless function components cannot be given refs. Attempts to access this ref will fail.',
            );
        }
        if (!this.props.disabled) {
            this.observe();
        }
    }

    componentWillUnmount() {
        this.unobserve();
    }

    componentDidUpdate() {
        if (this.shouldResetObserver) {
            this.reobserve();
        }
    }

    componentWillUpdate(nextProps) {
        this.shouldResetObserver = observerOptions
            .concat(['disabled'])
            .some(option => shallowCompareOptions(nextProps[option], this.props[option]));
    }

    render() {
        this.currentTarget = this.target;

        return React.cloneElement(React.Children.only(this.props.children), {
            ref: this.handleNode,
        });
    }
}
