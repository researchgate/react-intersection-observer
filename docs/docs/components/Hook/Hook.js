import React, { useState } from 'react';
import { useIntersectionObserver } from '../../../../lib/es/src';

const Hook = () => {
    const [visibility, setVisibility] = useState('invisible');

    const handleChange = (entry) => {
        setVisibility(entry.isIntersecting ? 'visible' : 'invisible');
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

export default Hook;
