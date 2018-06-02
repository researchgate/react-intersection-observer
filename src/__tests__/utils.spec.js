/* eslint-env jest */
import React from 'react';
import { isDOMTypeElement, parseRootMargin, shallowCompare } from '../utils';

describe('isDOMTypeElement', () => {
    test('returns false when is not a valid React element', () => {
        const node = document.createElement('div');
        expect(isDOMTypeElement(node)).toBe(false);
    });
    test('returns false if it is a React element but not a DOM node type', () => {
        const Element = () => <div />;
        expect(isDOMTypeElement(<Element />)).toBe(false);
    });
    test('returns true if it is a React element and DOM node type', () => {
        expect(isDOMTypeElement(<div />)).toBe(true);
    });
});

describe('parseRootMargin', () => {
    test('throws when using wrong units', () => {
        expect(() => parseRootMargin('10')).toThrowErrorMatchingSnapshot();
        expect(() => parseRootMargin('10% 10')).toThrowErrorMatchingSnapshot();
    });

    test('returns rootMargins with all four values', () => {
        expect(parseRootMargin()).toBe('0px 0px 0px 0px');
        expect(parseRootMargin(null)).toBe('0px 0px 0px 0px');
        expect(parseRootMargin('')).toBe('0px 0px 0px 0px');
        expect(parseRootMargin('10px 5px 0%')).toBe('10px 5px 0% 5px');
        expect(parseRootMargin('10px  ')).toBe('10px 10px 10px 10px');
        expect(parseRootMargin(' 10px 5px')).toBe('10px 5px 10px 5px');
        expect(parseRootMargin('10px 5px  0% 1%')).toBe('10px 5px 0% 1%');
    });
});

describe('shallowCompare', () => {
    const comparerFn = (nextProps, prevProps) =>
        ['disabled', 'root', 'rootMargin', 'threshold'].some(option =>
            shallowCompare(nextProps[option], prevProps[option]),
        );

    test('should return true if threshold array length is not the same', () => {
        const nextProps = { threshold: [0.25, 0.5] };
        const prevProps = { threshold: [0.25, 0.5, 0.75] };

        expect(comparerFn(nextProps, prevProps)).toBeTruthy();
    });

    test('should return true if threshold array length is the same but not equal', () => {
        const nextProps = { threshold: [0.25, 0.75, 0.5] };
        const prevProps = { threshold: [0.25, 0.5, 0.75] };

        expect(comparerFn(nextProps, prevProps)).toBeTruthy();
    });

    test('should return false if options are equal', () => {
        const nextProps = { disabled: true, root: 1, rootMargin: 2, threshold: [0.25, 0.75, 0.5] };
        const prevProps = { ...nextProps };

        expect(comparerFn(nextProps, prevProps)).toBeFalsy();
    });

    test('should return true if options are different', () => {
        const nextProps = { disabled: true, root: 1, rootMargin: 2, threshold: [0.25, 0.75, 0.5] };
        const prevProps = { ...nextProps, threshold: 1 };

        expect(comparerFn(nextProps, prevProps)).toBeTruthy();
    });
});
