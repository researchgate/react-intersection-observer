export type Unobserve = () => void;

export type ChangeHandler = (
  entry: IntersectionObserverEntry,
  unobserve: Unobserve
) => void;

export type TargetNode = Element;

export interface Options {
  /**
   * The element that is used as the viewport for checking visibility of the target.
   * Can be specified as string for selector matching within the document.
   * Defaults to the browser viewport if not specified or if null.
   */
  root?: string | Element | null;
  /**
   * Margin around the root. Can have values similar to the CSS margin property,
   * e.g. "10px 20px 30px 40px" (top, right, bottom, left).
   * If the root element is specified, the values can be percentages.
   * This set of values serves to grow or shrink each side of the root element's
   * bounding box before computing intersections.
   * Defaults to all zeros.
   */
  rootMargin?: string;
  /**
   * Either a single number or an array of numbers which indicate at what percentage
   * of the target's visibility the observer's callback should be executed.
   * If you only want to detect when visibility passes the 50% mark, you can use a value of 0.5.
   * If you want the callback run every time visibility passes another 25%,
   * you would specify the array [0, 0.25, 0.5, 0.75, 1].
   * The default is 0 (meaning as soon as even one pixel is visible, the callback will be run).
   * A value of 1.0 means that the threshold isn't considered passed until every pixel is visible.
   */
  threshold?: number | number[];
  /**
   * Controls whether the element should stop being observed by its IntersectionObserver instance.
   * Defaults to false.
   */
  disabled?: boolean;
}

export interface Instance {
  handleChange: (event: IntersectionObserverEntry) => void;
  observer?: IntersectionObserver;
  target?: TargetNode;
}
