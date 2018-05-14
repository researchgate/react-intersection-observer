_Use the second argument of `onChange(event, unobserve)` to customize how you prefer to stop observing the target. You
can also set the prop `disabled=true` in the `<Observer>` element to achieve the same effect._

**Deprecated**: ~~The option `onlyOnce` applied to the component will only trigger the event one time: when the target
detects `isIntersecting` is truthy. This is specially useful when you need a _disposable observer_, and you need to
prevent re-rendering the element later:~~

```jsx
import React, { Component } from 'react';
import Observer from '@researchgate/react-intersection-observer';

export default class OnlyOnce extends Component {
    state = {
        visibility: 'hidden',
    };

    handleChange = (event, unobserve) => {
        if (event.isIntersecting) {
            unobserve();
        }
        this.setState({
            visibility: event.isIntersecting ? 'visible' : 'invisible',
        });
    };

    render() {
        return (
            <div>
                <div className={`header ${this.state.visibility}`}>{this.state.visibility}</div>
                <div className="body">
                    <Observer onChange={this.handleChange}>
                        <div className={`box ${this.state.visibility}`} />
                    </Observer>
                </div>
            </div>
        );
    }
}
```
