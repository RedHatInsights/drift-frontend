import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';
import helpersFixtures from './helpers.fixtures';

import editBaselineFixtures from './helpers.fixtures';
import ConnectedEditBaseline, { EditBaseline } from '../EditBaseline';
import api from '../../../../api';

describe('EditBaseline', () => {
    let props;

    beforeEach(() => {
        props = {
            baselineData: [],
            baselineDataLoading: false,
            factModalOpened: false,
            editBaselineTableData: [],
            expandedRows: [],
            selectAll: false,
            editBaselineError: {},
            match: { params: {}},
            history: { push: jest.fn() },
            fetchBaselineData: jest.fn()
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <EditBaseline { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render error correctly', () => {
        props.editBaselineError = { status: 404 };
        const wrapper = shallow(
            <EditBaseline { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call clearBaselineData on Breadcrumb click', () => {
        const clearBaselineData = jest.fn();
        const wrapper = shallow(
            <EditBaseline { ...props } clearBaselineData={ clearBaselineData } />
        );

        wrapper.find('a').simulate('click');
        expect(clearBaselineData).toHaveBeenCalledTimes(1);
    });

    it('should render loading rows', () => {
        props.baselineData = undefined;
        const wrapper = shallow(
            <EditBaseline { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render expandable rows closed', () => {
        props.editBaselineTableData = helpersFixtures.mockBaselineTableData1;
        props.baselineData = helpersFixtures.mockBaselineAPIBody;
        const wrapper = shallow(
            <EditBaseline { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render expandable rows opened', () => {
        props.editBaselineTableData = helpersFixtures.mockBaselineTableData1;
        props.baselineData = helpersFixtures.mockBaselineAPIBody;
        props.expandedRows = [ 'The Fellowship of the Ring' ];
        const wrapper = shallow(
            <EditBaseline { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with baseline facts', () => {
        props.baselineData = editBaselineFixtures.mockBaselineData1;
        props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;

        const wrapper = shallow(
            <EditBaseline { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should call clearBaselineData', () => {
            const clearBaselineData = jest.fn();
            const history = { location: { pathname: '/baselines' }, push: jest.fn() };
            const wrapper = shallow(
                <EditBaseline
                    { ...props }
                    clearBaselineData={ clearBaselineData }
                    history={ history }
                />
            );

            wrapper.find('a').simulate('click');
            expect(clearBaselineData).toHaveBeenCalled();
        });

        it('should render row expanded', () => {
            props.baselineData = editBaselineFixtures.mockBaselineData1;
            props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
            props.expandedRows = [ 'The Fellowship of the Ring' ];

            const wrapper = shallow(
                <EditBaseline { ...props } />
            );

            expect(wrapper.find('AngleDownIcon').exists()).toBeTruthy();
        });

        it('should select single fact', () => {
            const event = { target: { name: 0 }};
            const isSelected = true;
            props.baselineData = editBaselineFixtures.mockBaselineData1;
            props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
            const selectFact = jest.fn();

            const wrapper = shallow(
                <EditBaseline
                    { ...props }
                    selectFact={ selectFact }
                />
            );

            wrapper.find('Checkbox').at(1).simulate('change', isSelected, event);
            expect(selectFact).toBeCalledWith([ 0 ], true);
        });

        it('should deselect single fact', () => {
            const event = { target: { name: 0 }};
            const isSelected = false;
            props.baselineData = editBaselineFixtures.mockBaselineData1;
            props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
            const selectFact = jest.fn();

            const wrapper = shallow(
                <EditBaseline
                    { ...props }
                    selectFact={ selectFact }
                />
            );

            wrapper.find('Checkbox').at(1).simulate('change', isSelected, event);
            expect(selectFact).toBeCalledWith([ 0 ], false);
        });

        it('should select all sub facts', () => {
            const event = { target: { name: 2 }};
            const isSelected = true;
            props.baselineData = editBaselineFixtures.mockBaselineData1;
            props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
            const selectFact = jest.fn();
            const facts = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];

            const wrapper = shallow(
                <EditBaseline
                    { ...props }
                    selectFact={ selectFact }
                />
            );

            wrapper.find('Checkbox').at(2).simulate('change', isSelected, event);
            expect(selectFact).toBeCalledWith(facts, true);
        });

        it('should deselect all sub facts', () => {
            const event = { target: { name: 2 }};
            const isSelected = false;
            props.baselineData = editBaselineFixtures.mockBaselineData1;
            props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
            const selectFact = jest.fn();
            const facts = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];

            const wrapper = shallow(
                <EditBaseline
                    { ...props }
                    selectFact={ selectFact }
                />
            );

            wrapper.find('Checkbox').at(2).simulate('change', isSelected, event);
            expect(selectFact).toBeCalledWith(facts, false);
        });

        it('should select sub fact', () => {
            const event = { target: { name: 3 }};
            const isSelected = true;
            props.baselineData = editBaselineFixtures.mockBaselineData1;
            props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
            props.expandedRows = [ 'The Fellowship of the Ring' ];
            const selectFact = jest.fn();

            const wrapper = shallow(
                <EditBaseline
                    { ...props }
                    selectFact={ selectFact }
                />
            );

            wrapper.find('Checkbox').at(4).simulate('change', isSelected, event);
            expect(selectFact).toBeCalledWith([ 3 ], true);
        });

        it('should deselect sub fact', () => {
            const event = { target: { name: 3 }};
            const isSelected = false;
            props.baselineData = editBaselineFixtures.mockBaselineData1;
            props.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
            props.expandedRows = [ 'The Fellowship of the Ring' ];
            const selectFact = jest.fn();

            const wrapper = shallow(
                <EditBaseline
                    { ...props }
                    selectFact={ selectFact }
                />
            );

            wrapper.find('Checkbox').at(4).simulate('change', isSelected, event);
            expect(selectFact).toBeCalledWith([ 3 ], false);
        });

        it('should render toggle edit name modal', () => {
            props.baselineData = editBaselineFixtures.mockBaselineData1;
            const clearErrorData = jest.fn();

            const wrapper = shallow(
                <EditBaseline
                    { ...props }
                    clearErrorData={ clearErrorData }
                />
            );

            wrapper.find('[className="pointer not-active edit-icon-margin"]').simulate('click');
            expect(clearErrorData).toHaveBeenCalled();
        });
    });
});

describe('ConnectedEditBaseline', () => {
    let initialState;
    let mockStore;

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
            onBulkSelect: jest.fn()
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedEditBaseline />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading rows', () => {
        initialState.editBaselineState.baselineData = undefined;
        initialState.editBaselineState.baselineDataLoading = true;
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedEditBaseline />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call clearBaselineData', () => {
        const store = mockStore(initialState);
        const history = { location: { pathname: '/baselines' }, push: jest.fn() };
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedEditBaseline
                        history={ history }
                    />
                </Provider>
            </MemoryRouter>
        );

        const actions = store.getActions();
        wrapper.find('a').simulate('click');
        expect(actions).toEqual([
            { type: 'FETCH_BASELINE_DATA', payload: api.getBaselineData('blah') },
            { type: 'CLEAR_BASELINE_DATA_CHECKBOX' }
        ]);
    });

    it('should call expandRow', () => {
        initialState.editBaselineState.baselineData = editBaselineFixtures.mockBaselineData1;
        initialState.editBaselineState.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedEditBaseline />
                </Provider>
            </MemoryRouter>
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
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedEditBaseline />
                </Provider>
            </MemoryRouter>
        );

        const actions = store.getActions();
        wrapper.find('EditAltIcon').simulate('click');
        expect(actions).toEqual([
            { type: 'FETCH_BASELINE_DATA', payload: api.getBaselineData('blah') },
            { type: 'CLEAR_ERROR_DATA' }
        ]);
    });

    it.skip('should call selectFact', () => {
        const event = { target: { name: 0 }};
        const isSelected = true;
        initialState.editBaselineState.baselineData = editBaselineFixtures.mockBaselineData1;
        initialState.editBaselineState.editBaselineTableData = editBaselineFixtures.mockBaselineTableData1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedEditBaseline />
                </Provider>
            </MemoryRouter>
        );

        const actions = store.getActions();
        wrapper.find('[id="fact-0"]').at(1).simulate('change', isSelected, event);
        expect(actions).toEqual([
            { type: 'FETCH_BASELINE_DATA', payload: api.getBaselineData('blah') },
            { type: 'SELECT_FACT', payload: { ids: [ 0 ], isSelected: true }}
        ]);
    });
});
