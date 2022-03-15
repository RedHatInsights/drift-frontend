import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';
import baselinesTableFixtures from '../redux/__tests__/baselinesTableReducer.fixtures';
import baselinesReducerHelpers from '../redux/helpers';

import ConnectedBaselinesTable, { BaselinesTable } from '../BaselinesTable';
import { PermissionContext } from '../../../App';
import { sortable } from '@patternfly/react-table';

jest.mock('../redux', () => ({
    baselinesTableActions: {
        fetchBaselines: jest.fn(()=> ({ type: 'null' }))
    }
}));

describe('BaselinesTable', () => {
    let props;
    let value;

    beforeEach(() => {
        props = {
            loading: false,
            tableData: baselinesTableFixtures.baselineTableDataRows,
            tableId: 'CHECKBOX',
            hasMultiSelect: true,
            kebab: true,
            createButton: true,
            exportButton: true,
            columns: [
                { title: 'Name', transforms: [ sortable ]},
                { title: 'Last updated', transforms: [ sortable ]},
                { title: 'Associated systems' },
                { title: '' }
            ],
            selectedBaselineIds: [],
            permissions: {
                baselinesRead: true,
                baselinesWrite: true
            },
            basketIsVisible: false,
            totalBaselines: 2,
            selectBaseline: jest.fn(),
            fetchBaselines: jest.fn(),
            bulkSelectItems: jest.fn()
        };

        value = {
            permissions: {
                compareRead: true,
                baselinesRead: true,
                baselinesWrite: true
            }
        };
    });

    it('should call page onBulkSelect with isSelected true', async () => {
        props.tableData = [
            [ '1234', 'baseline 1', '1 month ago' ],
            [ '5678', 'baseline 2', '2 months ago' ]
        ];

        const wrapper = shallow(
            <PermissionContext.Provider value={ value }>
                <BaselinesTable
                    { ...props }
                />
            </PermissionContext.Provider>
        );

        wrapper.find(BaselinesTable).dive().instance().onBulkSelect('page');
        expect(props.selectBaseline).toHaveBeenCalledWith([ '1234', '5678' ], true, 'CHECKBOX');
    });

    it('should call page onBulkSelect with isSelected false', async () => {
        props.tableData = [
            [ '1234', 'baseline 1', '1 month ago' ],
            [ '5678', 'baseline 2', '2 months ago' ]
        ];
        props.tableData.forEach(baseline => baseline.selected = true);
        props.selectedBaselineIds = [ '1234', '5678' ];

        const wrapper = shallow(
            <PermissionContext.Provider value={ value }>
                <BaselinesTable
                    { ...props }
                />
            </PermissionContext.Provider>
        );

        wrapper.find(BaselinesTable).dive().instance().onBulkSelect('page');
        expect(props.selectBaseline).toHaveBeenCalledWith([ '1234', '5678' ], false, 'CHECKBOX');
    });

    it('should call page onBulkSelect with isSelected true', async () => {
        props.baselineTableData = [
            [ '1234', 'baseline 1', '1 month ago' ],
            [ '5678', 'baseline 2', '2 months ago' ]
        ];

        const wrapper = shallow(
            <PermissionContext.Provider value={ value }>
                <BaselinesTable
                    { ...props }
                />
            </PermissionContext.Provider>
        );

        await wrapper.find(BaselinesTable).dive().instance().onBulkSelect('page');
        expect(props.selectBaseline).toHaveBeenCalledWith([ '1234', 'abcd' ], true, 'CHECKBOX');
    });

    it('should call none onBulkSelect with isSelected false', async () => {
        props.baselineTableData = [
            [ '1234', 'baseline 1', '1 month ago' ],
            [ '5678', 'baseline 2', '2 months ago' ]
        ];
        props.selectedBaselineIds = [ '1234' ];

        const wrapper = shallow(
            <PermissionContext.Provider value={ value }>
                <BaselinesTable
                    { ...props }
                />
            </PermissionContext.Provider>
        );

        await wrapper.find(BaselinesTable).dive().instance().onBulkSelect('none');
        expect(props.selectBaseline).toHaveBeenCalledWith([ '1234' ], false, 'CHECKBOX');
    });
});

