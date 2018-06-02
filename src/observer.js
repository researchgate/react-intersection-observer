import { parseRootMargin, shallowCompareOptions } from './utils';

export const observerElementsMap = new Map();

export function getPooled(options = {}) {
    const root = options.root || null;
    const rootMargin = parseRootMargin(options.rootMargin);
    const threshold = Array.isArray(options.threshold)
        ? options.threshold
        : [typeof options.threshold !== 'undefined' ? options.threshold : 0];
    const observers = observerElementsMap.keys();
    let observer;
    while ((observer = observers.next().value)) {
        const unmatched =
            root !== observer.root ||
            rootMargin !== observer.rootMargin ||
            shallowCompareOptions(threshold, observer.thresholds);

        if (!unmatched) {
            return observer;
        }
    }
    return null;
}

export function findObserverElement(entry, observer) {
    const elements = observerElementsMap.get(observer);
    if (elements) {
        const values = elements.values();
        let element;
        while ((element = values.next().value)) {
            if (element.target === entry.target) {
                return element;
            }
        }
    }
    return null;
}

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
        const instance = findObserverElement(entry, observer);
        if (instance) {
            instance.handleChange(entry);
        }
    });
}

export function createObserver(options) {
    return getPooled(options) || new IntersectionObserver(callback, options);
}

export function observeElement(element) {
    let targets;
    if (observerElementsMap.has(element.observer)) {
        targets = observerElementsMap.get(element.observer);
    } else {
        targets = new Set();
        observerElementsMap.set(element.observer, targets);
    }
    targets.add(element);
    element.observer.observe(element.target);
}

export function unobserveElement(element) {
    if (observerElementsMap.has(element.observer)) {
        const targets = observerElementsMap.get(element.observer);
        if (targets.delete(element)) {
            if (targets.size > 0) {
                element.observer.unobserve(element.target);
            } else {
                element.observer.disconnect();
                observerElementsMap.delete(element.observer);
            }
        }
    }
}
