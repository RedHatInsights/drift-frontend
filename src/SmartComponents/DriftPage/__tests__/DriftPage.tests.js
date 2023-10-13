/*eslint-disable camelcase*/
import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedDriftPage, { DriftPage } from '../DriftPage';
import { compareReducerPayload, systemsPayload, baselinesPayload,
    historicalProfilesPayload, factTypeFiltersDefault } from '../../modules/__tests__/reducer.fixtures';
import { systemIds, baselineIds, HSPIds } from './fixtures/DriftPage.fixtures';
import { allStatesTrue } from '../../modules/__tests__/state-filter.fixtures';
import { ASC, DESC } from '../../../constants';
import * as setHistory from '../../../Utilities/SetHistory';
import { PermissionContext } from '../../../App';
import { createMiddlewareListener } from '../../../store';
const middlewareListener = createMiddlewareListener();
middlewareListener.getMiddleware();

jest.mock('../../BaselinesTable/redux', () => ({
    baselinesTableActions: {
        setSelectedBaselines: jest.fn(()=> ({ type: 'null' })),
        fetchCompare: jest.fn(()=> ({ type: 'null' }))
    }
}));

jest.mock('@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate', () => ({
    __esModule: true,
    default: () => jest.fn(),
    useInsightsNavigate: () => jest.fn()
}));

jest.mock('../../AddSystemModal/redux', () => ({
    addSystemModalActions: { }
}));

jest.mock('../../HistoricalProfilesPopover/redux', () => ({
    historicProfilesActions: { }
}));

jest.mock('../../modules', () => ({
    compareActions: {
        updateReferenceId: jest.fn(()=> ({ type: 'null' })),
        fetchCompare: jest.fn(()=> ({ type: 'null' })),
        handleFactFilter: jest.fn(()=> ({ type: 'null' })),
        addStateFilter: jest.fn(()=> ({ type: 'null' }))
    }
}));

describe('DriftPage', () => {
    let props;

    beforeEach(() => {
        props = {
            error: {},
            loading: false,
            systems: [],
            baselines: [],
            historicalProfiles: [],
            emptyState: false,
            factFilter: '',
            activeFactFilters: [],
            factSort: DESC,
            stateSort: ASC,
            referenceId: undefined,
            stateFilters: allStatesTrue,
            factTypeFilters: factTypeFiltersDefault,
            history: { location: { search: '' }, push: jest.fn() },
            location: { search: '' },
            clearSelectedBaselines: jest.fn(),
            toggleErrorAlert: jest.fn(),
            clearComparison: jest.fn(),
            clearComparisonFilters: jest.fn(),
            selectHistoricProfiles: jest.fn(),
            updateReferenceId: jest.fn(),
            revertCompareData: jest.fn(),
            searchParams: {
                getAll: jest.fn(() => ''),
                get: jest.fn(() => '')
            },
            navigate: jest.fn(() => null)
        };
    });

    it('should call setIsFirstReference with true', () => {
        const wrapper = shallow(
            <DriftPage { ...props } />
        );
        wrapper.instance().setIsFirstReference(true);
        expect(wrapper.state('isFirstReference')).toBe(true);
    });

    it('should call setIsFirstReference with false', () => {
        const wrapper = shallow(
            <DriftPage { ...props } />
        );
        wrapper.instance().setIsFirstReference(false);
        expect(wrapper.state('isFirstReference')).toBe(false);
    });

    it('should call revertCompareData', () => {
        let previousStateSystems = [];

        const wrapper = shallow(
            <DriftPage { ...props } previousStateSystems={ previousStateSystems }/>
        );

        wrapper.instance().onClose();
        expect(props.revertCompareData).toHaveBeenCalled();
    });

    it('should call setHistory', async () => {
        props.systems = systemsPayload;
        props.baselines = baselinesPayload;
        props.historicalProfiles = historicalProfilesPayload;
        const setHistorySpy = jest.spyOn(setHistory, 'setHistory');

        const wrapper = shallow(
            <DriftPage { ...props } />
        );

        await wrapper.instance().setHistory();
        await expect(setHistorySpy).toHaveBeenCalledWith(
            props.navigate, systemIds, baselineIds, HSPIds, undefined, [], '', factTypeFiltersDefault, allStatesTrue, DESC, ASC
        );
    });

    it('should call setHistory', async () => {
        props.systems = systemsPayload;
        props.baselines = baselinesPayload;
        props.historicalProfiles = historicalProfilesPayload;
        const setHistorySpy = jest.spyOn(setHistory, 'setHistory');

        const wrapper = shallow(
            <DriftPage { ...props } />
        );

        await wrapper.instance().setHistory();
        await expect(setHistorySpy).toHaveBeenCalledWith(
            props.navigate, systemIds, baselineIds, HSPIds, undefined, [], '', factTypeFiltersDefault, allStatesTrue, DESC, ASC
        );
    });

});

describe('ConnectedDriftPage', () => {
    let initialState;
    let mockStore;
    let value;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            compareState: {
                error: {},
                emptyState: false,
                loading: false,
                systems: [],
                baselines: [],
                historicalProfiles: [],
                fullCompareData: [],
                previousStateSystems: [],
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ],
                factTypeFilters: factTypeFiltersDefault,
                factFilter: '',
                activeFactFilters: []
            },
            addSystemModalState: {
                addSystemModalOpened: false,
                selectedSystemIds: []
            },
            baselinesTableState: {
                comparisonTable: {
                    selectedBaselineIds: []
                },
                checkboxTable: {
                    selectedBaselineIds: []
                }
            },
            baselinesTableActions: {
                toggleErrorAlert: jest.fn()
            },
            historicProfilesActions: {
                selectHistoricProfiles: jest.fn()
            },
            historicProfilesState: {
                selectedHSPIds: []
            },
            compareActions: {
                clearComparisonFilters: jest.fn(),
                handleFactFilter: jest.fn(),
                clearAllFactFilters: jest.fn()
            }
        };

        value = {
            permissions: {
                compareRead: true
            }
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedDriftPage />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(wrapper.find('EmptyStateDisplay')).toHaveLength(0);
        expect(wrapper.find('.drift-toolbar')).toHaveLength(4);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render EmptyStateDisplay', () => {
        initialState.compareState.emptyState = true;
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedDriftPage />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(wrapper.find('EmptyStateDisplay')).toHaveLength(1);
    });

    it.skip('should render EmptyStateDisplay with error', () => {
        initialState.compareState.emptyState = true;
        initialState.compareState.error = { status: 400, detail: 'This is an error' };
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedDriftPage />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('EmptyStateDisplay')).toHaveLength(1);
    });

    it('should render empty with no read permissions', () => {
        value.permissions.compareRead = false;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedDriftPage />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(wrapper.find('EmptyStateDisplay')).toHaveLength(1);
    });

    it('should render with error alert', () => {
        initialState.compareState.error.detail = 'something';
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedDriftPage />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render systems and baselines', () => {
        initialState.compareState.systems = compareReducerPayload.systems;
        initialState.compareState.baselines = baselinesPayload;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedDriftPage />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(wrapper.find('.drift-toolbar')).toHaveLength(4);
    });

    it('should toggle kebab', () => {
        initialState.compareState.systems = compareReducerPayload.systems;
        initialState.compareState.baselines = baselinesPayload;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedDriftPage />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        wrapper.find('.pf-c-dropdown__toggle').at(2).simulate('click');
        expect(wrapper.find('[id="action-kebab"]').first().prop('isOpen')).toBe(true);
    });
});
/*eslint-enable camelcase*/
