/*eslint-disable camelcase*/
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import DriftPage from '../DriftPage';
import { compareReducerPayloadWithMultiFact, fullSingleSystemComparison } from '../../modules/__tests__/reducer.fixtures';
import { systemIds, baselineIds, HSPIds } from './fixtures/DriftPage.fixtures';
import { ASC, DESC, EMPTY_COMPARISON_MESSAGE } from '../../../constants';
import stateFilterFixtures from '../../modules/__tests__/state-filter.fixtures';
import { PermissionContext } from '../../../App';
import { createMiddlewareListener, init } from '../../../store';
import { compareActions } from '../../modules';
import { useSearchParams } from 'react-router-dom';
import api from '../../../api';

const middlewareListener = createMiddlewareListener();
middlewareListener.getMiddleware();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useSearchParams: jest.fn(() => [])
}));

jest.mock('../../../api');

describe('DriftPage react testing libarary', () => {
    const store = init().registry.getStore();
    let value;
    let props;
    let mockHandleFactFilter;
    let mockHandleStateFilter;
    let mockHandleFactSort;
    let mockHandleStateSort;
    let mockClearComparison;
    let mockRevertCompareData;

    beforeEach(() => {
        mockHandleFactFilter = jest.spyOn(compareActions, 'handleFactFilter');
        mockHandleStateFilter = jest.spyOn(compareActions, 'addStateFilter');
        mockHandleFactSort = jest.spyOn(compareActions, 'toggleFactSort');
        mockHandleStateSort = jest.spyOn(compareActions, 'toggleStateSort');
        mockClearComparison = jest.spyOn(compareActions, 'clearComparison');
        mockRevertCompareData = jest.spyOn(compareActions, 'revertCompareData');
        useSearchParams.mockImplementation(() => [ new URLSearchParams({
            system_ids: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2' ],
            baseline_ids: [ '9bbbefcc-8f23-4d97-07f2-142asdl234e9', 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29' ],
            hsp_ids: [ '9bbbefcc-8f23-4d97-07f2-142asdl234e8', 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27' ],
            reference_id: '',
            'filter[show]': 'all',
            'filter[state]': 'same,different,incomplete_data',
            sort: '-state,fact'
        }) ]);

        props = {
            title: 'Comparison - Drift | Red Hat Insights'
        };

        value = {
            permissions: {
                compareRead: true,
                baselinesRead: true,
                baselinesWrite: true
            }
        };
    });

    it('should render EmptyState', () => {
        useSearchParams.mockImplementation(() => [ new URLSearchParams() ]);

        render(
            <PermissionContext.Provider value={ value }>
                <Provider store={ store }>
                    <DriftPage { ...props } />
                </Provider>
            </PermissionContext.Provider>
        );

        expect(screen.getByText(...EMPTY_COMPARISON_MESSAGE)).toBeInTheDocument();
    });

    it('should render no permissions', () => {
        value.permissions.compareRead = false;
        useSearchParams.mockImplementation(() => [ new URLSearchParams() ]);

        render(
            <PermissionContext.Provider value={ value }>
                <Provider store={ store }>
                    <DriftPage { ...props } />
                </Provider>
            </PermissionContext.Provider>
        );

        expect(screen.getByText('You do not have access to Drift comparison')).toBeInTheDocument();
    });

    it('should set fact filter', async () => {
        useSearchParams.mockImplementation(() => [ new URLSearchParams({ 'filter[name]': 'abc,123' }) ]);

        render(
            <PermissionContext.Provider value={ value }>
                <Provider store={ store }>
                    <DriftPage { ...props } />
                </Provider>
            </PermissionContext.Provider>
        );

        expect(mockHandleFactFilter).toHaveBeenCalledWith('abc');
        expect(mockHandleFactFilter).toHaveBeenCalledWith('123');
    });

    it('should set state filter', () => {
        useSearchParams.mockImplementation(() => [ new URLSearchParams({ 'filter[state]': 'same,incomplete_data' }) ]);

        render(
            <PermissionContext.Provider value={ value }>
                <Provider store={ store }>
                    <DriftPage { ...props } />
                </Provider>
            </PermissionContext.Provider>
        );

        expect(mockHandleStateFilter).toHaveBeenCalledWith(stateFilterFixtures.allStatesTrue[0]);
        expect(mockHandleStateFilter).toHaveBeenCalledWith(stateFilterFixtures.allStatesFalse[1]);
        expect(mockHandleStateFilter).toHaveBeenCalledWith(stateFilterFixtures.allStatesTrue[2]);
    });

    it('should set sort asc', () => {
        useSearchParams.mockImplementation(() => [ new URLSearchParams({ sort: 'fact,state' }) ]);

        render(
            <PermissionContext.Provider value={ value }>
                <Provider store={ store }>
                    <DriftPage { ...props } />
                </Provider>
            </PermissionContext.Provider>
        );

        expect(mockHandleFactSort).toHaveBeenCalledWith(DESC);
        expect(mockHandleStateSort).toHaveBeenCalledWith('');
    });

    it('should set sort desc', () => {
        useSearchParams.mockImplementation(() => [ new URLSearchParams({ sort: '-fact,-state' }) ]);
        render(
            <PermissionContext.Provider value={ value }>
                <Provider store={ store }>
                    <DriftPage { ...props } />
                </Provider>
            </PermissionContext.Provider>
        );

        expect(mockHandleFactSort).toHaveBeenCalledWith(ASC);
        expect(mockHandleStateSort).toHaveBeenCalledWith(ASC);
    });

    it('should set state sort, no sort', () => {
        useSearchParams.mockImplementation(() => [ new URLSearchParams({ sort: 'fact' }) ]);
        render(
            <PermissionContext.Provider value={ value }>
                <Provider store={ store }>
                    <DriftPage { ...props } />
                </Provider>
            </PermissionContext.Provider>
        );

        expect(mockHandleFactSort).toHaveBeenCalledWith(DESC);
        expect(mockHandleStateSort).toHaveBeenCalledWith(DESC);
    });

    it('should handle fetchCompare with no ref in url', () => {
        /*eslint-disable max-len*/
        useSearchParams.mockImplementation(
            () => [ new URLSearchParams
            (`?system_ids=9c79efcc-8f9a-47c7-b0f2-142ff52e89e9&system_ids=f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2&baseline_ids=9bbbefcc-8f23-4d97-07f2-142asdl234e9&baseline_ids=fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29&hsp_ids=9bbbefcc-8f23-4d97-07f2-142asdl234e8&hsp_ids=edmk59dj-fn42-dfjk-alv3-bmn2854mnn27`)
            ]
        );
        /*eslint-enable max-len*/
        api.getCompare.mockImplementation(async () => {
            return compareReducerPayloadWithMultiFact;
        });

        render(
            <PermissionContext.Provider value={ value }>
                <Provider store={ store }>
                    <DriftPage { ...props } />
                </Provider>
            </PermissionContext.Provider>
        );

        expect(api.getCompare).toHaveBeenCalledWith(systemIds, baselineIds, HSPIds, '9bbbefcc-8f23-4d97-07f2-142asdl234e9');
    });

    it('should handle fetchCompare with ref in url', () => {
        /*eslint-disable max-len*/
        useSearchParams.mockImplementation(
            () => [ new URLSearchParams
            (`?system_ids=9c79efcc-8f9a-47c7-b0f2-142ff52e89e9&system_ids=f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2&baseline_ids=9bbbefcc-8f23-4d97-07f2-142asdl234e9&baseline_ids=fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29&hsp_ids=9bbbefcc-8f23-4d97-07f2-142asdl234e8&hsp_ids=edmk59dj-fn42-dfjk-alv3-bmn2854mnn27&reference_id=f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2`)
            ]
        );
        /*eslint-enable max-len*/
        api.getCompare.mockImplementation(async () => {
            return compareReducerPayloadWithMultiFact;
        });

        render(
            <PermissionContext.Provider value={ value }>
                <Provider store={ store }>
                    <DriftPage { ...props } />
                </Provider>
            </PermissionContext.Provider>
        );

        expect(api.getCompare).toHaveBeenCalledWith(systemIds, baselineIds, HSPIds, 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2');
    });

    it('should set reference_id to undefined with ref in url that is not in the comparison', () => {
        /*eslint-disable max-len*/
        useSearchParams.mockImplementation(
            () => [ new URLSearchParams
            (`?system_ids=9c79efcc-8f9a-47c7-b0f2-142ff52e89e9&system_ids=f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2&baseline_ids=9bbbefcc-8f23-4d97-07f2-142asdl234e9&baseline_ids=fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29&hsp_ids=9bbbefcc-8f23-4d97-07f2-142asdl234e8&hsp_ids=edmk59dj-fn42-dfjk-alv3-bmn2854mnn27&reference_id=b22b1e1d-d231-43f2-8e4f-8f9cb01e3aa2`)
            ]
        );
        /*eslint-enable max-len*/
        api.getCompare.mockImplementation(async () => {
            return compareReducerPayloadWithMultiFact;
        });

        render(
            <PermissionContext.Provider value={ value }>
                <Provider store={ store }>
                    <DriftPage { ...props } />
                </Provider>
            </PermissionContext.Provider>
        );

        expect(api.getCompare).toHaveBeenCalledWith(systemIds, baselineIds, HSPIds, undefined);
    });

    it('should call clear comparison on system removal', async () => {
        /*eslint-disable max-len*/
        useSearchParams.mockImplementation(
            () => [ new URLSearchParams('?system_ids=9c79efcc-8f9a-47c7-b0f2-142ff52e89e9') ]
        );
        /*eslint-enable max-len*/

        api.getCompare.mockImplementation(async () => {
            return fullSingleSystemComparison;
        });

        render(
            <PermissionContext.Provider value={ value }>
                <Provider store={ store }>
                    <DriftPage { ...props } />
                </Provider>
            </PermissionContext.Provider>
        );

        await waitFor(() => userEvent.click(screen.getByTestId('remove-system-button-9c79efcc-8f9a-47c7-b0f2-142ff52e89e9')));

        expect(mockClearComparison).toHaveBeenCalled();
    });

    it.skip('should call revertCompare on AddSystemModal close', async () => {
        /*eslint-disable max-len*/
        useSearchParams.mockImplementation(
            () => [ new URLSearchParams('?system_ids=9c79efcc-8f9a-47c7-b0f2-142ff52e89e9') ]
        );
        /*eslint-enable max-len*/

        api.getCompare.mockImplementation(async () => {
            return fullSingleSystemComparison;
        });

        render(
            <PermissionContext.Provider value={ value }>
                <Provider store={ store }>
                    <DriftPage { ...props } />
                </Provider>
            </PermissionContext.Provider>
        );

        await waitFor(() => userEvent.click(screen.getByTestId('add-to-comparison-button')));
        await waitFor(() => userEvent.click(screen.getByTestId('close-add-system-modal')));

        expect(mockRevertCompareData).toHaveBeenCalled();
    });
});
/*eslint-enable camelcase*/