describe('ConnectedBaselinesTable', () => {
    let initialState;
    let mockStore;
    let props;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            addSystemModalState: {
                addSystemModalOpened: false
            },
            baselinesTableState: {
                checkboxTable: {
                    baselineTableData: baselinesTableFixtures.baselineTableDataRows,
                    selectedBaselineIds: [ '1234' ]
                }
            },
            editBaselineState: {
                notificationsSwitchError: {}
            }
        };

        props = {
            loading: false,
            tableData: baselinesTableFixtures.baselineTableDataRows,
            tableId: 'CHECKBOX',
            hasMultiSelect: true,
            kebab: true,
            createButton: true,
            exportButton: true,
            columns: [
                { title: 'Name', transforms: [ sortable ]},
                { title: 'Last updated', transforms: [ sortable ]},
                { title: 'Associated systems' },
                { title: '' }
            ],
            selectedBaselineIds: [],
            permissions: {
                baselinesRead: true,
                baselinesWrite: true
            },
            basketIsVisible: false,
            totalBaselines: 2,
            selectBaseline: jest.fn(),
            bulkSelectItems: jest.fn()
        };
    });

    it('should render no table kebabs with no write permissions', () => {
        props.permissions.baselinesWrite = false;
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedBaselinesTable
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
        expect(wrapper.find('BaselineTableKebab')).toHaveLength(0);
    });

    it('should render no pagination in add system modal with no read permissions', () => {
        props.permissions.baselinesRead = false;
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedBaselinesTable
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find('TablePagination').at(0).prop('total')).toBe(0);
        expect(wrapper.find('TablePagination').at(1).prop('total')).toBe(0);
    });

    it('should render multi-select table', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedBaselinesTable
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it.skip('should render single-select table', () => {
        const store = mockStore(initialState);
        props.hasMultiSelect = false;
        props.tableId = 'RADIO';
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedBaselinesTable
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render no matching baselines', () => {
        const store = mockStore(initialState);
        props.tableData = [];
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedBaselinesTable
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading rows for multi-select', () => {
        const store = mockStore(initialState);
        props.loading = true;
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedBaselinesTable
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading rows for single-select', () => {
        const store = mockStore(initialState);
        props.loading = true;
        props.hasMultiSelect = false;
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedBaselinesTable
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render baseline selected', () => {
        const store = mockStore(initialState);
        props.tableData[0].selected = true;
        props.selectedBaselineIds = [ '1234' ];
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedBaselinesTable
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled when selected basket is visible', () => {
        const store = mockStore(initialState);
        props.tableData[0].selected = true;
        props.basketIsVisible = true;
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedBaselinesTable
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should sort by display_name', () => {
        const store = mockStore(initialState);
        baselinesReducerHelpers.returnParams = jest.fn();
        props.selectedBaselineIds = [ '1234' ];
        const onSelect = jest.fn();
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedBaselinesTable
                        { ...props }
                        onSelect={ onSelect }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-table__button').at(0).simulate('click');
        expect(baselinesReducerHelpers.returnParams).toHaveBeenCalledWith(
            {
                orderBy: 'display_name',
                orderHow: 'DESC',
                page: 1,
                perPage: 20,
                search: undefined,
                sortBy: {
                    direction: 'asc',
                    index: 1
                }
            }
        );

        wrapper.find('.pf-c-table__button').at(0).simulate('click');
        expect(baselinesReducerHelpers.returnParams).toHaveBeenCalledWith(
            {
                orderBy: 'display_name',
                orderHow: 'ASC',
                page: 1,
                perPage: 20,
                search: undefined,
                sortBy: {
                    direction: 'desc',
                    index: 1
                }
            }
        );
    });

    it.skip('should call clearSort', () => {
        const store = mockStore(initialState);
        props.selectedBaselineIds = [ '1234' ];

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedBaselinesTable
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-button').at(3).simulate('click');
        wrapper.find('.pf-c-dropdown__toggle').at(1).simulate('click');
        wrapper.find('.pf-c-dropdown__menu-item').at(1).simulate('click');

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
