/* eslint-env jest */
import 'intersection-observer';
import {
    createObserver,
    findObserverElement,
    getPooled,
    observeElement,
    observerElementsMap,
    unobserveElement,
} from '../IntersectionObserverContainer';

const IntersectionObserver = window.IntersectionObserver;
const defaultOptions = { rootMargin: '-10% 0%', threshold: [0, 0.5, 1] };
const noop = () => {};

afterEach(() => {
    observerElementsMap.clear();
});

test('createObserver creates a new IntersectionObserver instance', () => {
    window.IntersectionObserver = jest.fn();
    const observer = createObserver(noop, defaultOptions);
    const mockInstance = window.IntersectionObserver.mock.instances[0];
    expect(mockInstance).toBeInstanceOf(window.IntersectionObserver);
    expect(observer).toEqual(mockInstance);
    window.IntersectionObserver = IntersectionObserver;
});

describe('#getPooled', () => {
    let instance;

    beforeEach(() => {
        instance = new IntersectionObserver(noop, defaultOptions);
        observerElementsMap.set(instance);
    });

    test('returns nothing given options did not match', () => {
        expect(getPooled()).toBeNull();
        expect(getPooled({ rootMargin: '-20% 0%', threshold: 1 })).toBeNull();
        expect(getPooled({ rootMargin: '-10% 0%', threshold: 0 })).toBeNull();
        expect(getPooled({ threshold: 0.5 })).toBeNull();
    });

    test('returns nothing given threshold did not match', () => {
        expect(getPooled({ rootMargin: '-10% 0%', threshold: [0, 0.5, 1, 0.25] })).toBeNull();
        expect(getPooled({ rootMargin: '-10% 0%', threshold: [1, 0.5, 0] })).toBeNull();
    });

    test('throws if rootMargin cannot be parsed', () => {
        expect(() => getPooled({ rootMargin: '-10% 0', threshold: 0 })).toThrowErrorMatchingSnapshot();
    });

    test('retrieves an existing IntersectionObserver instance given all options match', () => {
        expect(getPooled(defaultOptions)).toEqual(instance);
    });

    test('createObserver returns a pooled IntersectionObserver instance', () => {
        const observer = createObserver(noop, defaultOptions);
        expect(observer).toEqual(getPooled(defaultOptions));
    });
});

describe('#observeElement', () => {
    test('observing a React instance when observer is already in observerElementsMap', () => {
        const observer = createObserver(noop, defaultOptions);
        const spy = jest.spyOn(observer, 'observe');
        const targets = new Set();
        observerElementsMap.set(observer, targets);
        const element = { target: { nodeType: 1, id: 1 }, observer };
        observeElement(element);

        expect(Array.from(targets)[0]).toEqual(element);
        expect(spy).toBeCalled();
    });

    test('observing a React instance when observer is not in observerElementsMap yet', () => {
        const observer = createObserver(noop, defaultOptions);
        const spy = jest.spyOn(observer, 'observe');
        const element = { target: { nodeType: 1, id: 2 }, observer };
        observeElement(element);
        const targets = Array.from(observerElementsMap.get(observer));

        expect(targets[0]).toEqual(element);
        expect(spy).toBeCalled();
    });
});

describe('#unobserveElement', () => {
    test('unobserving a React instance while instance still in use by other observables', () => {
        const observer = createObserver(noop, defaultOptions);
        const spy = jest.spyOn(observer, 'unobserve');
        const element1 = { target: { nodeType: 1, id: 1 }, observer };
        const element2 = { target: { nodeType: 1, id: 2 }, observer };
        observeElement(element1);
        observeElement(element2);
        unobserveElement(element1);

        expect(observerElementsMap.has(observer)).toBeTruthy();
        expect(spy.mock.calls[0][0]).toEqual({ nodeType: 1, id: 1 });
    });

    test('unobserving a React instance while instance is not in use anymore', () => {
        const observer = createObserver(noop, defaultOptions);
        const spy = jest.spyOn(observer, 'disconnect');
        const element = { target: { nodeType: 1, id: 1 }, observer };
        observeElement(element);
        unobserveElement(element);

        expect(observerElementsMap.has(observer)).toBeFalsy();
        expect(spy).toBeCalled();
    });
});

describe('#findObserverElement', () => {
    test('given an entry and no observer returns null', () => {
        const observer = createObserver(noop);
        const entry = { target: { nodeType: 1, id: 1 }, observer };
        observeElement(entry);
        const instance = findObserverElement(entry);
        expect(instance).toBeNull();
    });

    test('given an entry without target property throws', () => {
        createObserver(noop);
        expect(() => observeElement({})).toThrowErrorMatchingSnapshot();
    });

    test('an entry matches the observer - single observer instance', () => {
        const observer = createObserver(noop);
        const entry = { target: { nodeType: 1, id: 1 }, observer };
        observeElement(entry);
        const instance = findObserverElement(entry, observer);
        expect(instance).toEqual(entry);
    });

    test('an entry matches the observer - multiple observer instances', () => {
        const observer1 = createObserver(noop);
        const observer2 = createObserver(noop, defaultOptions);
        const entry1 = { target: { nodeType: 1, id: 1 }, observer: observer1 };
        const entry2 = { target: { nodeType: 1, id: 1 }, observer: observer2 };
        observeElement(entry1);
        observeElement(entry2);
        const instance1 = findObserverElement(entry1, observer1);
        const instance2 = findObserverElement(entry2, observer2);
        expect(instance1).toEqual(entry1);
        expect(instance2).toEqual(entry2);
    });

    test('multiple entries match one observer', () => {
        const observer = createObserver(noop);
        const entry1 = { target: { nodeType: 1, id: 1 }, observer };
        const entry2 = { target: { nodeType: 1, id: 2 }, observer };
        observeElement(entry1);
        observeElement(entry2);
        const instance1 = findObserverElement(entry1, observer);
        const instance2 = findObserverElement(entry2, observer);
        expect(instance1).toEqual(entry1);
        expect(instance2).toEqual(entry2);
    });

    test('multiple entries match multiple observers', () => {
        const observer1 = createObserver(noop);
        const observer2 = createObserver(noop, defaultOptions);
        const entry1 = { target: { nodeType: 1, id: 1 }, observer: observer1 };
        const entry2 = { target: { nodeType: 1, id: 2 }, observer: observer2 };
        observeElement(entry1);
        observeElement(entry2);
        const instance1 = findObserverElement(entry1, observer1);
        const instance2 = findObserverElement(entry2, observer2);
        expect(instance1).toEqual(entry1);
        expect(instance2).toEqual(entry2);
    });
});
