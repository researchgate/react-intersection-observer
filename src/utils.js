import React from 'react';

export function isDOMTypeElement(element) {
    return React.isValidElement(element) && typeof element.type === 'string';
}

const marginRE = /^-?\d*\.?\d+(px|%)$/;

export function parseRootMargin(rootMargin = '0px') {
    if (typeof rootMargin !== 'string') {
        throw new Error('rootMargin must be a String');
    }
    
    // Handles shorthand.
    const [m0 = '0px', m1 = m0, m2 = m0, m3 = m0] = rootMargin.trim().split(/\s+/).map(margin => {
        if (!marginRE.test(margin)) {
            throw new Error('rootMargin must be specified in pixels or percent');
        }
        return margin;
    });

    return `${m0} ${m1} ${m2} ${m3}`;
}

export function shallowCompareOptions(next, prev) {
    if (Array.isArray(next) && Array.isArray(prev)) {
        if (next.length === prev.length) {
            return next.some((_, index) => shallowCompareOptions(next[index], prev[index]));
        }
    }
    return next !== prev;
}
