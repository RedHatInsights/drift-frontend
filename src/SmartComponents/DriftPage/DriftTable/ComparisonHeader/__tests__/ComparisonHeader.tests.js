import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../../../store';

import ComparisonHeader from '../ComparisonHeader';
import fixtures from './ComparisonHeader.fixtures';

describe('ComparisonHeader react-testing-library', () => {
    let props;
    const store = init().registry.getStore();

    beforeEach(() => {
        props = {
            factSort: '',
            fetchCompare: jest.fn(),
            hasHSPReadPermissions: true,
            mainList: [],
            permissions: {
                hspRead: true
            },
            referenceId: undefined,
            isFirstReference: true,
            removeSystem: jest.fn(),
            stateSort: '',
            systemIds: [],
            toggleFactSort: jest.fn(),
            toggleStateSort: jest.fn(),
            updateReferenceId: jest.fn(),
            setHistory: jest.fn(),
            setColumnHeaderWidth: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render correctly', () => {
        const { asFragment } = render(
            <ComparisonHeader { ...props }/>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render fact sort asc', () => {
        props.factSort = 'asc';
        const { asFragment } = render(
            <ComparisonHeader { ...props }/>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render fact sort desc', () => {
        props.factSort = 'desc';
        const { asFragment } = render(
            <ComparisonHeader { ...props }/>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render state sort asc', () => {
        props.stateSort = 'asc';
        const { asFragment } = render(
            <ComparisonHeader { ...props }/>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render state sort desc', () => {
        props.stateSort = 'desc';
        const { asFragment } = render(
            <ComparisonHeader { ...props }/>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should render fact sort desc on click', () => {
        props.factSort = 'asc';
        render(<ComparisonHeader { ...props }/>);

        userEvent.click(screen.getByText('Fact'));
        expect(props.toggleFactSort).toHaveBeenCalledWith('asc');
    });

    it('should render fact sort asc on click', () => {
        props.factSort = 'desc';
        render(<ComparisonHeader { ...props }/>);

        userEvent.click(screen.getByText('Fact'));
        expect(props.toggleFactSort).toHaveBeenCalledWith('desc');
    });

    it('should render state sort none on click', () => {
        props.stateSort = 'desc';
        render(<ComparisonHeader { ...props }/>);

        userEvent.click(screen.getByText('State'));
        expect(props.toggleStateSort).toHaveBeenCalledWith('desc');
    });

    it('should render state sort asc on click', () => {
        props.stateSort = '';
        render(<ComparisonHeader { ...props }/>);

        userEvent.click(screen.getByText('State'));
        expect(props.toggleStateSort).toHaveBeenCalledWith('');
    });

    it('should render state sort desc on click', () => {
        props.stateSort = 'asc';
        render(<ComparisonHeader { ...props }/>);

        userEvent.click(screen.getByText('State'));
        expect(props.toggleStateSort).toHaveBeenCalledWith('asc');
    });

    it.skip('should remove a system', async () => {
        props.mainList = fixtures.mainListSystem;

        render(<MemoryRouter keyLength={ 0 }>
            <Provider store={ store }>
                <ComparisonHeader { ...props }/>
            </Provider>
        </MemoryRouter>);

        await waitFor(() => userEvent.click(screen.getByTestId('remove-system-button-dc47qffd-09rt-2kw7-8b9b-53f4g716fec5')));
        expect(store.removeSystem).toHaveBeenCalled();
    });

    it.skip('should render a system, baseline and hsp', () => {
        props.mainList = fixtures.mainListAll;

        const { asFragment } = render(<MemoryRouter keyLength={ 0 }>
            <Provider store={ store }>
                <ComparisonHeader { ...props }/>
            </Provider>
        </MemoryRouter>);

        expect(asFragment()).toMatchSnapshot();
    });

    it('should call setHistory on toggleFactSort', async () => {
        props.factSort = 'desc';
        render(<ComparisonHeader { ...props }/>);

        await userEvent.click(screen.getByText('Fact'));
        expect(props.setHistory).toHaveBeenCalled();
    });

    it('should call setHistory on toggleStateSort', async () => {
        props.stateSort = 'desc';
        render(<ComparisonHeader { ...props }/>);

        await userEvent.click(screen.getByText('State'));
        expect(props.setHistory).toHaveBeenCalled();
    });

    it('should not render HistoricalProfilesPopover with no hspRead permissions', () => {
        props.mainList = fixtures.mainListAll;
        props.permissions.hspRead = false;
        const { asFragment } = render(
            <Provider store={ store }>
                <ComparisonHeader { ...props }/>
            </Provider>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
