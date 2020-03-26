/* eslint-env jest */
import 'intersection-observer';
import React, { Component } from 'react';
import renderer from 'react-test-renderer';
import GuardedIntersectionObserver, {
    IntersectionObserver,
    getOptions,
} from '../IntersectionObserver';
import { callback, observerElementsMap } from '../observer';
import Config from '../config';

jest.mock('react-dom', () => {
    const { findDOMNode } = jest.requireActual('react-dom');
    const target = { nodeType: 1, type: 'noscript' };
    return {
        findDOMNode(x) {
            const found = findDOMNode(x);
            if (found == null) {
                return found;
            }
            return typeof x.type === 'string' ? found : target;
        },
    };
});
// the default "undefined" can't be re-assigned, so we preemptively set it as an empty function
Config.errorReporter = function() {};

const target = { nodeType: 1, type: 'span' };
const targets = { div: { nodeType: 1, type: 'div' }, span: target };
const createNodeMock = ({ type }) => targets[type];
const noop = () => {};
const propTypes = IntersectionObserver.propTypes;
class ProxyComponent extends Component {
    render() {
        return this.props.children; // eslint-disable-line react/prop-types
    }
}
const disablePropTypes = () => {
    IntersectionObserver.propTypes = {};
};
const enablePropTypes = () => {
    IntersectionObserver.propTypes = propTypes;
};

afterEach(() => {
    observerElementsMap.clear();
});

test('throws when the property children is not an only child', () => {
    global.spyOn(console, 'error');
    expect(() =>
        renderer.create(
            <IntersectionObserver onChange={noop}>
                <span />
                <span />
            </IntersectionObserver>
        )
    ).toThrowErrorMatchingInlineSnapshot(
        `"React.Children.only expected to receive a single React element child."`
    );
});

test('throws trying to observe children without a DOM node', () => {
    global.spyOn(console, 'error'); // suppress error boundary warning
    const sizeBeforeObserving = observerElementsMap.size;

    expect(() =>
        renderer.create(
            <IntersectionObserver onChange={noop}>
                <ProxyComponent>{null}</ProxyComponent>
            </IntersectionObserver>
        )
    ).toThrowErrorMatchingInlineSnapshot(
        `"ReactIntersectionObserver: Can't find DOM node in the provided children. Make sure to render at least one DOM node in the tree."`
    );
    expect(observerElementsMap.size).toBe(sizeBeforeObserving);
});

test('reports error trying to observe children without a DOM node', () => {
    global.spyOn(console, 'error'); // suppress error boundary warning
    const sizeBeforeObserving = observerElementsMap.size;
    const originalErrorReporter = Config.errorReporter;
    const spy = jest.fn();
    Config.errorReporter = spy;

    const tree = renderer
        .create(
            <GuardedIntersectionObserver onChange={noop}>
                <ProxyComponent>{null}</ProxyComponent>
            </GuardedIntersectionObserver>
        )
        .toTree();

    expect(observerElementsMap.size).toBe(sizeBeforeObserving);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(
        expect.any(Error),
        expect.objectContaining({ componentStack: expect.any(String) })
    );
    // Tree stayed mounted because of the error boundary
    expect(tree.props.children.type).toEqual(ProxyComponent);

    Config.errorReporter = originalErrorReporter;
});

test('reports errors by re-throwing trying observer children without a DOM node', () => {
    global.spyOn(console, 'error'); // suppress error boundary warning
    const originalErrorReporter = Config.errorReporter;
    let called = false;
    Config.errorReporter = (err) => {
        called = true;
        throw err;
    };
    class TestErrorBoundary extends React.Component {
        state = { hasError: false };

        componentDidCatch() {
            this.setState({ hasError: true });
        }

        render() {
            // eslint-disable-next-line react/prop-types
            return this.state.hasError ? 'has-error' : this.props.children;
        }
    }

    const children = renderer
        .create(
            <TestErrorBoundary>
                <GuardedIntersectionObserver onChange={noop}>
                    <ProxyComponent>{null}</ProxyComponent>
                </GuardedIntersectionObserver>
            </TestErrorBoundary>
        )
        .toJSON();

    // Tree changed because of the custom error boundary
    expect(children).toBe('has-error');
    expect(called).toBe(true);

    Config.errorReporter = originalErrorReporter;
});

