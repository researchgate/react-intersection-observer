/* eslint-env jest */
import Config from '../config';
import invariant from 'invariant';

jest.mock('invariant', () => jest.fn());

describe('Config', () => {
    const testErrorReporter = jest.fn();
    const errorMsg = 'Intentionally throw exception';

    test('default errorReporter', () => {
        Config.errorReporter(errorMsg);
        expect(invariant).toBeCalledWith(false, errorMsg);
    });

    test('custom errorReporter', () => {
        const defaultTestErrorReporter = Config.errorReporter;
        Config.errorReporter = testErrorReporter;

        Config.errorReporter(errorMsg);
        expect(testErrorReporter).toBeCalledWith(errorMsg);

        Config.errorReporter = defaultTestErrorReporter;
    });

    test('custom non-callable errorReporter', () => {
        expect(() => {
            Config.errorReporter = 'fail';
        }).toThrowErrorMatchingInlineSnapshot(
            `"ReactIntersectionObserver: \`Config.errorReporter\` must be a callable"`
        );
    });
});
