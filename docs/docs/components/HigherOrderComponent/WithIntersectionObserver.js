import React, { Component } from 'react';
import Observer from '../../../../src/IntersectionObserver';

export default threshold => BaseComponent => {
    const displayName = BaseComponent.displayName || BaseComponent.name || 'Component';

    return class WithIntersectionObserver extends Component {
        static displayName = `withIntersectionObserver(${displayName})`;

        state = {
            isIntersecting: false,
        };

        handleChange = ({ isIntersecting, intersectionRatio }) => {
            this.setState({ isIntersecting: isIntersecting && intersectionRatio >= threshold });
        };

        render() {
            return (
                <Observer onChange={this.handleChange} threshold={threshold}>
                    <BaseComponent {...this.props} isVisible={this.state.isIntersecting} />
                </Observer>
            );
        }
    };
};
