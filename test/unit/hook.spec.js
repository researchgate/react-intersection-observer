import { renderHook, act } from '@testing-library/react-hooks';
import { useIntersectionObserver } from '../../src/hook';
import {
    createObserver,
    observeElement,
    unobserveElement,
} from '../../src/observer';

jest.mock('../../src/observer');
createObserver.mockReturnValue({});

const lastElement = (arr) => arr[arr.length - 1];

const noop = () => {};

afterEach(() => {
    jest.clearAllMocks();
});

describe('useIntersectionObserver', () => {
    it('creates intersection observer on call once', () => {
        renderHook(() => useIntersectionObserver(noop));

        expect(createObserver).toBeCalledTimes(1);
    });

    it('dont recreate intersection observer', () => {
        const { rerender } = renderHook(() => useIntersectionObserver(noop));

        rerender();

        expect(createObserver).toBeCalledTimes(1);
    });

    it('recreate intersection observer if rootMargin changes', () => {
        const { rerender } = renderHook(
            (props) => useIntersectionObserver(...props),
            { initialProps: [noop, { rootMargin: '0%' }] }
        );

        rerender([noop, { rootMargin: '25%' }]);

        expect(createObserver).toBeCalledTimes(2);
    });

    it('recreate intersection observer if root changes', () => {
        const { rerender } = renderHook(
            (props) => useIntersectionObserver(...props),
            { initialProps: [noop, { root: '#root1' }] }
        );

        rerender([noop, { root: '#root2' }]);

        expect(createObserver).toBeCalledTimes(2);
    });

    it('recreate intersection observer if threshold changes', () => {
        const { rerender } = renderHook(
            (props) => useIntersectionObserver(...props),
            { initialProps: [noop, { threshold: 0 }] }
        );

        rerender([noop, { threshold: 20 }]);

        expect(createObserver).toBeCalledTimes(2);
    });

    it('dont create observer if disabled', () => {
        renderHook(() => useIntersectionObserver(noop, { disabled: true }));

        expect(createObserver).toBeCalledTimes(0);
    });

    it('create observer if its disabled then enabled', () => {
        const { rerender } = renderHook(
            (props) => useIntersectionObserver(...props),
            { initialProps: [noop, { disabled: true }] }
        );

        rerender([noop, { disabled: false }]);

        expect(createObserver).toBeCalledTimes(1);
    });

    it('dont recreate observer if enabled then disabled', () => {
        const { rerender } = renderHook(
            (props) => useIntersectionObserver(...props),
            { initialProps: [noop] }
        );

        rerender([noop, { disabled: true }]);

        expect(createObserver).toBeCalledTimes(1);
    });

    it('creates intersection observer on call with right options', () => {
        const elementStub = {};
        const rootMargin = '0% 0% -25%';
        const threshold = 0.5;

        renderHook(() =>
            useIntersectionObserver(noop, {
                root: elementStub,
                rootMargin,
                threshold,
            })
        );

        expect(createObserver).toBeCalledWith({
            root: elementStub,
            rootMargin,
            threshold,
        });
    });

    it('starts observing element when it gets the ref', () => {
        const spanElement = {};
        const {
            result: {
                current: [ref],
            },
        } = renderHook(() => useIntersectionObserver(noop));

        act(() => {
            ref(spanElement);
        });

        expect(observeElement).toBeCalledTimes(1);
        const [instanceArg] = lastElement(observeElement.mock.calls);
        expect(instanceArg.target).toBe(spanElement);
    });

    it('dont reobserve on rerender without changing props', () => {
        const spanElement = {};
        const {
            result: {
                current: [ref],
            },
            rerender,
        } = renderHook(() => useIntersectionObserver(noop, {}));

        act(() => {
            ref(spanElement);
        });

        rerender();

        expect(observeElement).toBeCalledTimes(1);
    });

    it('unobserve if ref is called with null (unmounted)', () => {
        const spanElement = {};
        const {
            result: {
                current: [ref],
            },
        } = renderHook(() => useIntersectionObserver(noop, {}));

        act(() => {
            ref(spanElement);
            // Imitating unmount
            ref(null);
        });

        expect(unobserveElement).toBeCalledTimes(1);
    });

    it('unobserve if called unobserver', () => {
        const spanElement = {};
        const {
            result: {
                current: [setRef, unobserve],
            },
        } = renderHook(() => useIntersectionObserver(noop));

        act(() => {
            setRef(spanElement);
            unobserve();
        });

        expect(unobserveElement).toBeCalledTimes(1);
    });

    it('unobserve and reobserve if component ref changes', () => {
        const spanElement = {};
        const spanElement2 = {};
        const {
            result: {
                current: [ref],
            },
        } = renderHook(() => useIntersectionObserver(noop, {}));

        act(() => {
            ref(spanElement);
            ref(spanElement2);
        });

        expect(observeElement).toBeCalledTimes(2);
        expect(unobserveElement).toBeCalledTimes(1);
    });

    it('unobserve and reobserve if component unmount then remounts', () => {
        const spanElement = {};
        const {
            result: {
                current: [ref],
            },
        } = renderHook(() => useIntersectionObserver(noop, {}));

        act(() => {
            ref(spanElement);
            ref(null);
            ref(spanElement);
        });

        expect(observeElement).toBeCalledTimes(2);
        expect(unobserveElement).toBeCalledTimes(1);
    });

    it('unobserve and reobserve if component unmount then remounts with different ref', () => {
        const spanElement = {};
        const spanElement2 = {};
        const {
            result: {
                current: [ref],
            },
        } = renderHook(() => useIntersectionObserver(noop, {}));

        act(() => {
            ref(spanElement);
            ref(null);
            ref(spanElement2);
        });

        expect(observeElement).toBeCalledTimes(2);
        expect(unobserveElement).toBeCalledTimes(1);
    });

    it('unobserve, reobserves and unobserve if component unmount then remounts with different ref then called unobserve', () => {
        const spanElement = {};
        const spanElement2 = {};
        const {
            result: {
                current: [ref, unobserve],
            },
        } = renderHook(() => useIntersectionObserver(noop, {}));

        act(() => {
            ref(spanElement);
            ref(null);
            ref(spanElement2);
            unobserve();
        });

        expect(observeElement).toBeCalledTimes(2);
        expect(unobserveElement).toBeCalledTimes(2);

        const [, firstUnobserveTargetArg] = unobserveElement.mock.calls[0];
        expect(firstUnobserveTargetArg).toBe(spanElement);

        const [, secondUnobserveElementTargetArg] = lastElement(
            unobserveElement.mock.calls
        );
        expect(secondUnobserveElementTargetArg).toBe(spanElement2);
    });

    it('dont observe if disabled', () => {
        const spanElement = {};
        const {
            result: {
                current: [ref],
            },
        } = renderHook(() => useIntersectionObserver(noop, { disabled: true }));

        act(() => {
            ref(spanElement);
        });

        expect(observeElement).toBeCalledTimes(0);
    });

    it('observe if disabled then enabled', () => {
        const spanElement = {};
        const {
            result: {
                current: [ref],
            },
            rerender,
        } = renderHook((props) => useIntersectionObserver(...props), {
            initialProps: [noop, { disabled: true }],
        });

        act(() => {
            ref(spanElement);
        });

        rerender([noop, { disabled: false }]);

        expect(observeElement).toBeCalledTimes(1);
    });

    it('observe then unobserve if enabled then disabled', () => {
        const spanElement = {};
        const {
            result: {
                current: [ref],
            },
            rerender,
        } = renderHook((props) => useIntersectionObserver(...props), {
            initialProps: [noop, { disabled: false }],
        });

        act(() => {
            ref(spanElement);
        });

        rerender([noop, { disabled: true }]);

        expect(observeElement).toBeCalledTimes(1);
        expect(unobserveElement).toBeCalledTimes(1);
    });
});
