## Gracefully handling environments without IntersectionObserver support

This module assumes `IntersectionObserver` is available as a global - the polyfill is necessary. However, there may be
situations where we want to do progressive enhancement and only observe elements if it's available.

To prevent an exception in such cases, let's create a component that will gracefully fail if `IntersectionObserver`
doesn't exist, and instead render the passed children naturally.

### Source

```jsx
import React from 'react';
import Observer from '@researchgate/react-intersection-observer';

// Exits early if all IntersectionObserver and IntersectionObserverEntry
// features are natively supported.
const hasNativeSupport =
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype;

export default function NativeObserver(props) {
    return hasNativeSupport ? <Observer {...props} /> : props.children;
}
```
