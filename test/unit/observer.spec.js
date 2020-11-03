import 'intersection-observer';
import {
    createObserver,
    findObserverElement,
    getPooled,
    observeElement,
    observerElementsMap,
    unobserveElement,
} from '../../src/observer';

const IntersectionObserver = window.IntersectionObserver;
const defaultOptions = { rootMargin: '-10% 0%', threshold: [0, 0.5, 1] };
const noop = () => {};
const target1 = { nodeType: 1, id: 1, ownerDocument: document };
const target2 = { nodeType: 1, id: 2, ownerDocument: document };

afterEach(() => {
    observerElementsMap.clear();
});

test('createObserver creates a new IntersectionObserver instance', () => {
    window.IntersectionObserver = jest.fn();
    const observer = createObserver(defaultOptions);
    const mockInstance = window.IntersectionObserver.mock.instances[0];
    expect(mockInstance).toBeInstanceOf(window.IntersectionObserver);
    expect(observer).toEqual(mockInstance);
    window.IntersectionObserver = IntersectionObserver;
});

describe('getPooled', () => {
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
        expect(
            getPooled({ rootMargin: '-10% 0%', threshold: [0, 0.5, 1, 0.25] })
        ).toBeNull();
        expect(
            getPooled({ rootMargin: '-10% 0%', threshold: [1, 0.5, 0] })
        ).toBeNull();
    });

    test('throws if rootMargin cannot be parsed', () => {
        expect(() =>
            getPooled({ rootMargin: '-10% 0', threshold: 0 })
        ).toThrowErrorMatchingInlineSnapshot(
            `"rootMargin must be a string literal containing pixels and/or percent values"`
        );
    });

    test('retrieves an existing IntersectionObserver instance given all options match', () => {
        expect(getPooled(defaultOptions)).toEqual(instance);
    });

    test('createObserver returns a pooled IntersectionObserver instance', () => {
        const observer = createObserver(defaultOptions);
        expect(observer).toEqual(getPooled(defaultOptions));
    });
});

describe('observeElement', () => {
    test('observing a React instance when observer is already in observerElementsMap', () => {
        const observer = createObserver(defaultOptions);
        const spy = jest.spyOn(observer, 'observe');
        const targets = new Set();
        observerElementsMap.set(observer, targets);
        const element = { observer, target: target1 };
        observeElement(element);

        expect(Array.from(targets)[0]).toEqual(element);
        expect(spy).toBeCalled();
    });

    test('observing a React instance when observer is not in observerElementsMap yet', () => {
        const observer = createObserver(defaultOptions);
        const spy = jest.spyOn(observer, 'observe');
        const element = { observer, target: target2 };
        observeElement(element);
        const targets = Array.from(observerElementsMap.get(observer));

        expect(targets[0]).toEqual(element);
        expect(spy).toBeCalled();
    });
});

describe('unobserveElement', () => {
    test('unobserving a React instance while instance still in use by other observables', () => {
        const observer = createObserver(defaultOptions);
        const spy = jest.spyOn(observer, 'unobserve');
        const element1 = { observer, target: target1 };
        const element2 = { observer, target: target2 };
        observeElement(element1);
        observeElement(element2);
        unobserveElement(element1, target1);

        expect(observerElementsMap.has(observer)).toBeTruthy();
        expect(spy.mock.calls[0][0]).toEqual(target1);
    });

    test('unobserving a React instance while instance is not in use anymore', () => {
        const observer = createObserver(defaultOptions);
        const spy = jest.spyOn(observer, 'disconnect');
        const element = { observer, target: target1 };
        observeElement(element);
        unobserveElement(element, target1);

        expect(observerElementsMap.has(observer)).toBeFalsy();
        expect(spy).toBeCalled();
    });

    test('unobserving without observer returns undefined', () => {
        expect(unobserveElement({ handleChange: noop })).toBeUndefined();
    });

    test('unobserving without elements does nothing', () => {
        const observer = createObserver(defaultOptions);
        observerElementsMap.set(observer, null);
        const element = { observer, target: target1 };
        const spy = jest.spyOn(observerElementsMap, 'delete');
        unobserveElement(element, target1);
        expect(spy).not.toBeCalled();
    });
});

describe('findObserverElement', () => {
    test('given an entry and no observer returns null', () => {
        const observer = createObserver();
        const entry = { observer, target: target1 };
        observeElement(entry);
        const instance = findObserverElement(null, entry);
        expect(instance).toBeNull();
    });

    test('given an entry without target property throws', () => {
        createObserver();
        expect(() => observeElement({})).toThrowErrorMatchingInlineSnapshot(
            `"Cannot read property 'observe' of undefined"`
        );
    });

    test('an entry matches the observer - single observer instance', () => {
        const observer = createObserver();
        const entry = { observer, target: target1 };
        observeElement(entry, target1);
        const instance = findObserverElement(observer, entry);
        expect(instance).toEqual(entry);
    });

    test('an entry matches the observer - multiple observer instances', () => {
        const observer1 = createObserver();
        const observer2 = createObserver(defaultOptions);
        const entry1 = { observer: observer1, target: target1 };
        const entry2 = { observer: observer2, target: target1 };
        observeElement(entry1);
        observeElement(entry2);
        const instance1 = findObserverElement(observer1, entry1);
        const instance2 = findObserverElement(observer2, entry2);
        expect(instance1).toEqual(entry1);
        expect(instance2).toEqual(entry2);
    });

    test('multiple entries match one observer', () => {
        const observer = createObserver();
        const entry1 = { observer, target: target1 };
        const entry2 = { observer, target: target2 };
        observeElement(entry1);
        observeElement(entry2);
        const instance1 = findObserverElement(observer, entry1);
        const instance2 = findObserverElement(observer, entry2);
        expect(instance1).toEqual(entry1);
        expect(instance2).toEqual(entry2);
    });

    test('multiple entries match multiple observers', () => {
        const observer1 = createObserver();
        const observer2 = createObserver(defaultOptions);
        const entry1 = { observer: observer1, target: target1 };
        const entry2 = { observer: observer2, target: target2 };
        observeElement(entry1);
        observeElement(entry2);
        const instance1 = findObserverElement(observer1, entry1);
        const instance2 = findObserverElement(observer2, entry2);
        expect(instance1).toEqual(entry1);
        expect(instance2).toEqual(entry2);
    });

    test('two subsequent createObserver calls should not produce two observers', () => {
        const observer1 = createObserver();
        const observer2 = createObserver();
        expect(observer1).toEqual(observer2);
    });

    test('observing element should add target to observerElementsMap even if there is no such observer key', () => {
        const observer = createObserver();
        const entry = { observer, target: target1 };
        observeElement(entry);
        unobserveElement(entry, entry.target);
        observeElement(entry);
        const instance = findObserverElement(observer, entry);
        expect(instance).toEqual(entry);
    });
});
