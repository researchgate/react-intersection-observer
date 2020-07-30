import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import Readme from './README.md';
import Hook from './Hook';

export default withReadme(Readme, () => <Hook />);
