const config = {};

export default Object.create(null, {
    errorReporter: {
        configurable: false,
        get() {
            return config.errorReporter;
        },
        set(value) {
            if (typeof value !== 'function') {
                throw new Error(
                    'ReactIntersectionObserver: `Config.errorReporter` must be a callable'
                );
            }
            config.errorReporter = value;
        },
    },
});
