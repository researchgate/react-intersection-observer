import * as React from 'react';
import Observer from '..';

const onChange = (event, unobserve) => {
  unobserve();
};
const Component = () => <span />;

<Observer
  threshold={1}
  disabled={false}
  root="#foo"
  rootMargin="10px"
  onChange={onChange}
>
  <span style={{ height: 1, display: 'block' }} />
</Observer>;

<Observer threshold={[0.5, 1]} root={document.body} onChange={onChange}>
  <Component />
</Observer>;

<Observer onChange={onChange}>{null}</Observer>;

<Observer onChange={onChange}>{undefined}</Observer>;
