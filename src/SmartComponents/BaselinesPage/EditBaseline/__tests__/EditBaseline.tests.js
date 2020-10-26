import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';
import helpersFixtures from './helpers.fixtures';

import editBaselineFixtures from './helpers.fixtures';
import ConnectedEditBaseline from '../EditBaseline';
import api from '../../../../api';
import { PermissionContext } from '../../../../App';

describe('ConnectedEditBaseline', () => {
    let initialState;
    let mockStore;
    let value;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            editBaselineState: {
                baselineData: [],
                baselineDataLoading: false,
                factModalOpened: false,
                editBaselineTableData: [],
                expandedRows: [],
                selectAll: false,
                editBaselineEmptyState: false,
                editBaselineError: {},
                inlineError: {}
            },
            match: { params: {}},
            clearBaselineData: jest.fn(),
            selectFact: jest.fn(),
            onBulkSelect: jest.fn(),
            clearErrorData: jest.fn(),
            addNotification: jest.fn()
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
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(wrapper.find('EmptyStateDisplay')).toHaveLength(0);
        expect(wrapper.find('EditAltIcon')).toHaveLength(1);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render empty with no read permissions', () => {
        value.permissions.baselinesRead = false;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(wrapper.find('EmptyStateDisplay')).toHaveLength(1);
        expect(wrapper.find('EditAltIcon')).toHaveLength(0);
    });

    it('should render disabled with no write permissions', () => {
        value.permissions.baselinesWrite = false;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(wrapper.find('EditAltIcon')).toHaveLength(0);
        expect(wrapper.find('FactKebab')).toHaveLength(0);
        expect(wrapper.find('BulkSelect').prop('isDisabled')).toBe(true);
    });

    it('should render loading rows', () => {
        initialState.editBaselineState.baselineData = undefined;
        initialState.editBaselineState.baselineDataLoading = true;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render empty baseline', () => {
        initialState.editBaselineState.editBaselineEmptyState = true;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled button with empty baseline and no write permissions', () => {
        initialState.editBaselineState.editBaselineEmptyState = true;
        value.permissions.baselinesWrite = false;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with baseline facts', () => {
        initialState.editBaselineState.baselineData = editBaselineFixtures.mockBaselineData1;
        initialState.editBaselineState.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render expandable rows closed', () => {
        initialState.editBaselineState.editBaselineTableData = helpersFixtures.mockBaselineTableData1;
        initialState.editBaselineState.baselineData = helpersFixtures.mockBaselineAPIBody;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render expandable rows opened', () => {
        initialState.editBaselineState.editBaselineTableData = helpersFixtures.mockBaselineTableData1;
        initialState.editBaselineState.baselineData = helpersFixtures.mockBaselineAPIBody;
        initialState.editBaselineState.expandedRows = [ 'The Fellowship of the Ring' ];
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call clearBaselineData', () => {
        const store = mockStore(initialState);
        const history = { location: { pathname: '/baselines' }, push: jest.fn() };
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline
                            history={ history }
                        />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        const actions = store.getActions();
        wrapper.find('a').simulate('click');
        expect(actions).toEqual([
            { type: 'FETCH_BASELINE_DATA', payload: api.getBaselineData('blah') },
            { type: 'CLEAR_BASELINE_DATA_CHECKBOX' },
            { type: 'FETCH_BASELINE_LIST_CHECKBOX', payload: api.getBaselineList('blah') }
        ]);
    });

    it('should call expandRow', () => {
        initialState.editBaselineState.baselineData = editBaselineFixtures.mockBaselineData1;
        initialState.editBaselineState.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        const actions = store.getActions();
        wrapper.find('AngleRightIcon').at(1).simulate('click');
        expect(actions).toEqual([
            { type: 'FETCH_BASELINE_DATA', payload: api.getBaselineData('blah') },
            { type: 'EXPAND_PARENT_FACT', payload: 'The Fellowship of the Ring' }
        ]);
    });

    it('should call clearErrorData', () => {
        initialState.editBaselineState.baselineData = editBaselineFixtures.mockBaselineData1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        const actions = store.getActions();
        wrapper.find('EditAltIcon').simulate('click');
        expect(actions).toEqual([
            { type: 'FETCH_BASELINE_DATA', payload: api.getBaselineData('blah') },
            { type: 'CLEAR_ERROR_DATA' }
        ]);
    });

    it('should call selectFact', () => {
        initialState.editBaselineState.baselineData = editBaselineFixtures.mockBaselineData1;
        initialState.editBaselineState.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        const actions = store.getActions();
        const target = wrapper.find('[id="fact-0"]').at(1);
        target.getDOMNode().checked = true;
        target.getDOMNode().name = 0;
        target.simulate('change');
        wrapper.update();
        expect(actions).toEqual([
            { type: 'FETCH_BASELINE_DATA', payload: api.getBaselineData('blah') },
            { type: 'SELECT_FACT', payload: { ids: [ 0 ], isSelected: true }}
        ]);
    });

    it('should deselect single fact', () => {
        initialState.editBaselineState.baselineData = editBaselineFixtures.mockBaselineData1;
        initialState.editBaselineState.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        const actions = store.getActions();
        const target = wrapper.find('[id="fact-0"]').at(1);
        target.getDOMNode().checked = false;
        target.getDOMNode().name = 0;
        target.simulate('change');
        wrapper.update();
        expect(actions).toEqual([
            { type: 'FETCH_BASELINE_DATA', payload: api.getBaselineData('blah') },
            { type: 'SELECT_FACT', payload: { ids: [ 0 ], isSelected: false }}
        ]);
    });

    it('should select all sub facts', () => {
        initialState.editBaselineState.baselineData = editBaselineFixtures.mockBaselineData1;
        initialState.editBaselineState.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        const facts = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        const actions = store.getActions();
        const target = wrapper.find('[id="category-2"]').at(1);
        target.getDOMNode().checked = true;
        target.getDOMNode().name = 2;
        target.simulate('change');
        wrapper.update();
        expect(actions).toEqual([
            { type: 'FETCH_BASELINE_DATA', payload: api.getBaselineData('blah') },
            { type: 'SELECT_FACT', payload: { ids: facts, isSelected: true }}
        ]);
    });

    it('should deselect all sub facts', () => {
        initialState.editBaselineState.baselineData = editBaselineFixtures.mockBaselineData1;
        initialState.editBaselineState.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        const facts = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        const actions = store.getActions();
        const target = wrapper.find('[id="category-2"]').at(1);
        target.getDOMNode().checked = false;
        target.getDOMNode().name = 2;
        target.simulate('change');
        wrapper.update();
        expect(actions).toEqual([
            { type: 'FETCH_BASELINE_DATA', payload: api.getBaselineData('blah') },
            { type: 'SELECT_FACT', payload: { ids: facts, isSelected: false }}
        ]);
    });

    it('should select sub fact', () => {
        initialState.editBaselineState.baselineData = editBaselineFixtures.mockBaselineData1;
        initialState.editBaselineState.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        initialState.editBaselineState.expandedRows = [ 'The Fellowship of the Ring' ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        const actions = store.getActions();
        const target = wrapper.find('[id="fact-3"]').at(1);
        target.getDOMNode().checked = true;
        target.getDOMNode().name = 3;
        target.simulate('change');
        wrapper.update();
        expect(actions).toEqual([
            { type: 'FETCH_BASELINE_DATA', payload: api.getBaselineData('blah') },
            { type: 'SELECT_FACT', payload: { ids: [ 3 ], isSelected: true }}
        ]);
    });

    it('should deselect sub fact', () => {
        initialState.editBaselineState.baselineData = editBaselineFixtures.mockBaselineData1;
        initialState.editBaselineState.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        initialState.editBaselineState.expandedRows = [ 'The Fellowship of the Ring' ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline />
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        const actions = store.getActions();
        const target = wrapper.find('[id="fact-3"]').at(1);
        target.getDOMNode().checked = false;
        target.getDOMNode().name = 3;
        target.simulate('change');
        wrapper.update();
        expect(actions).toEqual([
            { type: 'FETCH_BASELINE_DATA', payload: api.getBaselineData('blah') },
            { type: 'SELECT_FACT', payload: { ids: [ 3 ], isSelected: false }}
        ]);
    });

    it.skip('should render toggle edit name modal', () => {
        initialState.editBaselineState.baselineData = editBaselineFixtures.mockBaselineData1;
        //const clearErrorData = jest.fn();
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaseline/>
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        wrapper.find('[className="pointer not-active edit-icon-margin"]').at(1).simulate('click');
        wrapper.update();
        //expect(initialState.clearErrorData).toHaveBeenCalled();
        expect(wrapper.instance().state.modalOpened).toBe(true);
    });
});
