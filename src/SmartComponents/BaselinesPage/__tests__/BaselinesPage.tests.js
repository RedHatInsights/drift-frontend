import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';
import baselinesTableFixtures from '../../BaselinesTable/redux/__tests__/baselinesTableReducer.fixtures';
import _ from 'lodash';

import ConnectedBaselinesPage, { BaselinesPage } from '../BaselinesPage';
import { PermissionContext } from '../../../App';
import { createMiddlewareListener } from '../../../store';

const middlewareListener = createMiddlewareListener();
middlewareListener.getMiddleware();

jest.mock('../../BaselinesTable/redux', () => ({
    baselinesTableActions: {
        selectBaseline: jest.fn(()=> ({ type: 'null' })),
        revertBaselineFetch: jest.fn(()=> ({ type: 'null' })),
        fetchBaselines: jest.fn(()=> ({ type: 'null' }))
    }
}));

describe('BaselinesPage', () => {
    let props;
    let value;

    beforeEach(() => {
        props = {
            loading: false,
            emptyState: false,
            baselineError: {},
            clearEditBaselineData: jest.fn()
        };

        value = {
            permissions: {
                compareRead: true,
                baselinesRead: true,
                baselinesWrite: true
            }
        };
    });

    it('should call onSelect with isSelected true', () => {
        props.baselineTableData = [
            [ '1234', 'baseline 1', '1 month ago' ],
            [ '5678', 'baseline 2', '2 months ago' ]
        ];
        const selectBaseline = jest.fn();
        const wrapper = shallow(
            <PermissionContext.Provider value={ value }>
                <BaselinesPage
                    { ...props }
                    selectBaseline={ selectBaseline }
                    value={ value }
                />
            </PermissionContext.Provider>
        );

        wrapper.find(BaselinesPage).dive().instance().onSelect(_, true, 0);
        expect(selectBaseline).toHaveBeenCalledWith([ '1234' ], true, 'CHECKBOX');
    });

    it('should call onSelect with isSelected false', () => {
        props.baselineTableData = [
            [ '1234', 'baseline 1', '1 month ago' ],
            [ '5678', 'baseline 2', '2 months ago' ]
        ];
        const selectBaseline = jest.fn();
        const wrapper = shallow(
            <PermissionContext.Provider value={ value }>
                <BaselinesPage
                    { ...props }
                    selectBaseline={ selectBaseline }
                />
            </PermissionContext.Provider>
        );

        wrapper.find(BaselinesPage).dive().instance().onSelect(_, false, 0);
        expect(selectBaseline).toHaveBeenCalledWith([ '1234' ], false, 'CHECKBOX');
    });

    it('should call onSelect and select all', () => {
        props.baselineTableData = [
            [ '1234', 'baseline 1', '1 month ago' ],
            [ '5678', 'baseline 2', '2 months ago' ]
        ];
        const selectBaseline = jest.fn();
        const wrapper = shallow(
            <PermissionContext.Provider value={ value }>
                <BaselinesPage
                    { ...props }
                    selectBaseline={ selectBaseline }
                />
            </PermissionContext.Provider>
        );

        wrapper.find(BaselinesPage).dive().instance().onSelect(_, true, -1);
        expect(selectBaseline).toHaveBeenCalledWith([ '1234', '5678' ], true, 'CHECKBOX');
    });
});

describe('ConnectedBaselinesPage', () => {
    let initialState;
    let mockStore;
    let value;

    beforeEach(() => {
        mockStore = configureStore();

        initialState = {
            baselinesTableState: {
                checkboxTable: {
                    loading: false,
                    emptyState: false,
                    baselineTableData: [],
                    selectedBaselineIds: [],
                    baselineError: {}
                },
                radioTable: {
                    loading: false,
                    emptyState: false,
                    selectedBaselineIds: [],
                    baselineError: {}
                }
            },
            createBaselineModalState: {
                createBaselineModalOpened: false,
                createBaselineError: {}
            },
            addSystemModalState: {
                addSystemModalOpened: false
            },
            compareState: {
                fullCompareData: []
            },
            historicProfilesState: {
                selectedHSPIds: []
            },
            editBaselineState: {
                notificationsSwitchError: {}
            }
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
                        <ConnectedBaselinesPage />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(wrapper.find('LockIcon')).toHaveLength(0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render empty with no read permissions', () => {
        value.permissions.baselinesRead = false;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedBaselinesPage />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(wrapper.find('LockIcon')).toHaveLength(1);
    });

    it('should render empty state', () => {
        initialState.baselinesTableState.checkboxTable.emptyState = true;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedBaselinesPage />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it.skip('should render error', () => {
        initialState.baselinesTableState.checkboxTable.loading = true;
        initialState.baselinesTableState.checkboxTable.baselineError = { detail: 'error', status: 404 };
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedBaselinesPage />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it.skip('should fetch baseline', () => {
        initialState.baselinesTableState.checkboxTable.baselineTableData = baselinesTableFixtures.baselineTableDataRows;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedBaselinesPage />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        wrapper.find('a').first().simulate('click');
        expect(wrapper.find('Router').prop('history').location.pathname).toEqual('/baselines/1234');
    });

    it.skip('should call revertBaselineFetch', () => {
        initialState.baselinesTableState.checkboxTable.baselineError = {
            detail: 'error',
            status: 404
        };
        initialState.baselinesTableState.checkboxTable.loading = true;
        const revertBaselineFetch = jest.fn();
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedBaselinesPage
                            revertBaselineFetch={ revertBaselineFetch }
                        />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        const actions = store.getActions();
        wrapper.find('a').simulate('click');
        expect(actions).toMatchSnapshot();
    });
});
