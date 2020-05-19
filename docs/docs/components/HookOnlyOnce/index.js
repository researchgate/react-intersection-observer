import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import Readme from './README.md';
import HookOnlyOnce from './HookOnlyOnce';

export default withReadme(Readme, () => <HookOnlyOnce />);
