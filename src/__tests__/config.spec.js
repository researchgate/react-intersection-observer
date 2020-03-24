/* eslint-env jest */
import Config from '../config';

describe('Config', () => {
    test('default errorReporter', () => {
        expect(Config.errorReporter).toBeUndefined();
    });

    test('custom errorReporter', () => {
        const testErrorReporter = jest.fn();
        const errorMsg = 'Intentionally throw exception';
        const infoMsg = 'Meta information for exception';
        const InlineConfig = require('../config');
        InlineConfig.errorReporter = testErrorReporter;
        InlineConfig.errorReporter(errorMsg, infoMsg);

        expect(testErrorReporter).toBeCalledWith(errorMsg, infoMsg);
    });

    test('custom non-callable errorReporter', () => {
        expect(() => {
            Config.errorReporter = 'fail';
        }).toThrowErrorMatchingInlineSnapshot(
            `"ReactIntersectionObserver: \`Config.errorReporter\` must be a callable"`
        );
    });
});
