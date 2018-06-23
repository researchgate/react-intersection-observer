<p align="center">
  <img alt="React Intersection Observer" src=".github/logo.svg" width="888">
</p>

<p align="center">
  <a href="https://travis-ci.org/researchgate/react-intersection-observer"><img alt="Build Status" src="https://travis-ci.org/researchgate/react-intersection-observer.svg?branch=master"></a>
  <a href="https://codecov.io/gh/researchgate/react-intersection-observer"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/researchgate/react-intersection-observer.svg"></a>
  <a href="https://www.npmjs.com/package/@researchgate/react-intersection-observer"><img alt="NPM version" src="https://img.shields.io/npm/v/@researchgate/react-intersection-observer.svg"></a>
  <a href="https://github.com/prettier/prettier"><img alt="styled with prettier" src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg"></a>
</p>

<br>

> Bring ReactIntersectionObserver over today, your React children will love it!

**React Intersection Observer** is a **React** component, acting as a wrapper for the **IntersectionObserver API**. It
is fully declarative and takes care of all the imperative parts for you.

**React Intersection Observer** is good at:

* **reusing instances**: comparing the passed options
* **performance**: chooses smartly when to re-render and when to re-observe
* **being unopinionated**: how to handle visibility changes is left entirely up to the developer
* **being intuitive**: looks like the Native API
* **small size**: ~6.5kB before minification (> 3.5kB or less when [minified](https://babeljs.io/repl#?babili=true&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=JYWwDg9gTgLgBAJQKYEMDG8BmUIjgcilQ3wG4AoUSWOAbzk2ADsATAEQHkBZAOQhaRwAvgxx5CxGAFoWuMpXDR4zAG4oowFEyxiCq9Zu3yqSuAHd1TZgHNRuAhahWm1-eUwBXJhmAQmcYABnTi4AFQBPMCQAUQAbJBAkbQAKJHjE7QBKOnI4PLgiGA8nREkAOiCANRRY4BY4hKSYVPSm7IAydrgYSKQITDg0xu0ynqi4AF4pgkCYDRd5IXJyND9ZuBB1a2YEaMm4AHoAPSkAfgAdFgAqc7KLlgBqZLAADwAfAFJMgBIDincvD4_HAwOpAkgEBAIDAuFtmMkcNDYVBtkxsrRcvlVkx1psUcwAMpzGz7REwuH-U4FKHk_FMUYaEDJbIALgIAAZXvJ8nBsesANogdn7fCcl74AA0GwAjPshVKQAAmOXshUAZjl0oAunKKUT5tYyoEwLVmgdzoEHgdMmVNmBknjUZMAHw5Hk84ADZIAQkdO2ioyQswdFMy6Mx7vdMAAFjgzHAmEh49EoDgoMlCDTkU6QB51gAjQQoOCzA1wU1IKA1Xl-GAoZgksDAF5pQJwLQsA7QEGVtBNOBqWIeIP4TIUSN5JYTgpIIolP1Mcf5IRj5Y8wrFfwAA2-tCFIl3IGlB73ipPIDVQi3FCWAO8MF8_kC0ZqsQgZgAwrhQURkomXjAUpgEQKjhh6XoAIKpig4QVIEUFVuEf5IABHRdAhMFwRhSHAUgoFgROnpwMhAFlPELgxpM0y4SoZFJNYMYEdOeQbiU_4wEauBIMkyQAPpSswAgvNkEyus-r7vl-4DqNx7H8oJKFakBIHyawilhkukZTsuEYznO_jsXA3rUSBN7LHy8AQPm4JQColYNBkMCBLCYD7Im8Yucy_yePej5wNYs4AApQvELDJBAYAPms-y0CubpYms8BkvsEVRTiZTJW8bwJh4sSxJpNY4klWYUvsP7gpCSIUuFkWPoEGUlXSq48hZ3SxkG0YQLELD7NhWHQUhqV1aM7XPl1LCZLpPJUkNawjUQY3dVN-Rsvys3pTGC2dd1RkTDleVwDNtVzZtHXjXAbLslqBWtVZNl2VAbZ7XdlYPQ5TTOSgYBlAA1kg4SBF5unxJZ1mvZWBVmNGwDxMR4Vg7ZlYpQjD31exzJlIOw5hvFkatV4mwwGg0ZID1EzLZGyXGc9KOVg10JwFlFPumS2bMLtNP3XTrOlUzzH5OJeWSd-MnJKdi0sFKL2I1A81nd1gSrszRE-gTKBEyTE248xrH-NLD0FTy2mTrpuv7fl5C3j5QL-IwrAcLTUDvSk-uVlKTRQOETGFesQyOU9cCu07rTaJ930Bc0QfNfkKt-x93stYlA41MOAdx6HmMp0GQPTiDgwhzAhv5FDMOCDx6fwHtWNBmU6M2tXOMYvzeSxwXoxbLOVF7R7sF1iis4J83ZsV0XWnM8bwim7Om7m2Z5AHFcVy5FccChCTcAAJLaJW4I23ADtc1AcAQYFG-8q--boD9bXqwEbZoK-pPmCTiYPYHib58MgHL-feVPzGgg-4RwEtvR6SAMBtiQMAABR8AFwAECoYAfYBzACTNQSyR9izGnAZ6VBPUK5lB_hBWIgQIDmBhrEfyncH6hWfkkPCSM4GIMCMAfMMNoHhEDgMOBQDO4V15C-FwQZ2ysB_mgHAgRwRtgECwogPUUAgAgF4JyXCAigN3mlchlE4FkkIXAFeAABH8Ci6DqEQiIYmWgAqBB_kY9QJjaBbxgDvcBaUD7gygCIIOy8Dh3j3jQ2Il80A_WSJYoRgQpaO29pgbsyQ87AH2OyUgAQ4AAB4BFWJruRBi0ZknAAeA8QeeRWr8L2nbFg7iZbO0jo7KUYTrHyS1NHSMrcv5FPdAQwRLB4gfkEQFUJfSgyNOae6CeSwraAk0eI1AzjKkPRqmlRW2szYR2Cl1UmCy6rZCygmJMm91GuMfHMysoSL5XylsdHEq4Jm-WBK7apLQ2naxVt6IO1Sw5lBfIDAhUd2lvILh88EzQfm1N2fGAks5mQjInv8r-HyI6PMcmUKOZQUAsDChXEZILD7Itpoipo7d-4wGucsa2mivD3ILvirIzyvSwv9i5T5KBvlt1-drRORVugdxUZzDx7zGUIuxR4kZ4FiK8KcmUAQINuKYvaaKsW3L6osIAF6CFdOyOVE4hUyzKBSvFBDxUionCIVsggm7Nx5Nqh6kqgjYkTBgHOFr8j0o-oyqVs4ZWsqiaPUZ49dLjPMknIOHBLkB35JmaEkoCA8zpFG_A4ttosHwNdFYQbHaBRwGAMN-AWBBBQPmUKyayjYgfjUw-IbFmrluvmAAVq4jN0IyF7QdnWjAZRgKNrGEgf4aBYjMrbE4lxNtjlQG-LKFCzjWBtmQOgDiUlICJm0DkAAkMuiyUAPAYGgM8TNSyMSruXYEDwUR0wdqzauA95AD0xiCEy1gPTBn7BvfVLpD7MllDYawMW0NFYUGvT-u93SkB8AEE-gDr7gP8CQB-wS36ggXtXc-3Fh8wO3qDjBr9z6EPLqQ3qlDe1cNMHQ5-sKWG_3LonhHQOobmTsvyGbYNoaMqk03dxTZawpR_S9i6OjLS6W1vrTgGAEAmWBA4GYJgDaT09GLa-OD9Uz0RLgFxxuzNpz43BAARWHJ7fYXGu7RppPgOAnRA4CYwA24TowID6hsLJvK8n227v5FxppBn8BrXM_AWzLgtTcidXkdagQXP_R1HtPMSBtOVk4VSWQaAPBIoAI46fCBC-IW70xIcUyF8Ibm2RZec65n1Rs1P0eniUILPqhBSlitCtc-QIO9MyakOyNLzWRgKxFeqfgmtCJa00KUhHXZK2nCrTrWbkVMFiOEDg3gkCapbl6BhIwgiDrAT4FwC2owAbw-DR1_MJ4lZK7pCDIHuKGt4wEL0Xb-htVvYp4t0NupEHpEQAYUw9r4DJY-Ucl2eTjfqsTGGLAXvMcwAqolRqTbTgXkvZiK815BDvu2OAbD4AeGsNNtkZglE7VqH9boZCItUJgASJgX0xowAAEJIBiUQAAqmAFg6tuKZClPmDw8AzCCFkAmBmFgl3CfgUgKIrB35qZXkQWdUhaiYHAeEXtQYpCrGkvAIXR6wDoNKLOgcO86ogg0N2IX0oABsZQNTMru5AgCVZUchVQP4CObY4E1qsvAvw0GJe-OnEh8VvWApkzFQBl7Ag5GhG5SZroF3jLm0j1b5jakw8R-plyolPqxsAb94MrW7XmJDbxVDyePvM8R4I9ygqt4eSu1o7n_7JeiX7CCCECIUQHm--5dkKk7eG9snKSEM7jnDU-qQ0HfY0yWcjsc0FwvlKv7ybq7pXbiMa_K2u_XqjMemC5ViFtpfdk28_sL2M-rxTvwe-0GwOoXAlEpHaQcA4gxAi1G0DIPNBakBSHYjL5gggiNSC8AIJgKvsRB2n2JImUEkLRDwBwGwNELxNEDwJUBzAQB2iwJumlMZqZuVEgE4skDOm2qjI-FKNKBqmknAKbltvoBoFoM0KVh1uvrOBKHQe6PgESCzvEJIgwJMn5Crguh9OfEwERvAIWP5MAK1jOJgPVMfDAM4uACokLugGAc7j-hIeQgdJgPWLEGUJKMwUfsAT6ADjaoEPmqFFtiPgXlVv6ifjWIoIujAJfiwIzszs4junhFJnuszK1Ipv7k_LyjLO4ZxIkDuhFDxoLG-J-CLL-ADvyGekpAbm4c5rERpNYfKt4dnmYTtkRhYX6vod3hHD4T1DsmkZkjnswS8oYbmsYe_qUQFnkOYVzPtsxIdjpMdonLYU0AAOoUL05MCKLKIr7F63p76s4V7WEh4nLtJIbjFJ4N4EYMGFyHAP7PrJxDiCBI5b4HTAhwKMCPRJRJCh4pFlb6Ta5tq9oe4PL4FzpPYg5JCTbTaOYPZA7PZJBs5_ZlaYD5bgYdjxBnZMHTgrijG3goRa6AEoC5TwBrYaJHKOxjoUDAmmD0DYGVS0hOhCAUBAA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=true&sourceType=module&lineWrap=false&presets=react%2Cbabili&prettier=false&targets=&version=6.26.0&envVersion=), ~1.3kB gzipped)

<br>

<details>
<summary><strong>Table of Contents</strong></summary>

* [Getting started](#getting-started)
  * [Installation](#installation)
  * [Inside your codebase](#inside-your-codebase)
* [What does IntersectionObserver do?](#what-does-intersectionobserver-do)
* [Why use this component?](#why-use-this-component)
  * [No bookkeeping](#no-bookkeeping)
  * [No extra markup](#no-extra-markup)
  * [Easy to adopt](#easy-to-adopt)
* [Documentation](#documentation)
* [Options](#options)
* [Notes](#notes)
* [Polyfill](#polyfill)
* [IntersectionObserver's Browser Support](#intersectionobservers-browser-support)
* [Contributing](#contributing)
* [License](#license)
  </details>

---

## Getting started

```shell
npm install --save @researchgate/react-intersection-observer
```

Usage:

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

Optionally add the **polyfill** and make sure it's required on your dependendencies for unsupporting browsers:

```shell
npm install --save intersection-observer
```

## What does IntersectionObserver do?

> IntersectionObservers calculate how much of a target element overlaps (or "intersects with") the visible portion of a
> page, also known as the browser's "viewport":
>
> [Dan Callahan](https://hacks.mozilla.org/2017/08/intersection-observer-comes-to-firefox/) · <a href="https://creativecommons.org/licenses/by-sa/3.0/">
> <img id="licensebutton_slim" alt="Creative Commons License" src="https://i.creativecommons.org/l/by-sa/3.0/80x15.png" style="margin-right:10px;margin-bottom:4px; border: 0;"></a>

![Graphic example](https://hacks.mozilla.org/files/2017/08/Blank-Diagram-Page-1.png)

## Why use this component?

The motivation is to provide the easiest possible solution for observing elements that enter the viewport on your
**React** codebase. It's fully declarative and all complexity is abstracted away, focusing on reusability, and low
memory consumption.

### No bookkeeping

It's built with compatibility in mind, adhering 100% to the
[native API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Intersection_observer_options)
implementation and DSL, but takes care of all the bookkeeping work for you.

Instances and nodes are managed internally so that any changes to the passed options or tree root reconciliation cleans
up and re-observes nodes on-demand to avoid any unexpected memory leaks.

### No extra markup

ReactIntersectionObserver does not create any extra DOM elements, it attaches to the only child you'll provide to it.
Internally it warns you if attaching a `ref` to it fails - common mistake when using a stateless component in React 15 -
and will invoke any existing `ref` callback upon the passed child element.

### Easy to adopt

When using ReactIntersectionObserver the only required prop is the `onChange` function. Any changes to the visibility of
the element will invoke this callback, just like in the
[native API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Targeting_an_element_to_be_observed) -
you’ll receive one `IntersectionObserverEntry` argument per change. This gives you an ideal and flexible base to build
upon.

Some of the things you may want to use ReactIntersectionObserver for:

* Determining advertisement impressions
* Lazy loading - Images, or anything that will enter the viewport
* Occlusion culling - Don't render an object until is close to the viewport edges
* [Sentinel Scrolling - Infinite scroller with a recycled Sentinel](https://github.com/researchgate/react-intersection-list)

## Documentation

### Demos

Find multiple examples and usage guidelines under:
[https://researchgate.github.io/react-intersection-observer/](https://researchgate.github.io/react-intersection-observer/)

[![demo](https://github.com/researchgate/react-intersection-observer/blob/master/.github/demo.gif?raw=true)](https://researchgate.github.io/react-intersection-observer/)

### Recipes

Recipes are useful code snippets solutions to common problems, for example, how to use ReactIntersectionObserver within
a
[Higher Order Component](https://researchgate.github.io/react-intersection-observer/?selectedKind=Recipes&selectedStory=Higher%20Order%20Component).
<br>
Here's how to create an **element monitoring** component:

```jsx
import React, { Component } from 'react';
import Observer from '@researchgate/react-intersection-observer';

export default class ViewableMonitor extends Component {
    state = {
        isIntersecting: false,
    }

    handleChange = ({ isIntersecting }) => {
        this.setState({ isIntersecting });
    };
    
    render() {
        const { children, mount: Tag, ...rest } = this.props;
        let element = children(this.state.isIntersecting);

        if (Tag) {
            element = <Tag>{element}</Tag>;
        }

        return (
            <Observer {...rest} onChange={this.handleChange}>
                {element}
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
        {isViewable =>
            isViewable ? 'I am viewable' : 'I am still hiding'
        }
    </ViewableMonitor>
);
```

Discover more recipes in our [examples section](docs/README.md).

### Options

**root**: `HTMLElement|string` | default `window object`

The element or selector string that is used as the viewport for checking visibility of the target.

**rootMargin**: `string` | default `0px 0px 0px 0px`

Margin around the root. Specify using units _px_ or _%_ (top, right, bottom left). Can contain negative values.

**threshold**: `number|Array<number>` | default: `0`

Indicates at what percentage of the target's visibility the observer's callback should be executed. If you only want to
detect when visibility passes the 50% mark, you can use a value of 0.5. If you want the callback run every time
visibility passes another 25%, you would specify the array [0, 0.25, 0.5, 0.75, 1].

**disabled**: `boolean` | default: `false`

Controls whether the element should stop being observed by its IntersectionObserver instance. Useful for temporarily
disabling the observing mechanism and restoring it later.

**onChange** (required): `(entry: IntersectionObserverEntry, unobserve: () => void) => void`

Function that will be invoked whenever an observer's callback contains this target in its changes.

**children** (required): `React.Element<*>`

Single React component or element that is used as the target (observable).

### Notes

* According to the spec, an initial event is being fired when starting to observe a non-intersecting element as well.
  * _Edge's implementation seems to
    [miss the initial event](https://github.com/w3c/IntersectionObserver/issues/222#issuecomment-311539591), although
    Edge 16 behavior aligns with the spec._
* Changes happen asynchronously, similar to the way `requestIdleCallback` works.
* Although you can consider callbacks immediate - always below 1 second - you can also get an immediate response on an
  element's visibility with `observer.takeRecords()`.
* The primitives `Map` an `Set` are required. You may need to include a polyfill for browsers lacking ES2015 support. If
  you're using babel, include `"babel-polyfill"` somewhere to your codebase.

## Polyfill

When needing the full spec's support, we highly recommend using the
[IntersectionObserver polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill).

### Caveats

#### Ealier Spec

Earlier preview versions of [Edge](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12156111/) and
prior to version 58 of [Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=713819#c8), the support for
`isIntersecting` was lacking. This property was added to the spec later and both teams where unable to implement it
earlier.

#### Performance issues

As the above-mentioned polyfill doesn't perform callback invocation
[asynchronously](https://github.com/WICG/IntersectionObserver/issues/225), you might want to decorate your `onChange`
callback with a `requestIdleCallback` or `setTimeout` call to avoid a potential performance degradation:

```js
onChange = entry => requestIdleCallback(() => this.handleChange(entry));
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
        <td>Safari Technology Preview</td>
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

* [1][reportedly available](https://www.chromestatus.com/features/5695342691483648), it didn't trigger the events on
  initial load and lacks `isIntersecting` until later versions.
* [2] This feature was implemented in Gecko 53.0 (Firefox 53.0 / Thunderbird 53.0 / SeaMonkey 2.50) behind the
  preference `dom.IntersectionObserver.enabled`.

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

Before you do, please read our [Code of Conduct](.github/CODE_OF_CONDUCT.md) so you know what we expect when you
contribute to our projects.

Our [Contributing Guide](.github/CONTRIBUTING.md) tells you about our development process and what we're looking for,
gives you instructions on how to issue bugs and suggest features, and explains how you can build and test your changes.

**Haven't contributed to an open source project before?** No problem! [Contributing Guide](.github/CONTRIBUTING.md) has
you covered as well.
