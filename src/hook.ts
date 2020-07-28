import { useRef, useCallback, useMemo } from 'react';
import { createObserver, observeElement, unobserveElement } from './observer';
import { ChangeHandler, Options, Unobserve, Instance } from './types';
import { thresholdCacheKey } from './utils';

const noop = () => {};

/**
 * useIntersectionObserver hook that has almost the same api as <Observer />
 *
 * @param {ChangeHandler} onChange Function that will be invoked whenever the intersection value for this element changes.
 * @param {Options} options Option to customize instersction observer instance or disable it
 *
 * @example
 * const App = () => {
 *   const onChange = ({ isIntersecting }) => console.log({ isIntersecting })
 *   const ref = useIntersectionObserver(onChange)
 *
 *   return <div ref={ref} />
 * }
 */
export const useIntersectionObserver = (
  /**
   * Function that will be invoked whenever the intersection value for this element changes.
   */
  onChange: ChangeHandler,
  { root, rootMargin, threshold, disabled }: Options = {}
): [React.RefCallback<any>, Unobserve] => {
  const observingRef = useRef(false);

  const instanceRef = useRef<Instance>({
    // unobserve function needs an instance and instance.handleChange needs an unobserve to be caught by closure.
    // So it's essentially a circular reference that's resolved by assigning handleChange later
    handleChange(event) {
      /* istanbul ignore next line */
      onChange(event, noop);
    },
  });

  const unobserve = useCallback(() => {
    if (instanceRef.current.target && observingRef.current) {
      unobserveElement(instanceRef.current, instanceRef.current.target);
      observingRef.current = false;
    }
  }, []);

  instanceRef.current.handleChange = function handleChange(
    event: IntersectionObserverEntry
  ) {
    /* istanbul ignore next line */
    onChange(event, unobserve);
  };

  const observe = () => {
    if (
      instanceRef.current.observer &&
      instanceRef.current.target &&
      !observingRef.current
    ) {
      observeElement(instanceRef.current);
      observingRef.current = true;
    }
  };

  const memoizedThreshold = useMemo(() => threshold, [
    thresholdCacheKey(threshold),
  ]);

  const observer = useMemo(() => {
    if (disabled) {
      unobserve();
      instanceRef.current.observer = undefined;
      return undefined;
    }

    const rootOption =
      typeof root === 'string' ? document.querySelector(root) : root;

    const obs = createObserver({
      root: rootOption,
      rootMargin,
      threshold: memoizedThreshold,
    });

    instanceRef.current.observer = obs;

    unobserve();
    observe();

    return obs;
  }, [root, rootMargin, memoizedThreshold, disabled]);

  const setRef = useCallback<React.RefCallback<any>>(
    (node) => {
      const isNewNode = node != null && instanceRef.current.target !== node;

      if (!observer) {
        unobserve();
      }

      if (isNewNode) {
        unobserve();
        instanceRef.current.target = node;
        observe();
      }

      if (!node) {
        unobserve();
        instanceRef.current.target = undefined;
      }
    },
    [observer]
  );

  return [setRef, unobserve];
};
