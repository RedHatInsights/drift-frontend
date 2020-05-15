import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedDriftPage, { DriftPage } from '../DriftPage';
import { compareReducerPayload, baselinesPayload } from '../../modules/__tests__/reducer.fixtures';

global.insights = {
    chrome: {
        auth: {
            getUser: () => new Promise((resolve) => {
                setTimeout(resolve, 1);
            }),
            logout: jest.fn()
        }
    }
};

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

    it('should render correctly', () => {
        const wrapper = shallow(
            <DriftPage { ...props } />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
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
});

describe('ConnectedDriftPage', () => {
    let initialState;
    let mockStore;

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
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDriftPage />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find('.drift-toolbar')).toHaveLength(6);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with error alert', () => {
        initialState.compareState.error.detail = 'something';
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDriftPage />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render systems and baselines', () => {
        initialState.compareState.systems = compareReducerPayload.systems;
        initialState.compareState.baselines = baselinesPayload;
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDriftPage />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find('.drift-toolbar')).toHaveLength(6);
    });

    it('should toggle kebab', () => {
        initialState.compareState.systems = compareReducerPayload.systems;
        initialState.compareState.baselines = baselinesPayload;
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDriftPage />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-dropdown__toggle').at(1).simulate('click');
        expect(wrapper.find('[id="action-kebab"]').first().prop('isOpen')).toBe(true);
    });
});
