import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedDriftPage, { DriftPage } from '../DriftPage';
import { compareReducerPayload, baselinesPayload } from '../../modules/__tests__/reducer.fixtures';
import { PermissionContext } from '../../../App';

describe('DriftPage', () => {
    let props;

    beforeEach(() => {
        props = {
            error: {},
            loading: false,
            systems: [],
            baselines: [],
            clearSelectedBaselines: jest.fn(),
            toggleErrorAlert: jest.fn(),
            clearComparison: jest.fn(),
            clearComparisonFilters: jest.fn(),
            selectHistoricProfiles: jest.fn(),
            updateReferenceId: jest.fn(),
            history: { push: jest.fn() }
        };
    });

    it('should call clearComparisonFilters', () => {
        const wrapper = shallow(
            <DriftPage { ...props } />
        );
        wrapper.instance().clearFilters();
        expect(props.clearComparisonFilters).toHaveBeenCalled();
    });

    it('should call clearComparison', () => {
        const wrapper = shallow(
            <DriftPage { ...props } />
        );
        wrapper.instance().clearComparison();
        expect(props.clearComparison).toHaveBeenCalled();
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
                loading: false,
                systems: [],
                baselines: [],
                historicalProfiles: [],
                fullCompareData: [],
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ]
            },
            addSystemModalState: {
                addSystemModalOpened: false
            },
            baselinesTableState: {
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
                clearComparisonFilters: jest.fn()
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
        expect(wrapper.find('.drift-toolbar')).toHaveLength(6);
        expect(toJson(wrapper)).toMatchSnapshot();
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

        expect(wrapper.find('.drift-toolbar')).toHaveLength(6);
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
