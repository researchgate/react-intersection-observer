/* eslint-env jest */
import 'intersection-observer';
import IntersectionObserverContainer, { storage, getPooled } from '../src/IntersectionObserverContainer';

const IntersectionObserver = global.IntersectionObserver;
const defaultOptions = { rootMargin: '-10% 0%', threshold: [0, 0.5, 1] };
const noop = () => {};

afterEach(() => {
  IntersectionObserverContainer.clear();
});

test('IntersectionObserverContainer creates a new IntersectionObserver instance', () => {
  global.IntersectionObserver = jest.fn();
  const observer = IntersectionObserverContainer.create(noop, defaultOptions);
  const mockInstance = global.IntersectionObserver.mock.instances[0];
  expect(mockInstance).toBeInstanceOf(global.IntersectionObserver);
  expect(observer).toEqual(mockInstance);
  global.IntersectionObserver = IntersectionObserver;
});

test('clear removes all pooled objects from storage', () => {
  const instance = new IntersectionObserver(noop, defaultOptions);
  storage.set(instance);
  IntersectionObserverContainer.clear();
  expect(storage.size).toEqual(0);
});

test('count returns the size of the storage', () => {
  const instance = new IntersectionObserver(noop, defaultOptions);
  storage.set(instance);
  expect(IntersectionObserverContainer.count()).toEqual(1);
});

describe('#getPooled', () => {
  let instance;

  beforeEach(() => {
    instance = new IntersectionObserver(noop, defaultOptions);
    storage.set(instance);
  });

  test('returns nothing given options did not match', () => {
    expect(getPooled()).toBeNull();
    expect(getPooled({ rootMargin: '-20% 0%', threshold: 1 })).toBeNull();
    expect(getPooled({ rootMargin: '-10% 0%', threshold: 0 })).toBeNull();
    expect(getPooled({ threshold: 0.5 })).toBeNull();
  });

  test('throws if rootMargin cannot be parsed', () => {
    expect(() => getPooled({ rootMargin: '-10% 0', threshold: 0 })).toThrow(
      'rootMargin must be specified in pixels or percent'
    );
  });

  test('retrieves an existing IntersectionObserver instance given all options match', () => {
    expect(getPooled(defaultOptions)).toEqual(instance);
  });

  test('new IntersectionObserverContainer returns a pooled IntersectionObserver instance', () => {
    const observer = IntersectionObserverContainer.create(noop, defaultOptions);
    expect(observer).toEqual(getPooled(defaultOptions));
  });
});

describe('#observe', () => {
  test('observing a React instance when observer is already in storage', () => {
    const observer = IntersectionObserverContainer.create(noop, defaultOptions);
    const spy = jest.spyOn(observer, 'observe');
    const targets = new Set();
    storage.set(observer, targets);
    const element = { target: { nodeType: 1, id: 1 }, observer };
    IntersectionObserverContainer.observe(element);

    expect(Array.from(targets)[0]).toEqual(element);
    expect(spy).toBeCalled();
  });

  test('observing a React instance when observer is not in storage yet', () => {
    const observer = IntersectionObserverContainer.create(noop, defaultOptions);
    const spy = jest.spyOn(observer, 'observe');
    const element = { target: { nodeType: 1, id: 2 }, observer };
    IntersectionObserverContainer.observe(element);
    const targets = Array.from(storage.get(observer));

    expect(targets[0]).toEqual(element);
    expect(spy).toBeCalled();
  });
});

describe('#unobserve', () => {
  test('unobserving a React instance while instance still in use by other observables', () => {
    const observer = IntersectionObserverContainer.create(noop, defaultOptions);
    const spy = jest.spyOn(observer, 'unobserve');
    const element1 = { target: { nodeType: 1, id: 1 }, observer };
    const element2 = { target: { nodeType: 1, id: 2 }, observer };
    IntersectionObserverContainer.observe(element1);
    IntersectionObserverContainer.observe(element2);
    IntersectionObserverContainer.unobserve(element1);

    expect(storage.has(observer)).toBeTruthy();
    expect(spy.mock.calls[0][0]).toEqual({ nodeType: 1, id: 1 });
  });

  test('unobserving a React instance while instance is not in use anymore', () => {
    const observer = IntersectionObserverContainer.create(noop, defaultOptions);
    const spy = jest.spyOn(observer, 'disconnect');
    const element = { target: { nodeType: 1, id: 1 }, observer };
    IntersectionObserverContainer.observe(element);
    IntersectionObserverContainer.unobserve(element);

    expect(storage.has(observer)).toBeFalsy();
    expect(spy).toBeCalled();
  });
});

