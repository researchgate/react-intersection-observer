import React from 'react';

export function isDOMTypeElement(element) {
    return React.isValidElement(element) && typeof element.type === 'string';
}

export function parseRootMargin(rootMargin) {
    const marginString = rootMargin || '0px';
    const re = /^-?\d*\.?\d+(px|%)$/;
    const margins = marginString.split(/\s+/).map(margin => {
        if (!re.test(margin)) {
            throw new Error('rootMargin must be specified in pixels or percent');
        }
        return margin;
    });

    // Handles shorthand.
    margins[1] = margins[1] || margins[0];
    margins[2] = margins[2] || margins[0];
    margins[3] = margins[3] || margins[1];

    return margins.join(' ');
}

export function shallowCompareOptions(next, prev) {
    if (Array.isArray(next) && Array.isArray(prev)) {
        if (next.length === prev.length) {
            return next.some((_, index) => shallowCompareOptions(next[index], prev[index]));
        }
    }
    return next !== prev;
}
