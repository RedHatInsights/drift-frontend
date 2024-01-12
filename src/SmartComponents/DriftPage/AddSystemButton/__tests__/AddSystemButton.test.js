import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import AddSystemButton from '../AddSystemButton';
import { init } from '../../../../store';
import { addSystemModalActions } from '../../../AddSystemModal/redux';
import userEvent from '@testing-library/user-event';

describe('add system button', () => {
    const store = init().registry.getStore();
    let props;
    let mockToggleAddSystemModal;

    beforeEach(() => {
        mockToggleAddSystemModal = jest.spyOn(addSystemModalActions, 'toggleAddSystemModal');
        props = {
            loading: false,
            isToolbar: true
        };
    });

    it('should render toolbar button', async () => {
        render(
            <Provider store={ store }>
                <AddSystemButton { ...props } />
            </Provider>
        );

        expect(screen.getByText('Add to comparison')).toBeInTheDocument();
    });

    it('should render empty state button', () => {
        props.isToolbar = false;

        render(
            <Provider store={ store }>
                <AddSystemButton { ...props } />
            </Provider>
        );

        expect(screen.getByText('Add systems or baselines')).toBeInTheDocument();;
    });

    it('should disable add system button', () => {
        props.loading = true;

        render(
            <Provider store={ store }>
                <AddSystemButton { ...props } />
            </Provider>
        );

        const button = screen.getByTestId('add-to-comparison-button');
        expect(button).toBeDisabled();
    });

    it('should handle toggleAddSystemModal on click', () => {
        render(
            <Provider store={ store }>
                <AddSystemButton { ...props } />
            </Provider>
        );

        userEvent.click(screen.getByTestId('add-to-comparison-button'));
        expect(mockToggleAddSystemModal).toHaveBeenCalled();
    });
});
