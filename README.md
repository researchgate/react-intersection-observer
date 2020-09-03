<p align="center">
  <img alt="React Intersection Observer" src=".github/logo.svg" />
</p>

<p align="center">
  <a href="https://travis-ci.com/researchgate/react-intersection-observer"><img alt="Build Status" src="https://travis-ci.com/researchgate/react-intersection-observer.svg?branch=master"></a>
  <a href="https://codecov.io/gh/researchgate/react-intersection-observer"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/researchgate/react-intersection-observer.svg"></a>
  <a href="https://www.npmjs.com/package/@researchgate/react-intersection-observer"><img alt="NPM version" src="https://img.shields.io/npm/v/@researchgate/react-intersection-observer.svg"></a>
  <a href="https://www.npmjs.com/package/@researchgate/react-intersection-observer"><img alt="Dowloads per week" src="https://img.shields.io/npm/dw/@researchgate/react-intersection-observer.svg"></a>
</p>

<br>

> Bring ReactIntersectionObserver over today, your React children will love it!

**React Intersection Observer** is a **React** component, acting as a wrapper
for the **IntersectionObserver API**. It is fully declarative and takes care of
all the imperative parts for you.

**React Intersection Observer** is good at:

- **reusing instances**: comparing the passed options
- **performance**: chooses smartly when to re-render and when to re-observe
- **being unopinionated**: how to handle visibility changes is left entirely up
  to the developer
- **being intuitive**: looks like the Native API

<br>

