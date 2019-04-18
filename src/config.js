import invariant from 'invariant';

const config = {};

export default Object.create(null, {
    errorReporter: {
        configurable: false,
        get() {
            return (
                config.errorReporter ||
                function(format) {
                    return invariant(false, format);
                }
            );
        },
        set(value) {
            if (typeof value !== 'function') {
                throw new Error('ReactIntersectionObserver: `Config.errorReporter` must be a callable');
            }
            config.errorReporter = value;
        },
    },
});