test('render a fallback when some unexpected error happens', () => {
    global.spyOn(console, 'error'); // suppress error boundary warning
    const originalErrorReporter = Config.errorReporter;
    const spy = jest.fn();
    Config.errorReporter = spy;
    class TestErrorBoundary extends React.Component {
        state = { hasError: false };

        componentDidCatch() {
            this.setState({ hasError: true });
        }

        render() {
            // eslint-disable-next-line react/prop-types
            return this.state.hasError ? 'has-error' : this.props.children;
        }
    }

    const Boom = () => {
        throw new Error('unexpected rendering error');
    };

    const children = renderer
        .create(
            <TestErrorBoundary>
                <GuardedIntersectionObserver onChange={noop}>
                    <Boom />
                </GuardedIntersectionObserver>
            </TestErrorBoundary>
        )
        .toJSON();

    // Tree changed because of the custom error boundary
    expect(children).toBe('has-error');
    expect(spy).not.toBeCalled();

    Config.errorReporter = originalErrorReporter;
});

test('error boundary forwards ref', () => {
    let observer;
    renderer.create(
        <GuardedIntersectionObserver
            onChange={noop}
            ref={(instance) => {
                observer = instance;
            }}
        >
            <div />
        </GuardedIntersectionObserver>,
        { createNodeMock }
    );

    expect(observer instanceof IntersectionObserver).toBe(true);
});

test('should not observe children that equal null or undefined', () => {
    const sizeBeforeObserving = observerElementsMap.size;
    renderer.create(
        <IntersectionObserver onChange={noop}>{undefined}</IntersectionObserver>
    );

    expect(observerElementsMap.size).toBe(sizeBeforeObserving);
});

test('should not reobserve children that equal null or undefined', () => {
    const tree = renderer.create(
        <IntersectionObserver onChange={noop}>{undefined}</IntersectionObserver>
    );
    const instance = tree.getInstance();
    const observe = jest.spyOn(instance, 'observe');
    const unobserve = jest.spyOn(instance, 'unobserve');

    tree.update(
        <IntersectionObserver onChange={noop}>{null}</IntersectionObserver>
    );
    tree.update(
        <IntersectionObserver onChange={noop} rootMargin="1%">
            {null}
        </IntersectionObserver>
    );

    expect(unobserve).not.toBeCalled();
    expect(observe).toBeCalledTimes(1);
    expect(observe).toReturnWith(false);
});

test('should reobserve null children updating to a DOM node', () => {
    const tree = renderer.create(
        <IntersectionObserver onChange={noop}>{null}</IntersectionObserver>,
        {
            createNodeMock,
        }
    );
    const instance = tree.getInstance();
    const observe = jest.spyOn(instance, 'observe');
    const unobserve = jest.spyOn(instance, 'unobserve');

    tree.update(
        <IntersectionObserver onChange={noop}>
            <div />
        </IntersectionObserver>
    );

    expect(observe).toBeCalledTimes(1);
    expect(observe).toReturnWith(true);
    expect(unobserve).not.toBeCalled();
});

test('should unobserve children updating to null', () => {
    const tree = renderer.create(
        <IntersectionObserver onChange={noop}>
            <div />
        </IntersectionObserver>,
        { createNodeMock }
    );
    const instance = tree.getInstance();
    const observe = jest.spyOn(instance, 'observe');
    const unobserve = jest.spyOn(instance, 'unobserve');

    tree.update(
        <IntersectionObserver onChange={noop}>{null}</IntersectionObserver>
    );

    expect(unobserve).toBeCalledTimes(1);
    expect(observe).toReturnWith(false);
});

test('should call ref callback of children with target', () => {
    const spy = jest.fn();

    renderer.create(
        <IntersectionObserver onChange={noop}>
            <span ref={spy} />
        </IntersectionObserver>,
        { createNodeMock }
    );

    expect(spy).toBeCalledWith(target);
});

test('should handle children ref of type RefObject', () => {
    const ref = React.createRef();

    renderer.create(
        <IntersectionObserver onChange={noop}>
            <span ref={ref} />
        </IntersectionObserver>,
        { createNodeMock }
    );

    expect(ref.current).toEqual(target);
});

test('getOptions returns props `root`, `rootMargin` and `threshold`', () => {
    disablePropTypes();

    const options = {
        root: { nodeType: 1 },
        rootMargin: '50% 0%',
        threshold: [0, 1],
    };

    const tree = renderer.create(
        <IntersectionObserver onChange={noop} {...options}>
            <span />
        </IntersectionObserver>,
        { createNodeMock }
    );

    expect(getOptions(tree.getInstance().props)).toEqual(options);

    enablePropTypes();
});