describe('#findElement', () => {
  test('given an entry and no observer returns null', () => {
    const observer = IntersectionObserverContainer.create(noop);
    const entry = { target: { nodeType: 1, id: 1 }, observer };
    IntersectionObserverContainer.observe(entry);
    const instance = IntersectionObserverContainer.findElement(entry);
    expect(instance).toBeNull();
  });

  test('given an entry without target property throws', () => {
    IntersectionObserverContainer.create(noop);
    expect(() => IntersectionObserverContainer.observe({})).toThrowErrorMatchingSnapshot();
  });

  test('an entry matches the observer - single observer instance', () => {
    const observer = IntersectionObserverContainer.create(noop);
    const entry = { target: { nodeType: 1, id: 1 }, observer };
    IntersectionObserverContainer.observe(entry);
    const instance = IntersectionObserverContainer.findElement(entry, observer);
    expect(instance).toEqual(entry);
  });

  test('an entry matches the observer - multiple observer instances', () => {
    const observer1 = IntersectionObserverContainer.create(noop);
    const observer2 = IntersectionObserverContainer.create(noop, defaultOptions);
    const entry1 = { target: { nodeType: 1, id: 1 }, observer: observer1 };
    const entry2 = { target: { nodeType: 1, id: 1 }, observer: observer2 };
    IntersectionObserverContainer.observe(entry1);
    IntersectionObserverContainer.observe(entry2);
    const instance1 = IntersectionObserverContainer.findElement(entry1, observer1);
    const instance2 = IntersectionObserverContainer.findElement(entry2, observer2);
    expect(instance1).toEqual(entry1);
    expect(instance2).toEqual(entry2);
  });

  test('multiple entries match one observer', () => {
    const observer = IntersectionObserverContainer.create(noop);
    const entry1 = { target: { nodeType: 1, id: 1 }, observer };
    const entry2 = { target: { nodeType: 1, id: 2 }, observer };
    IntersectionObserverContainer.observe(entry1);
    IntersectionObserverContainer.observe(entry2);
    const instance1 = IntersectionObserverContainer.findElement(entry1, observer);
    const instance2 = IntersectionObserverContainer.findElement(entry2, observer);
    expect(instance1).toEqual(entry1);
    expect(instance2).toEqual(entry2);
  });

  test('multiple entries match multiple observers', () => {
    const observer1 = IntersectionObserverContainer.create(noop);
    const observer2 = IntersectionObserverContainer.create(noop, defaultOptions);
    const entry1 = { target: { nodeType: 1, id: 1 }, observer: observer1 };
    const entry2 = { target: { nodeType: 1, id: 2 }, observer: observer2 };
    IntersectionObserverContainer.observe(entry1);
    IntersectionObserverContainer.observe(entry2);
    const instance1 = IntersectionObserverContainer.findElement(entry1, observer1);
    const instance2 = IntersectionObserverContainer.findElement(entry2, observer2);
    expect(instance1).toEqual(entry1);
    expect(instance2).toEqual(entry2);
  });
});

describe('#takeRecords', () => {
  test('should get called once on the observer retrieved by matching options', () => {
    const options = { ...defaultOptions, threshold: 1 };
    const observer = IntersectionObserverContainer.create(noop, options);
    const element = { target: { nodeType: 1, id: 1 }, observer };
    IntersectionObserverContainer.observe(element);
    const spy = jest.spyOn(observer, 'takeRecords');
    IntersectionObserverContainer.takeRecords(options);
    IntersectionObserverContainer.takeRecords(defaultOptions);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should get called once for all observers not having options argument', () => {
    const observer1 = IntersectionObserverContainer.create(noop, defaultOptions);
    const element1 = { target: { nodeType: 1, id: 1 }, observer: observer1 };
    IntersectionObserverContainer.observe(element1);
    const options = { ...defaultOptions, threshold: 1 };
    const observer2 = IntersectionObserverContainer.create(noop, options);
    const element2 = { target: { nodeType: 1, id: 1 }, observer: observer2 };
    IntersectionObserverContainer.observe(element2);
    const spy1 = jest.spyOn(observer1, 'takeRecords');
    const spy2 = jest.spyOn(observer2, 'takeRecords');
    IntersectionObserverContainer.takeRecords();
    expect(storage.size).toEqual(2);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  });

  test('never gets called when storage holds no observers', () => {
    const observer = IntersectionObserverContainer.create(noop, defaultOptions);
    const spy = jest.spyOn(observer, 'takeRecords');
    IntersectionObserverContainer.takeRecords();
    IntersectionObserverContainer.takeRecords(defaultOptions);
    expect(spy).not.toBeCalled();
  });
});
