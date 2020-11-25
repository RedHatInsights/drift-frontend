import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedAddSystemModal, { AddSystemModal } from '../AddSystemModal';
import { compareReducerPayload } from '../../modules/__tests__/reducer.fixtures';
import { createMiddlewareListener } from '../../../store';
import { PermissionContext } from '../../../App';

const middlewareListener = createMiddlewareListener();
middlewareListener.getMiddleware();

describe('AddSystemModal', () => {
    let props;
    let value;

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
            historicalProfiles: [],
            hasInventoryReadPermissions: true
        };

        value = {
            permissions: {
                compareRead: true,
                baselinesRead: true,
                baselinesWrite: true
            }
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <AddSystemModal
                { ...props }
                value={ value }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ConnectedAddSystemModal', () => {
    let initialState;
    let mockStore;
    let value;
    let props;

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
            entities: {
                selectedSystemIds: []
            },
            addSystemModalActions: {
                toggleAddSystemModal: jest.fn()
            }
        };

        props = {
            hasInventoryReadPermissions: true
        };

        value = {
            permissions: {
                compareRead: true,
                baselinesRead: true,
                baselinesWrite: true
            }
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedAddSystemModal { ...props } />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled with no inventory permissions', () => {
        const store = mockStore(initialState);
        props.hasInventoryReadPermissions = false;

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedAddSystemModal { ...props } />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render submit button disabled', () => {
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedAddSystemModal { ...props } />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(wrapper.find('.pf-c-button').at(1).prop('disabled')).toBe(true);
    });

    it('should render baselines correctly', () => {
        initialState.addSystemModalState.activeTab = 1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedAddSystemModal { ...props } />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it.skip('should confirm modal with one system selected', () => {
        const confirmModal = jest.fn();
        initialState.entities.selectedSystemIds = [ 'abcd1234' ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedAddSystemModal
                            confirmModal={ confirmModal }
                            { ...props }
                        />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        wrapper.find('.pf-c-button').at(1).simulate('click');
        expect(confirmModal).toHaveBeenCalledTimes(1);
    });

    it.skip('should confirm modal with one baseline selected', () => {
        const confirmModal = jest.fn();
        initialState.baselinesTableState.checkboxTable.selectedBaselineIds = [ 'abcd1234' ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedAddSystemModal
                            confirmModal={ confirmModal }
                            { ...props }
                        />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        wrapper.find('.pf-c-button').at(1).simulate('click');
        expect(confirmModal).toHaveBeenCalledTimes(1);
    });

    it.skip('should confirm modal with one HSP selected', () => {
        const confirmModal = jest.fn();
        initialState.historicProfilesState.selectedHSPIds = [ 'abcd1234' ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedAddSystemModal
                            confirmModal={ confirmModal }
                            { ...props }
                        />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        wrapper.find('.pf-c-button').at(1).simulate('click');
        expect(confirmModal).toHaveBeenCalledTimes(1);
    });

    it.skip('should change tab', () => {
        const store = mockStore(initialState);
        const selectActiveTab = jest.fn();

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedAddSystemModal
                            selectActiveTab={ selectActiveTab }
                            { ...props }
                        />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        wrapper.find('.pf-c-tabs__button').at(4).simulate('click');
        expect(selectActiveTab).toHaveBeenCalled();
    });

    it.skip('should toggle modal', () => {
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedAddSystemModal
                            { ...props }
                        />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        wrapper.find('.pf-c-button.pf-m-plain').at(0).simulate('click');
        expect(props.toggleAddSystemModal).toHaveBeenCalledTimes(1);
    });

    it.skip('should cancel modal', () => {
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedAddSystemModal
                            { ...props }
                        />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        wrapper.find('.pf-c-button.pf-m-link').simulate('click');
        expect(initialState.addSystemModalActions.toggleAddSystemModal).toHaveBeenCalled();
    });
});