<details>
<summary><strong>Table of Contents</strong></summary>
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Getting started](#getting-started)
- [What does IntersectionObserver do?](#what-does-intersectionobserver-do)
- [Why use this component?](#why-use-this-component)
  - [No bookkeeping](#no-bookkeeping)
  - [No extra markup](#no-extra-markup)
  - [Easy to adopt](#easy-to-adopt)
- [Documentation](#documentation)
  - [Demos](#demos)
  - [Recipes](#recipes)
  - [Missing DOM nodes when observing](#missing-dom-nodes-when-observing)
  - [Options](#options)
  - [Notes](#notes)
- [Polyfill](#polyfill)
  - [Caveats](#caveats)
- [**IntersectionObserver**'s Browser Support](#intersectionobservers-browser-support)
  - [Out of the box](#out-of-the-box)
  - [Using polyfill](#using-polyfill)
- [Contributing](#contributing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

---

## Getting started

```shell
npm install --save @researchgate/react-intersection-observer
```

> :warning: **Please make sure you have the minimum node version installed** (as defined [in the package.json](https://github.com/researchgate/react-intersection-observer/blob/master/package.json#L6-L7))
> 
> Otherwise you run into this build error:
>
> `The engine "node" is incompatible with this module. Expected version ">=10.18.1". Got "10.15.3"`

## Usage

```jsx
import React from 'react';
import 'intersection-observer'; // optional polyfill
import Observer from '@researchgate/react-intersection-observer';

class ExampleComponent extends React.Component {
  handleIntersection(event) {
    console.log(event.isIntersecting);
  }

  render() {
    const options = {
      onChange: this.handleIntersection,
      root: '#scrolling-container',
      rootMargin: '0% 0% -25%',
    };

    return (
      <div id="scrolling-container" style={{ overflow: 'scroll', height: 100 }}>
        <Observer {...options}>
          <div>I am the target element</div>
        </Observer>
      </div>
    );
  }
}
```

Optionally add the **polyfill** and make sure it's required on your
dependendencies for unsupporting browsers:

```shell
npm install --save intersection-observer
```

## What does IntersectionObserver do?

> IntersectionObservers calculate how much of a target element overlaps (or
> "intersects with") the visible portion of a page, also known as the browser's
> "viewport":
>
> [Dan Callahan](https://hacks.mozilla.org/2017/08/intersection-observer-comes-to-firefox/)&nbsp;&middot;&nbsp;<a href="https://creativecommons.org/licenses/by-sa/3.0/"><img id="licensebutton_slim" alt="Creative Commons License" src="https://i.creativecommons.org/l/by-sa/3.0/80x15.png" style="margin-right:10px;margin-bottom:4px; border: 0;"></a>

![Graphic example](https://hacks.mozilla.org/files/2017/08/Blank-Diagram-Page-1.png)

## Why use this component?

The motivation is to provide the easiest possible solution for observing
elements that enter the viewport on your **React** codebase. It's fully
declarative and all complexity is abstracted away, focusing on reusability, and
low memory consumption.

### No bookkeeping

It's built with compatibility in mind, adhering 100% to the
[native API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Intersection_observer_options)
implementation and DSL, but takes care of all the bookkeeping work for you.

Instances and nodes are managed internally so that any changes to the passed
options or tree root reconciliation cleans up and re-observes nodes on-demand to
avoid any unexpected memory leaks.

### No extra markup

ReactIntersectionObserver does not create any extra DOM elements, it attaches to
the only child you'll provide to it. This is done using `findDOMNode` to
retrieve the first DOM node found. If your child already has an existing `ref`,
either a callback or object (from createRef), these will be handled normally in
either case.

### Easy to adopt

When using ReactIntersectionObserver the only required prop is the `onChange`
function. Any changes to the visibility of the element will invoke this
callback, just like in the
[native API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Targeting_an_element_to_be_observed) -
you’ll receive one `IntersectionObserverEntry` argument per change. This gives
you an ideal and flexible base to build upon.

Some of the things you may want to use ReactIntersectionObserver for:

- Determining advertisement impressions
- Lazy loading - Images, or anything that will enter the viewport
- Occlusion culling - Don't render an object until is close to the viewport
  edges
- [Sentinel Scrolling - Infinite scroller with a recycled Sentinel](https://github.com/researchgate/react-intersection-list)

## Documentation

### Demos

Find multiple examples and usage guidelines under:
[https://researchgate.github.io/react-intersection-observer/](https://researchgate.github.io/react-intersection-observer/)

[![demo](https://github.com/researchgate/react-intersection-observer/blob/master/.github/demo.gif?raw=true)](https://researchgate.github.io/react-intersection-observer/)

### Recipes

Recipes are useful code snippets solutions to common problems, for example, how
to use ReactIntersectionObserver within a
[Higher Order Component](https://researchgate.github.io/react-intersection-observer/?selectedKind=Recipes&selectedStory=Higher%20Order%20Component).
<br> Here's how to create an **element monitoring** component:

```jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Observer from '@researchgate/react-intersection-observer';

export default class ViewableMonitor extends Component {
  static propTypes = {
    tag: PropTypes.node,
    children: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tag: 'div',
  };

  state = {
    isIntersecting: false,
  };

  handleChange = ({ isIntersecting }) => {
    this.setState({ isIntersecting });
  };

  render() {
    const { tag: Tag, children, ...rest } = this.props;

    return (
      <Observer {...rest} onChange={this.handleChange}>
        <Tag>{children(this.state.isIntersecting)}</Tag>
      </Observer>
    );
  }
}
```

```jsx
import React from 'react';
import ViewableMonitor from './ViewableMonitor';

export default () => (
  <ViewableMonitor>
    {(isViewable) => (isViewable ? 'I am viewable' : 'I am still hiding')}
  </ViewableMonitor>
);
```

Discover more recipes in our [examples section](docs/README.md).

### Missing DOM nodes when observing

In cases where there isn't a DOM node available to observe when rendering,
you'll be seeing an error logged in the console:

```js
ReactIntersectionObserver: Can't find DOM node in the provided children. Make sure to render at least one DOM node in the tree.
```

This somewhat helpful and descriptive message is supposed to help you identify
potential problems implementing `observers` early on. If you miss the exception
for some reason and ends up in production (prone to happen with dynamic
children), the entire tree will unmount so be sensible about placing your error
boundaries.

Ultimately the way to avoid this is to either make sure you are rendering a DOM
node inside your `<Observer>`, or to disable the observer until there's one
`<Observer disabled>`.

### Options

**root**: `HTMLElement|string` | default `window object`

The element or selector string that is used as the viewport for checking
visibility of the target.

**rootMargin**: `string` | default `0px 0px 0px 0px`

Margin around the root. Specify using units _px_ or _%_ (top, right, bottom
left). Can contain negative values.

**threshold**: `number|Array<number>` | default: `0`

Indicates at what percentage of the target's visibility the observer's callback
should be executed. If you only want to detect when visibility passes the 50%
mark, you can use a value of 0.5. If you want the callback run every time
visibility passes another 25%, you would specify the array [0, 0.25, 0.5, 0.75,
1].

**disabled**: `boolean` | default: `false`

Controls whether the element should stop being observed by its
IntersectionObserver instance. Useful for temporarily disabling the observing
mechanism and restoring it later.

**onChange** (required):
`(entry: IntersectionObserverEntry, unobserve: () => void) => void`

Function that will be invoked whenever an observer's callback contains this
target in its changes.

**children**: `React.Element<*>|null`

Single React component or element that is used as the target (observable). As of
`v1.0.0`, children can be null. Null children won't be observed.

### Notes

- According to the spec, an initial event is being fired when starting to
  observe a non-intersecting element as well.
  - _Edge's implementation seems to
    [miss the initial event](https://github.com/w3c/IntersectionObserver/issues/222#issuecomment-311539591),
    although Edge 16 behavior aligns with the spec._
- Changes happen asynchronously, similar to the way `requestIdleCallback` works.
- Although you can consider callbacks immediate - always below 1 second - you
  can also get an immediate response on an element's visibility with
  `observer.takeRecords()`.
- The primitives `Map` an `Set` are required. You may need to include a polyfill
  for browsers lacking ES2015 support. If you're using babel, include
  `"babel-polyfill"` somewhere to your codebase.

## Polyfill

When needing the full spec's support, we highly recommend using the
[IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill).

### Caveats

#### Ealier Spec

Earlier preview versions of
[Edge](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12156111/)
and prior to version 58 of
[Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=713819#c8), the
support for `isIntersecting` was lacking. This property was added to the spec
later and both teams where unable to implement it earlier.

#### Performance issues

As the above-mentioned polyfill doesn't perform callback invocation
[asynchronously](https://github.com/WICG/IntersectionObserver/issues/225), you
might want to decorate your `onChange` callback with a `requestIdleCallback` or
`setTimeout` call to avoid a potential performance degradation:

```js
onChange = (entry) => requestIdleCallback(() => this.handleChange(entry));
```

## [**IntersectionObserver**'s Browser Support](https://platform-status.mozilla.org/)

### Out of the box

<table>
    <tr>
        <td>Chrome</td>
        <td>51 <sup>[1]</sup></td>
    </tr>
    <tr>
        <td>Firefox (Gecko)</td>
        <td>55 <sup>[2]</sup></td>
    </tr>
    <tr>
        <td>MS Edge</td>
        <td>15</td>
    </tr>
    <tr>
        <td>Internet Explorer</td>
        <td>Not supported</td>
    </tr>
    <tr>
        <td>Opera <sup>[1]</sup></td>
        <td>38</td>
    </tr>
    <tr>
        <td>Safari</td>
        <td>12.1</td>
    </tr>
    <tr>
        <td>Chrome for Android</td>
        <td>59</td>
    </tr>
    <tr>
        <td>Android Browser</td>
        <td>56</td>
    </tr>
    <tr>
        <td>Opera Mobile</td>
        <td>37</td>
    </tr>
</table>

- [1][reportedly available](https://www.chromestatus.com/features/5695342691483648),
  it didn't trigger the events on initial load and lacks `isIntersecting` until
  later versions.
- [2] This feature was implemented in Gecko 53.0 (Firefox 53.0 / Thunderbird
  53.0 / SeaMonkey 2.50) behind the preference
  `dom.IntersectionObserver.enabled`.

### Using polyfill

<table>
  <tr>
    <td>Safari</td>
    <td>6+</td>
  </tr>
  <tr>
    <td>Internet Explorer</td>
    <td>7+</td>
  </tr>
  <tr>
    <td>Android</td>
    <td>4.4+</td>
  </tr>
</table>

## Contributing

We'd love your help on creating React Intersection Observer!

Before you do, please read our [Code of Conduct](.github/CODE_OF_CONDUCT.md) so
you know what we expect when you contribute to our projects.

Our [Contributing Guide](.github/CONTRIBUTING.md) tells you about our
development process and what we're looking for, gives you instructions on how to
issue bugs and suggest features, and explains how you can build and test your
changes.

**Haven't contributed to an open source project before?** No problem!
[Contributing Guide](.github/CONTRIBUTING.md) has you covered as well.
