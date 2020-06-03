import { parseRootMargin, shallowCompare } from '../../src/utils';

describe('parseRootMargin', () => {
    test('throws when using wrong units', () => {
        expect(() => parseRootMargin('10')).toThrowErrorMatchingInlineSnapshot(
            `"rootMargin must be a string literal containing pixels and/or percent values"`
        );
        expect(() =>
            parseRootMargin('10% 10')
        ).toThrowErrorMatchingInlineSnapshot(
            `"rootMargin must be a string literal containing pixels and/or percent values"`
        );
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
        ['disabled', 'root', 'rootMargin', 'threshold'].some((option) =>
            shallowCompare(nextProps[option], prevProps[option])
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
        const nextProps = {
            disabled: true,
            root: 1,
            rootMargin: 2,
            threshold: [0.25, 0.75, 0.5],
        };
        const prevProps = { ...nextProps };

        expect(comparerFn(nextProps, prevProps)).toBeFalsy();
    });

    test('should return true if options are different', () => {
        const nextProps = {
            disabled: true,
            root: 1,
            rootMargin: 2,
            threshold: [0.25, 0.75, 0.5],
        };
        const prevProps = { ...nextProps, threshold: 1 };

        expect(comparerFn(nextProps, prevProps)).toBeTruthy();
    });
});
