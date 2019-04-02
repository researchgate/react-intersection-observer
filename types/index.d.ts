import * as React from 'react';

export default class IntersectionObserver extends React.Component<Props> {}

interface Props {
    children: React.ReactElement<any>;
    root?: string | Element | null;
    rootMargin?: string;
    threshold?: number | number[];
    disabled?: boolean;
    onChange: (entry: IntersectionObserverEntry, unobserve: () => void) => void;
    onEntry?: (entry: IntersectionObserverEntry, unobserve: () => void) => void;
    onExit?: (entry: IntersectionObserverEntry, unobserve: () => void) => void;
    onCertifiedView?: (entry: IntersectionObserverEntry, unobserve: () => void) => void;
    waitTime?: number;
}
