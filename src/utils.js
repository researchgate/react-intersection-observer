import React from 'react';

export function isDOMTypeElement(element) {
  return React.isValidElement(element) && typeof element.type === 'string';
}

const marginRE = /^-?\d*\.?\d+(px|%)$/;

export function parseRootMargin(rootMargin) {
  const marginString = rootMargin ? rootMargin.trim() : '0px';
  const [m0 = '0px', m1 = m0, m2 = m0, m3 = m1] = marginString
    .split(/\s+/)
    .map((margin) => {
      if (!marginRE.test(margin)) {
        throw new Error(
          'rootMargin must be a string literal containing pixels and/or percent values'
        );
      }
      return margin;
    });

  return `${m0} ${m1} ${m2} ${m3}`;
}

export function shallowCompare(next, prev) {
  if (Array.isArray(next) && Array.isArray(prev)) {
    if (next.length === prev.length) {
      return next.some((_, index) => shallowCompare(next[index], prev[index]));
    }
  }
  return next !== prev;
}
