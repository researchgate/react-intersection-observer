import React from 'react';
import withReadme from 'storybook-readme/with-readme';
import Readme from './README.md';
import ImpressionTracking from './ImpressionTracking';

export default withReadme(Readme, () => <ImpressionTracking />);
