function parseRootMargin(rootMargin) {
  const marginString = rootMargin || '0px';
  const re = /^(-?\d*\.?\d+)(px|%)$/;
  const margins = marginString.split(/\s+/).map(margin => {
    if (!re.test(margin)) {
      throw new Error('rootMargin must be specified in pixels or percent');
    }
    return margin;
  });

  // Handles shorthand.
  margins[1] = margins[1] || margins[0];
  margins[2] = margins[2] || margins[0];
  margins[3] = margins[3] || margins[1];

  return margins.join(' ');
}

export function getPooled(options = {}) {
  let matchCount = 0;
  const root = options.root || null;
  const rootMargin = parseRootMargin(options.rootMargin);
  const threshold = Array.isArray(options.threshold)
    ? options.threshold
    : [typeof options.threshold !== 'undefined' ? options.threshold : 0];
  // eslint-disable-next-line no-restricted-syntax
  for (const observer of storage.keys()) {
    let thresholdMatches = threshold;
    let thresholds = observer.thresholds;
    if (threshold.length > observer.thresholds) {
      thresholdMatches = observer.thresholds;
      thresholds = threshold;
    }
    matchCount += thresholds.every(v => v === thresholdMatches[thresholdMatches.indexOf(v)]);
    matchCount += root === observer.root;
    matchCount += rootMargin === observer.rootMargin;
    if (matchCount === 3) {
      return observer;
    }
  }
  return null;
}

export const storage = new Map();

/**
 * If instances of a class can be reused because the options map,
 * we avoid creating instances of Intersection Observer by reusing them.
 */
export default class IntersectionObserverContainer {
  static create(callback, options) {
    return getPooled(options) || new IntersectionObserver(callback, options);
  }

  static findElement(entry, observer) {
    const elements = storage.get(observer);
    if (elements) {
      // eslint-disable-next-line no-restricted-syntax
      for (const element of elements.values()) {
        if (element.target === entry.target) {
          return element;
        }
      }
    }
    return null;
  }

  static takeRecords(options) {
    if (options) {
      const observer = getPooled(options);
      if (observer) {
        observer.takeRecords();
      }
    } else {
      // eslint-disable-next-line no-restricted-syntax
      for (const observer of storage.keys()) {
        observer.takeRecords();
      }
    }
  }

  static observe(element) {
    let targets;
    if (storage.has(element.observer)) {
      targets = storage.get(element.observer);
    } else {
      targets = new Set();
      storage.set(element.observer, targets);
    }
    targets.add(element);
    element.observer.observe(element.target);
  }

  static unobserve(element) {
    if (storage.has(element.observer)) {
      const targets = storage.get(element.observer);
      if (targets.delete(element)) {
        if (targets.size > 0) {
          element.observer.unobserve(element.target);
        } else {
          element.observer.disconnect();
          storage.delete(element.observer);
        }
      }
    }
  }

  static clear() {
    storage.clear();
  }

  static count() {
    return storage.size;
  }
}
