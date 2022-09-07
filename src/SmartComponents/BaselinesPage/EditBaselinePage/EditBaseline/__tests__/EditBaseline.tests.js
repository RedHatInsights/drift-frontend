import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';
import helpersFixtures from './helpers.fixtures';
import { init } from '../../../../../store';

//import editBaselineFixtures from './helpers.fixtures';
import EditBaseline from '../EditBaseline';
import { RegistryContext } from '../../../../../Utilities/registry';
//import api from '../../../../../api';

describe('EditBaseline', () => {
    let initialState;
    let props;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            editBaselineState: {
                baselineData: {},
                baselineDataLoading: false,
                factModalOpened: false,
                expandedRows: [],
                selectAll: false,
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

        props = {
            baselineData: {},
            editBaselineTableData: [],
            editBaselineEmptyState: false,
            editBaselineError: {},
            expandedRows: [],
            permissions: {
                baselinesWrite: true
            }
        };
    });

    it('should render correctly', () => {
        let registry = init();
        let store = registry.registry.getStore();
        const wrapper = mount(
            <RegistryContext.Provider value={ registry }>
                <Provider store={ store }>
                    <EditBaseline { ...props }/>
                </Provider>
            </RegistryContext.Provider>
        );

        expect(wrapper.find('EmptyStateDisplay')).toHaveLength(0);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    /*it('should render empty with no read permissions', () => {
        value.permissions.baselinesRead = false;
        const store = mockStore(initialState);
        const wrapper = shallow(
            <EditBaseline { ...props }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('EmptyStateDisplay')).toHaveLength(1);
        //expect(wrapper.find('EditAltIcon')).toHaveLength(0);
    });*/

    it('should render disabled with no write permissions', () => {
        let registry = init();
        let store = registry.registry.getStore();
        props.permissions.baselinesWrite = false;
        const wrapper = mount(
            <RegistryContext.Provider value={ registry }>
                <Provider store={ store }>
                    <EditBaseline { ...props }/>
                </Provider>
            </RegistryContext.Provider>
        );

        expect(wrapper.find('FactKebab')).toHaveLength(0);
    });

    it('should render loading rows', () => {
        let registry = init();
        let store = registry.registry.getStore();
        props.baselineData = undefined;
        props.baselineDataLoading = true;
        const wrapper = mount(
            <RegistryContext.Provider value={ registry }>
                <Provider store={ store }>
                    <EditBaseline { ...props }/>
                </Provider>
            </RegistryContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render empty baseline', () => {
        let registry = init();
        let store = registry.registry.getStore();
        props.editBaselineEmptyState = true;
        const wrapper = mount(
            <RegistryContext.Provider value={ registry }>
                <Provider store={ store }>
                    <EditBaseline { ...props }/>
                </Provider>
            </RegistryContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    /*it('should render disabled button with empty baseline and no write permissions', () => {
        initialState.editBaselineState.editBaselineEmptyState = true;
        value.permissions.baselinesWrite = false;
        const store = mockStore(initialState);
        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <EditBaseline { ...props }/>
                    </Provider>
                </MemoryRouter>
            </PermissionContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });*/

    it('should render with baseline facts', () => {
        let registry = init();
        let store = registry.registry.getStore();
        props.baselineData = helpersFixtures.mockBaselineData1;
        props.editBaselineTableData = helpersFixtures.mockBaselineTableData1;
        const wrapper = mount(
            <RegistryContext.Provider value={ registry }>
                <Provider store={ store }>
                    <EditBaseline { ...props } />
                </Provider>
            </RegistryContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render expandable rows closed', () => {
        let registry = init();
        let store = registry.registry.getStore();
        props.editBaselineTableData = helpersFixtures.mockBaselineTableData1;
        props.baselineData = helpersFixtures.mockBaselineAPIBody;
        const wrapper = mount(
            <RegistryContext.Provider value={ registry }>
                <Provider store={ store }>
                    <EditBaseline { ...props }/>
                </Provider>
            </RegistryContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render expandable rows opened', () => {
        let registry = init();
        let store = registry.registry.getStore();
        props.editBaselineTableData = helpersFixtures.mockBaselineTableData1;
        props.baselineData = helpersFixtures.mockBaselineAPIBody;
        props.expandedRows = [ 'The Fellowship of the Ring' ];
        const wrapper = mount(
            <RegistryContext.Provider value={ registry }>
                <Provider store={ store }>
                    <EditBaseline { ...props }/>
                </Provider>
            </RegistryContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with baseline facts with same name', () => {
        let registry = init();
        let store = registry.registry.getStore();
        props.baselineData = helpersFixtures.mockBaselineDataSameName1;
        props.editBaselineTableData = helpersFixtures.mockBaselineTableDataSameName1;
        const wrapper = mount(
            <RegistryContext.Provider value={ registry }>
                <Provider store={ store }>
                    <EditBaseline { ...props } />
                </Provider>
            </RegistryContext.Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    /*it('should call clearBaselineData', () => {
        const store = mockStore(initialState);
        const history = { location: { pathname: '/baselines' }, push: jest.fn() };
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <EditBaseline
                        history={ history }
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
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
        props.baselineData = editBaselineFixtures.mockBaselineData1;
        props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <EditBaseline { ...props }/>
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
        props.baselineData = editBaselineFixtures.mockBaselineData1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <EditBaseline { ...props }/>
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
        props.baselineData = editBaselineFixtures.mockBaselineData1;
        props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <EditBaseline { ...props }/>
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
        props.baselineData = editBaselineFixtures.mockBaselineData1;
        props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <EditBaseline { ...props }/>
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
        props.baselineData = editBaselineFixtures.mockBaselineData1;
        props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        const facts = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <EditBaseline { ...props }/>
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
        props.baselineData = editBaselineFixtures.mockBaselineData1;
        props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        const facts = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <EditBaseline { ...props }/>
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
        props.baselineData = editBaselineFixtures.mockBaselineData1;
        props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        props.expandedRows = [ 'The Fellowship of the Ring' ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <PermissionContext.Provider value={ value }>
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <EditBaseline { ...props }/>
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
        props.baselineData = editBaselineFixtures.mockBaselineData1;
        props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        props.expandedRows = [ 'The Fellowship of the Ring' ];

        const wrapper = shallow(
            <EditBaseline { ...props }/>
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
    });*/

    it.skip('should render toggle edit name modal', () => {
        //props.baselineData = editBaselineFixtures.mockBaselineData1;
        //const clearErrorData = jest.fn();
        //initialState.editBaselineState.baselineData = editBaselineFixtures.mockBaselineData1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <EditBaseline { ...props }/>
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('[className="pointer not-active edit-icon-margin"]').at(1).simulate('click');
        wrapper.update();
        expect(wrapper.instance().state.modalOpened).toBe(true);
    });
});