test('should observe target on mount', () => {
    const sizeAfterObserving = observerElementsMap.size + 1;

    renderer.create(
        <IntersectionObserver onChange={noop}>
            <span />
        </IntersectionObserver>,
        { createNodeMock }
    );

    expect(sizeAfterObserving).toBe(observerElementsMap.size);
});

test('should unobserve target on unmount', () => {
    const sizeBeforeObserving = observerElementsMap.size;

    const tree = renderer.create(
        <IntersectionObserver onChange={noop}>
            <span />
        </IntersectionObserver>,
        { createNodeMock }
    );

    tree.unmount();
    expect(sizeBeforeObserving).toBe(observerElementsMap.size);
});

describe('updating', () => {
    test('should reobserve with new root, rootMargin and/or threshold props', () => {
        disablePropTypes();

        const root1 = { id: 'window', nodeType: 1 };
        const root2 = { id: 'document', nodeType: 1 };
        const initialProps = {
            onChange: noop,
            root: root1,
            rootMargin: '10% 20%',
            threshold: 0.5,
        };
        const tree = renderer.create(
            <IntersectionObserver {...initialProps}>
                <span />
            </IntersectionObserver>,
            { createNodeMock }
        );
        const instance = tree.getInstance();
        const unobserve = jest.spyOn(instance, 'unobserve');
        const observe = jest.spyOn(instance, 'observe');

        // none of the props updating [0/0]
        tree.update(
            <IntersectionObserver {...initialProps}>
                <span />
            </IntersectionObserver>
        );
        // only children updating [1/1]
        tree.update(
            <IntersectionObserver {...initialProps}>
                <div />
            </IntersectionObserver>
        );
        // DOM node not updating [1/1]
        tree.update(
            <IntersectionObserver {...initialProps}>
                <div key="forcesRender" />
            </IntersectionObserver>
        );
        // only root updating (document) [2/2]
        tree.update(
            <IntersectionObserver {...initialProps} root={root2}>
                <div />
            </IntersectionObserver>
        );
        // only root updating (window) [3/3]
        tree.update(
            <IntersectionObserver {...initialProps} root={root1}>
                <div />
            </IntersectionObserver>
        );
        // only rootMargin updating [4/4]
        tree.update(
            <IntersectionObserver
                {...initialProps}
                root={root1}
                rootMargin="20% 10%"
            >
                <div />
            </IntersectionObserver>
        );
        // only threshold updating (non-scalar) [5/5]
        tree.update(
            <IntersectionObserver {...initialProps} threshold={[0.5, 1]}>
                <div />
            </IntersectionObserver>
        );
        // only threshold updating (length changed) [6/6]
        tree.update(
            <IntersectionObserver
                {...initialProps}
                threshold={[0, 0.25, 0.5, 0.75, 1]}
            >
                <div />
            </IntersectionObserver>
        );
        // only threshold updating (scalar) [7/7]
        tree.update(
            <IntersectionObserver {...initialProps} threshold={1}>
                <div />
            </IntersectionObserver>
        );
        // both props and children updating [8/8]
        tree.update(
            <IntersectionObserver {...initialProps}>
                <span />
            </IntersectionObserver>
        );
        // sanity check: nothing else updates [8/8]
        tree.update(
            <IntersectionObserver {...initialProps}>
                <span />
            </IntersectionObserver>
        );

        expect(unobserve).toBeCalledTimes(8);
        expect(observe).toReturnTimes(8);
        expect(observe).toReturnWith(true);

        enablePropTypes();
    });

    test('should throw when updating without a DOM Node', () => {
        global.spyOn(console, 'error'); // suppress error boundary warning
        const tree = renderer.create(
            <IntersectionObserver onChange={noop}>
                <ProxyComponent>
                    <div />
                </ProxyComponent>
            </IntersectionObserver>,
            { createNodeMock }
        );
        const instance = tree.getInstance();
        const observe = jest.spyOn(instance, 'observe');
        const unobserve = jest.spyOn(instance, 'unobserve');

        expect(() =>
            tree.update(
                <IntersectionObserver onChange={noop}>
                    <ProxyComponent key="forcesRender">{null}</ProxyComponent>
                </IntersectionObserver>
            )
        ).toThrowErrorMatchingInlineSnapshot(
            `"ReactIntersectionObserver: Can't find DOM node in the provided children. Make sure to render at least one DOM node in the tree."`
        );

        expect(unobserve).toBeCalledTimes(1);
        expect(observe).toBeCalledTimes(1);
    });

    test('should observe only when updating with a DOM Node', () => {
        global.spyOn(console, 'error'); // suppress error boundary warning

        const sizeAfterUnobserving = observerElementsMap.size;
        const sizeAfterObserving = observerElementsMap.size + 1;
        const tree = renderer.create(
            <IntersectionObserver onChange={noop}>
                <ProxyComponent>
                    <div />
                </ProxyComponent>
            </IntersectionObserver>,
            { createNodeMock }
        );
        const instance = tree.getInstance();
        const unobserve = jest.spyOn(instance, 'unobserve');

        expect(() => {
            tree.update(
                <IntersectionObserver onChange={noop}>
                    <ProxyComponent key="forcesRender">{null}</ProxyComponent>
                </IntersectionObserver>
            );
        }).toThrow();

        expect(unobserve).toBeCalledTimes(1);
        expect(sizeAfterUnobserving).toBe(observerElementsMap.size);

        tree.update(
            <IntersectionObserver onChange={noop}>
                <ProxyComponent>
                    <div />
                </ProxyComponent>
            </IntersectionObserver>
        );

        expect(sizeAfterObserving).toBe(observerElementsMap.size);
    });
});

