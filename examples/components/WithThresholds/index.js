import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import Readme from './README.md';
import WithThresholds from './WithThresholds';

export default withReadme(Readme, () => <WithThresholds />);
