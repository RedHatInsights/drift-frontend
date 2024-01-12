import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import DriftTable from '../DriftTable';
import { compareReducerPayloadWithMultiFact } from '../../../modules/__tests__/reducer.fixtures';
import comparisonHeaderFixtures from '../ComparisonHeader/__tests__/ComparisonHeader.fixtures';
import { ASC, DESC } from '../../../../constants';
import { createMiddlewareListener, init } from '../../../../store';
import userEvent from '@testing-library/user-event';

const middlewareListener = createMiddlewareListener();
middlewareListener.getMiddleware();

describe('DriftTable', () => {
    let props;
    const store = init().registry.getStore();

    beforeEach(() => {
        props = {
            factSort: ASC,
            filteredCompareData: compareReducerPayloadWithMultiFact.facts,
            handleFetchCompare: jest.fn(),
            historicalProfiles: compareReducerPayloadWithMultiFact.historical_system_profiles,
            isFirstReference: true,
            mainList: comparisonHeaderFixtures.mainListAll,
            permissions: {
                hspRead: true
            },
            referenceId: '',
            selectedBaselineIds: comparisonHeaderFixtures.fullSelectedBaselineIds,
            selectedHSPIds: comparisonHeaderFixtures.fullSelectedHSPIds,
            selectedSystemIds: comparisonHeaderFixtures.fullSelectedSystemIds,
            setHistory: jest.fn(),
            setIsFirstReference: jest.fn(),
            stateSort: DESC,
            toggleFactSort: jest.fn(),
            toggleStateSort: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render correctly', () => {
        const { asFragment } = render(
            <Provider store={ store }>
                <DriftTable { ...props }/>
            </Provider>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should call handleFetchCompare with updated reference id', async () => {
        render(
            <Provider store={ store }>
                <DriftTable { ...props }/>
            </Provider>
        );

        await waitFor(() => userEvent.click(screen.getAllByTestId('unselected-reference-icon')[0]));
        expect(props.handleFetchCompare).toHaveBeenCalledWith(
            comparisonHeaderFixtures.fullSelectedSystemIds,
            comparisonHeaderFixtures.fullSelectedBaselineIds,
            comparisonHeaderFixtures.fullSelectedHSPIds,
            '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
        );
    });

    it('should remove a system', async () => {
        render(
            <Provider store={ store }>
                <DriftTable { ...props }/>
            </Provider>
        );

        await waitFor(() => userEvent.click(screen.getByTestId('remove-system-button-f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2')));
        expect(props.handleFetchCompare).toHaveBeenCalledWith(
            [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' ],
            comparisonHeaderFixtures.fullSelectedBaselineIds,
            comparisonHeaderFixtures.fullSelectedHSPIds,
            ''
        );
    });

    it('should remove a system and its hsps', async () => {
        render(
            <Provider store={ store }>
                <DriftTable { ...props }/>
            </Provider>
        );

        await waitFor(() => userEvent.click(screen.getByTestId('remove-system-button-9c79efcc-8f9a-47c7-b0f2-142ff52e89e9')));
        expect(props.handleFetchCompare).toHaveBeenCalledWith(
            [ 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2' ],
            comparisonHeaderFixtures.fullSelectedBaselineIds,
            [],
            ''
        );
    });

    it('should remove a baseline', async () => {
        render(
            <Provider store={ store }>
                <DriftTable { ...props }/>
            </Provider>
        );

        await waitFor(() => userEvent.click(screen.getByTestId('remove-system-button-9bbbefcc-8f23-4d97-07f2-142asdl234e9')));
        expect(props.handleFetchCompare).toHaveBeenCalledWith(
            comparisonHeaderFixtures.fullSelectedSystemIds,
            [ 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29' ],
            comparisonHeaderFixtures.fullSelectedHSPIds,
            ''
        );
    });

    it('should remove a baseline and the reference', async () => {
        props.referenceId = '9bbbefcc-8f23-4d97-07f2-142asdl234e9';
        render(
            <Provider store={ store }>
                <DriftTable { ...props }/>
            </Provider>
        );

        await waitFor(() => userEvent.click(screen.getByTestId('remove-system-button-9bbbefcc-8f23-4d97-07f2-142asdl234e9')));
        expect(props.handleFetchCompare).toHaveBeenCalledWith(
            comparisonHeaderFixtures.fullSelectedSystemIds,
            [ 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29' ],
            comparisonHeaderFixtures.fullSelectedHSPIds,
            undefined
        );
    });

    it('should remove an hsp', async () => {
        props.referenceId = '9bbbefcc-8f23-4d97-07f2-142asdl234e9';
        render(
            <Provider store={ store }>
                <DriftTable { ...props }/>
            </Provider>
        );

        await waitFor(() => userEvent.click(screen.getByTestId('remove-system-button-9bbbefcc-8f23-4d97-07f2-142asdl234e8')));
        expect(props.handleFetchCompare).toHaveBeenCalledWith(
            comparisonHeaderFixtures.fullSelectedSystemIds,
            comparisonHeaderFixtures.fullSelectedBaselineIds,
            [ 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27' ],
            '9bbbefcc-8f23-4d97-07f2-142asdl234e9'
        );
    });
});
