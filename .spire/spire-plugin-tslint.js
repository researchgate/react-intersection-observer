function tslint({ setState }) {
    return {
        name: 'spire-plugin-tslint',
        async precommit() {
            setState((state) => ({
                linters: [
                    ...state.linters,
                    { '**/*.tsx?': ['tsc', '--project', 'types'] },
                ],
            }));
        },
    };
}

module.exports = tslint;
