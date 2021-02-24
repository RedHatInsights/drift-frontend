import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import { EmptyState } from '@patternfly/react-core';
import { Skeleton } from '@redhat-cloud-services/frontend-components';

import ConnectedDriftTable, { DriftTable } from '../DriftTable';
import { compareReducerPayload, compareReducerPayloadWithMultiFact, baselinesPayload,
    historicalProfilesPayload } from '../../../modules/__tests__/reducer.fixtures';
import stateFilterFixtures from '../../../modules/__tests__/state-filter.fixtures';
import ReferenceSelector from '../ReferenceSelector/ReferenceSelector';
import { ASC, DESC } from '../../../../constants';

describe('DriftTable', () => {
    let props;

    beforeEach(() => {
        props = {
            location: {},
            history: { push: jest.fn() },
            fetchCompare: jest.fn(),
            fullCompareData: [],
            filteredCompareData: [],
            systems: [],
            baselines: [],
            historicalProfiles: [],
            factSort: ASC,
            stateSort: DESC,
            loading: false,
            isFirstReference: true,
            stateFilters: stateFilterFixtures.allStatesTrue,
            toggleFactSort: jest.fn(),
            toggleStateSort: jest.fn(),
            expandRow: jest.fn(),
            expandedRows: [],
            setSelectedBaselines: jest.fn(),
            selectHistoricProfiles: jest.fn(),
            updateReferenceId: jest.fn(),
            setIsFirstReference: jest.fn(),
            clearComparison: jest.fn(),
            setHistory: jest.fn(),
            handleFactFilter: jest.fn(),
            addStateFilter: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <DriftTable { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call clearComparison on fetchCompare with no data', () => {
        const wrapper = shallow(
            <DriftTable { ...props } />
        );

        wrapper.instance().fetchCompare([], [], [], undefined);
        expect(props.clearComparison).toHaveBeenCalled();
    });

    it('should set first reference on baselineId', async () => {
        const wrapper = shallow(
            <DriftTable { ...props } />
        );

        await wrapper.instance().fetchCompare([], [ 'abcd1234' ], [], undefined);
        expect(props.setIsFirstReference).toHaveBeenCalledWith(false);
    });

    it('should set first reference on referenceId', async () => {
        const wrapper = shallow(
            <DriftTable { ...props } />
        );

        await wrapper.instance().fetchCompare([ 'abcd1234' ], [], [], 'abcd1234');
        expect(props.setIsFirstReference).toHaveBeenCalledWith(false);
    });

    it('should set first isFirstReference to true with no data', () => {
        props.location.search = 'baseline_ids=abcd1234';
        props.isFirstReference = false;
        const wrapper = shallow(
            <DriftTable { ...props } />
        );

        wrapper.instance().removeSystem({
            type: 'baseline',
            id: 'abcd1234'
        });
        expect(props.setIsFirstReference).toHaveBeenCalledWith(true);
    });

    it('should set fact filter', () => {
        props.location.search = 'filter[name]=abc,123';
        const wrapper = shallow(
            <DriftTable { ...props } />
        );

        wrapper.instance().setFilters();
        expect(props.handleFactFilter).toHaveBeenCalledWith('abc');
        expect(props.handleFactFilter).toHaveBeenCalledWith('123');
    });

    it('should set state filter', () => {
        props.location.search = 'filter[state]=same,incomplete_data';
        const wrapper = shallow(
            <DriftTable { ...props } />
        );

        wrapper.instance().setFilters();
        expect(props.addStateFilter).toHaveBeenCalledWith(stateFilterFixtures.allStatesFalse[0]);
        expect(props.addStateFilter).toHaveBeenCalledWith(stateFilterFixtures.allStatesFalse[2]);
    });

    it('should set sort asc', () => {
        props.location.search = 'sort=fact,state';
        const wrapper = shallow(
            <DriftTable { ...props } />
        );

        wrapper.instance().setSort();
        expect(props.toggleFactSort).toHaveBeenCalledWith(DESC);
        expect(props.toggleStateSort).toHaveBeenCalledWith('');
    });

    it('should set sort desc', () => {
        props.location.search = 'sort=-fact,-state';
        const wrapper = shallow(
            <DriftTable { ...props } />
        );

        wrapper.instance().setSort();
        expect(props.toggleFactSort).toHaveBeenCalledWith(ASC);
        expect(props.toggleStateSort).toHaveBeenCalledWith(ASC);
    });

    it('should set state sort, no sort', () => {
        props.location.search = 'sort=fact';
        const wrapper = shallow(
            <DriftTable { ...props } />
        );

        wrapper.instance().setSort();
        expect(props.toggleFactSort).toHaveBeenCalledWith(DESC);
        expect(props.toggleStateSort).toHaveBeenCalledWith(DESC);
    });
});

describe('ConnectedDriftTable', () => {
    let initialState;
    let props;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            compareState: {
                loading: false,
                fullCompareData: [],
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ],
                emptyState: false,
                expandedRows: []
            },
            addSystemModalState: { addSystemModalOpened: false, selectedSystemIds: []},
            baselinesTableState: {
                comparisonTable: {
                    selectedBaselineIds: []
                },
                checkboxTable: {
                    selectedBaselineIds: []
                }
            },
            historicProfilesState: { selectedHSPIds: []}
        };

        props = {
            systems: [],
            baselines: [],
            historicalProfiles: [],
            updateReferenceId: jest.fn()
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        let error = {};

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDriftTable
                        { ...props }
                        error={ error }
                    />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render systems, baselines and historicalProfiles', () => {
        initialState.compareState.fullCompareData = compareReducerPayload.facts;
        initialState.compareState.filteredCompareData = compareReducerPayload.facts;
        initialState.compareState.loading = false;
        props.systems = compareReducerPayload.systems;
        props.baselines = baselinesPayload;
        props.historicalProfiles = historicalProfilesPayload;

        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDriftTable { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find('table')).toHaveLength(1);
        expect(wrapper.find('tr')).toHaveLength(4);
        expect(wrapper.find(EmptyState)).toHaveLength(0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render multi fact values', () => {
        initialState.compareState.fullCompareData = compareReducerPayloadWithMultiFact.facts;
        initialState.compareState.filteredCompareData = compareReducerPayloadWithMultiFact.facts;
        initialState.compareState.loading = false;
        initialState.compareState.expandedRows = [ 'cpu_flags', 'abc' ];
        props.systems = compareReducerPayloadWithMultiFact.systems;
        props.baselines = baselinesPayload;
        props.historicalProfiles = historicalProfilesPayload;

        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDriftTable { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find('table')).toHaveLength(1);
        expect(wrapper.find('tr')).toHaveLength(10);
        expect(wrapper.find(EmptyState)).toHaveLength(0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading rows', () => {
        initialState.compareState.loading = true;
        const store = mockStore(initialState);
        let error = {};

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDriftTable
                        { ...props }
                        error={ error }
                    />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find('tr')).toHaveLength(11);
        expect(wrapper.find(Skeleton)).toHaveLength(30);
        expect(wrapper.find(EmptyState)).toHaveLength(0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call updateReferenceId with new reference id', () => {
        initialState.compareState.fullCompareData = compareReducerPayload.facts;
        initialState.compareState.loading = false;
        initialState.historicProfilesState.selectedHSPIds = [
            '9bbbefcc-8f23-4d97-07f2-142asdl234e8', 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27'
        ];
        props.systems = compareReducerPayload.systems;
        props.baselines = baselinesPayload;
        props.historicalProfiles = historicalProfilesPayload;
        let setIsFirstReference = jest.fn();

        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDriftTable
                        { ...props }
                        setIsFirstReference={ setIsFirstReference }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find(ReferenceSelector).first().simulate('click');
        expect(props.updateReferenceId).toHaveBeenCalledWith('9bbbefcc-8f23-4d97-07f2-142asdl234e9');
    });
});
