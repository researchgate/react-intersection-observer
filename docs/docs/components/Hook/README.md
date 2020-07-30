Basic usage of **useIntersectionObserver** hook that changes the className of
the observed **<div />** element when the visibility changes:

**useIntersectionObserver** have almost the same options as **<Observer />**
element, except **onChange** handler comes as a first argument and every other
option (root, threshold, rootMargin etc.) are second argument

```jsx
import React, { useState } from 'react';
import { useIntersectionObserver } from '@researchgate/react-intersection-observer';

const Hook = () => {
  const [visibility, setVisibility] = useState('invisible');

  const handleChange = (entry) => {
    setVisibility(entry.isIntersecting ? 'visible' : 'invisible');
  };

  const [ref] = useIntersectionObserver(handleChange, { threshold: 0 });

  return (
    <div>
      <div className={`header ${visibility}`}>{visibility}</div>
      <div className="body">
        <div ref={ref} className={`box ${visibility}`} />
      </div>
    </div>
  );
};

export default Hook;
```
