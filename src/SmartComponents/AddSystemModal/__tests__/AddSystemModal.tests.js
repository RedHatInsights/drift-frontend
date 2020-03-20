import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedAddSystemModal, { AddSystemModal } from '../AddSystemModal';
import { compareReducerPayload } from '../../modules/__tests__/reducer.fixtures';

describe('AddSystemModal', () => {
    let props;

    beforeEach(() => {
        props = {
            addSystemModalOpened: true,
            systems: [],
            activeTab: 0,
            entities: {},
            selectedBaselineIds: [],
            baselines: [],
            selectedHSPIds: [],
            loading: false,
            baselineTableData: [],
            historicalProfiles: []
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <AddSystemModal { ...props }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ConnectedAddSystemModal', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            addSystemModalState: {
                addSystemModalOpened: true,
                activeTab: 0
            },
            compareState: {
                systems: compareReducerPayload.systems,
                baselines: [],
                historicalProfiles: []
            },
            baselinesTableState: {
                checkboxTable: {
                    selectedBaselineIds: [],
                    loading: false,
                    baselineTableData: []
                }
            },
            historicProfilesState: {
                selectedHSPIds: []
            },
            entities: {}
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render baselines correctly', () => {
        initialState.addSystemModalState.activeTab = 1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should confirm modal', () => {
        const confirmModal = jest.fn();
        const toggleModal = jest.fn();
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal
                        confirmModal={ confirmModal }
                        toggleModal={ toggleModal }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-button').at(5).simulate('click');
        expect(confirmModal).toHaveBeenCalledTimes(1);
    });

    it.skip('should change tab', () => {
        const store = mockStore(initialState);
        const selectActiveTab = jest.fn();

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal
                        selectActiveTab={ selectActiveTab }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-tabs__button').at(4).simulate('click');
        expect(selectActiveTab).toHaveBeenCalled();
    });

    it.skip('should toggle modal', () => {
        const toggleModal = jest.fn();
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal
                        toggleModal={ toggleModal }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-button').at(0).simulate('click');
        expect(toggleModal).toHaveBeenCalledTimes(1);
    });
});
