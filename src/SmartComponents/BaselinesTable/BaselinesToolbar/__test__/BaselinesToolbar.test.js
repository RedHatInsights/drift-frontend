import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import BaselinesToolbar from '../BaselinesToolbar';

let container = null;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it('renders without a create button', () => {
    act(() => {
        render(<BaselinesToolbar />, container);
    });
    expect(container.querySelector('button')).toBe(null);
});

it('renders with a search box', () => {
    act(() => {
        render(<BaselinesToolbar />, container);
    });
    expect(container.querySelector('input').placeholder).toBe('Filter by name');
});
