import React, { useState } from 'react';
import { useIntersectionObserver } from '../../../..';

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
