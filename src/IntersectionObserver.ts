import React from 'react';
import { createObserver } from './observer';
import {
  shallowCompare,
  toString,
} from './utils';
import { ChangeHandler, Options, Instance } from './types';

const observerOptions = <const>['root', 'rootMargin', 'threshold'];
const observableProps = <const>['root', 'rootMargin', 'threshold', 'disabled'];

export const getOptions = (props: Props) => {
  return observerOptions.reduce<IntersectionObserverInit>((options, key) => {
    const isRootString =
      key === 'root' && toString.call(props.root) === '[object String]';

    return Object.assign(options, {
      [key]: isRootString
        ? document.querySelector(props[key] as string)
        : props[key],
    });
  }, {});
};

interface Props extends Options {
  /**
   * The element that is used as the target to observe.
   */
  children?: React.ReactElement | null;
  /**
   * Function that will be invoked whenever the intersection value for this element changes.
   */
  onChange: ChangeHandler;
}

export default class ReactIntersectionObserver extends React.Component<Props> implements Instance {
  static displayName = 'IntersectionObserver';

  private targetNode?: Element;
  public observer?: IntersectionObserver;

  handleChange = (event: IntersectionObserverEntry, unobserve: () => void) => {
    this.props.onChange(event, unobserve);
  };

  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.observe();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const relatedPropsChanged = observableProps.some(
      (prop) => shallowCompare(this.props[prop], prevProps[prop])
    );

    if (relatedPropsChanged) {
      this.unobserve();
      this.observe();
    }
  }

  componentWillUnmount() {
    this.unobserve();
  }

  observe() {
    if (!this.targetNode || this.props.disabled) return;

    const options = getOptions(this.props);
    this.observer = createObserver(options);
    this.observer.observe(this.targetNode);
  }

  unobserve() {
    if (this.observer && this.targetNode) {
      this.observer.unobserve(this.targetNode);
      this.observer = undefined;
    }
  }

  handleNode = (node: Element | null) => {
    if (node) {
      this.targetNode = node;
    } else {
      this.targetNode = undefined;
    }
  };

  render() {
    const { children } = this.props;

    if (!children) return null;

    return React.cloneElement(React.Children.only(children), {
      ref: this.handleNode,
    });
  }
}



export * from './types';
