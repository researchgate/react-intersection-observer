import React from 'react';
import { findDOMNode } from 'react-dom';
import { createObserver, observeElement, unobserveElement } from './observer';
import {
  shallowCompare,
  isChildrenWithRef,
  hasOwnProperty,
  toString,
} from './utils';
import { ChangeHandler, Options, Instance, TargetNode } from './types';

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

export default class ReactIntersectionObserver
  extends React.Component<Props, {}>
  implements Instance {
  static displayName = 'IntersectionObserver';

  private targetNode?: TargetNode;
  private prevTargetNode?: TargetNode;
  public target?: TargetNode;
  public observer?: IntersectionObserver;

  handleChange = (event: IntersectionObserverEntry) => {
    this.props.onChange(event, this.externalUnobserve);
  };

  handleNode = <T extends React.ReactInstance | null | undefined>(
    target: T
  ) => {
    const { children } = this.props;
    /**
     * Forward hijacked ref to user.
     */
    if (isChildrenWithRef<T>(children)) {
      const childenRef = children.ref;
      if (typeof childenRef === 'function') {
        childenRef(target);
      } else if (childenRef && hasOwnProperty.call(childenRef, 'current')) {
        /*
         * The children ref.current is read-only, we aren't allowed to do this, so
         * in future release it has to go away, and the ref shall be
         * forwarded and assigned to a DOM node by the user.
         */
        (childenRef as React.MutableRefObject<T>).current = target;
      }
    }

    this.targetNode = undefined;
    if (target) {
      const targetNode = findDOMNode(target);
      if (targetNode && targetNode.nodeType === 1) {
        this.targetNode = targetNode as Element;
      }
    }
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

  unobserve = (target: TargetNode) => {
    unobserveElement(this, target);
  };

  externalUnobserve = () => {
    if (this.targetNode) {
      this.unobserve(this.targetNode);
    }
  };

  getSnapshotBeforeUpdate(prevProps: Props) {
    this.prevTargetNode = this.targetNode;

    const relatedPropsChanged = observableProps.some(
      (prop: typeof observableProps[number]) =>
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

  componentDidUpdate(_: any, __: any, relatedPropsChanged: boolean) {
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

export * from './types';
