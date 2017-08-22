## Viewable Monitor

Component accepting a function as children prop that will re-render the children when the target enters or leaves the viewport:

### Source

```jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Observer from '@researchgate/react-intersection-observer';

export default class ViewableMonitor extends Component {
    static propTypes = {
        tag: PropTypes.node,
        children: PropTypes.func.isRequired,
    }

    static defaultProps = {
        tag: 'div',
    }

    state = {
        isIntersecting: false,
    }

    handleChange = ({ isIntersecting }) => {
        this.setState({ isIntersecting });
    };
    
    render() {
        const { tag: Tag, children, ...rest } = this.props;

        return (
            <Observer {...rest} onChange={this.handleChange}>
                <Tag>
                    {children(this.state.isIntersecting)}
                </Tag>
            </Observer>
        );
    }
}
```

### Usage

```jsx
import React from 'react';
import ViewableMonitor from './ViewableMonitor';

export default () => (
    <ViewableMonitor>
        {isViewable =>
            isViewable ? 'I am viewable' : 'I am still hiding'
        }
    </ViewableMonitor>
);
```
