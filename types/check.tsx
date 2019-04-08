import * as React from 'react';
import Observer from '..';

const noop = (event, unobserve) => {
  unobserve();
};
const Component = () => <span />;

<Observer
  threshold={1}
  disabled={false}
  root="#foo"
  rootMargin="10px"
  onChange={noop}
>
  <span style={{ height: 1, display: 'block' }} />
</Observer>;

<Observer threshold={[0.5, 1]} root={document.body} onChange={noop}>
  <Component />
</Observer>;
