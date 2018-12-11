import * as React from 'react';

interface Props {
    children: React.ReactElement<any> | null | undefined;
    root?: string | Element | null;
    rootMargin?: string;
    threshold?: number | number[];
    disabled?: boolean;
    onChange: (entry: IntersectionObserverEntry, unobserve: () => void) => void;
}

export default class IntersectionObserver extends React.Component<Props> {}

