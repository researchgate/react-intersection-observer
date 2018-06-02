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
        const unmatched = [
            [root, observer.root],
            [rootMargin, observer.rootMargin],
            [threshold, observer.thresholds],
        ].some(option => shallowCompareOptions(...option));

        if (!unmatched) {
            return observer;
        }
    }
    return null;
}

/**
 * If instances of a class can be reused because the options map,
 * we avoid creating instances of Intersection Observer by reusing them.
 */
export default class IntersectionObserverContainer {
    static create(callback, options) {
        return getPooled(options) || new IntersectionObserver(callback, options);
    }

    static findElement(entry, observer) {
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

    static observe(element) {
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

    static unobserve(element) {
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

    static clear() {
        observerElementsMap.clear();
    }

    static count() {
        return observerElementsMap.size;
    }
}