describe('onChange', () => {
    const boundingClientRect = {};
    const intersectionRect = {};

    test('should invoke a callback for each observer entry', () => {
        const onChange = jest.fn();
        const component = (
            <IntersectionObserver onChange={onChange}>
                <span />
            </IntersectionObserver>
        );
        const instance1 = renderer
            .create(component, { createNodeMock: () => targets.div })
            .getInstance();
        const instance2 = renderer
            .create(React.cloneElement(component), { createNodeMock })
            .getInstance();

        expect(observerElementsMap.size).toBe(1);

        const entry1 = new IntersectionObserverEntry({
            target: targets.div,
            boundingClientRect,
            intersectionRect,
        });
        const entry2 = new IntersectionObserverEntry({
            target,
            boundingClientRect,
            intersectionRect,
        });

        callback([entry1, entry2], instance1.observer);

        expect(onChange).toHaveBeenNthCalledWith(
            1,
            entry1,
            instance1.externalUnobserve
        );
        expect(onChange).toHaveBeenNthCalledWith(
            2,
            entry2,
            instance2.externalUnobserve
        );
    });

    test('unobserve using the second argument from onChange', () => {
        const sizeAfterObserving = observerElementsMap.size + 1;
        const sizeAfterUnobserving = observerElementsMap.size;
        const onChange = (_, unobserve) => {
            unobserve();
        };

        const instance = renderer
            .create(
                <IntersectionObserver onChange={onChange}>
                    <span />
                </IntersectionObserver>,
                { createNodeMock }
            )
            .getInstance();

        expect(sizeAfterObserving).toBe(observerElementsMap.size);

        callback(
            [
                new IntersectionObserverEntry({
                    target,
                    boundingClientRect,
                    intersectionRect,
                }),
            ],
            instance.observer
        );

        expect(sizeAfterUnobserving).toBe(observerElementsMap.size);
    });
});

describe('disabled', () => {
    test('should not observe if disabled', () => {
        const sizeBeforeObserving = observerElementsMap.size;
        renderer.create(
            <IntersectionObserver onChange={noop} disabled={true}>
                <span />
            </IntersectionObserver>,
            { createNodeMock }
        );

        expect(observerElementsMap.size).toBe(sizeBeforeObserving);
    });

    test('should observe if no longer disabled', () => {
        const tree = renderer.create(
            <IntersectionObserver onChange={noop} disabled={true}>
                <span />
            </IntersectionObserver>,
            { createNodeMock }
        );
        const instance = tree.getInstance();
        const observe = jest.spyOn(instance, 'observe');
        const unobserve = jest.spyOn(instance, 'unobserve');

        tree.update(
            <IntersectionObserver onChange={noop}>
                <span />
            </IntersectionObserver>
        );

        expect(unobserve).not.toBeCalled();
        expect(observe).toReturnWith(true);
    });

    test('should unobserve if disabled', () => {
        const tree = renderer.create(
            <IntersectionObserver onChange={noop}>
                <span />
            </IntersectionObserver>,
            { createNodeMock }
        );
        const instance = tree.getInstance();
        const unobserve = jest.spyOn(instance, 'unobserve');
        const observe = jest.spyOn(instance, 'observe');

        tree.update(
            <IntersectionObserver onChange={noop} disabled={true}>
                <span />
            </IntersectionObserver>
        );

        expect(unobserve).toBeCalled();
        expect(observe).toReturnWith(false);
    });
});
