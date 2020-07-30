
_Use the second argument of `onChange(event, unobserve)` to customize how you prefer to stop observing the target. You
can also set the prop `disabled: true` in the options to achieve the same effect._

```jsx
import React, { useState } from 'react';
import { useIntersectionObserver } from '@researchgate/react-intersection-observer';

const HookOnlyOnce = () => {
    const [visibility, setVisibility] = useState('invisible');

    const handleChange = (entry, unobserve) => {
        if (entry.isIntersecting) {
            setVisibility('visible');
            unobserve();
        }
    };

    const [ref] = useIntersectionObserver(handleChange);

    return (
        <div>
            <div className={`header ${visibility}`}>{visibility}</div>
            <div className="body">
                <div ref={ref} className={`box ${visibility}`} />
            </div>
        </div>
    );
};

export default HookOnlyOnce;
```
