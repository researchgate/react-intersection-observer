import { useRef, useCallback, useMemo } from 'react';
import { createObserver, observeElement, unobserveElement } from './observer';
import { ChangeHandler, Options, Unobserve, Instance } from './types';

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
    handleChange: (ev) => onChange(ev, () => {}),
  });

  const unobserve = useCallback(() => {
    if (instanceRef.current.target && observingRef.current) {
      unobserveElement(instanceRef.current, instanceRef.current.target);
      observingRef.current = false;
    }
  }, []);

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

  const handleChange = (event: IntersectionObserverEntry) =>
    onChange(event, unobserve);

  instanceRef.current.handleChange = handleChange;

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
      threshold,
    });

    instanceRef.current.observer = obs;

    unobserve();
    observe();

    return obs;
  }, [root, rootMargin, threshold, disabled]);

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
