import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import Readme from './README.md';
import OnlyOnce from './OnlyOnce';

export default withReadme(Readme, () => <OnlyOnce />);
