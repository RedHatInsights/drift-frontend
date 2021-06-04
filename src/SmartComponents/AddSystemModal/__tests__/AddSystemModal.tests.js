/*eslint-disable camelcase*/
import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedAddSystemModal, { AddSystemModal } from '../AddSystemModal';
import { compareReducerPayload, systemsPayload, baselinesPayload,
    historicalProfilesPayload } from '../../modules/__tests__/reducer.fixtures';
import modalFixtures from '../redux/__tests__/addSystemModalReducer.fixtures';

import { createMiddlewareListener } from '../../../store';

const middlewareListener = createMiddlewareListener();
middlewareListener.getMiddleware();

describe('AddSystemModal', () => {
    let props;

    beforeEach(() => {
        props = {
            addSystemModalOpened: true,
            systems: [],
            activeTab: 0,
            entities: { selectedSystemIds: []},
            selectedBaselineIds: [],
            baselines: [],
            selectedHSPIds: [],
            loading: false,
            baselineTableData: [],
            historicalProfiles: [],
            permissions: {
                hspRead: true,
                inventoryRead: true
            },
            referenceId: undefined,
            selectedBaselineContent: [],
            selectedHSPContent: [],
            selectedSystemContent: [],
            selectActiveTab: jest.fn(),
            disableSystemTable: jest.fn(),
            confirmModal: jest.fn(),
            toggleAddSystemModal: jest.fn(),
            handleBaselineSelection: jest.fn(),
            handleHSPSelection: jest.fn(),
            handleSystemSelection: jest.fn(),
            selectHistoricProfiles: jest.fn(),
            selectBaseline: jest.fn()
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <AddSystemModal
                { ...props }
            />
        );

        expect(wrapper.state('basketIsVisible')).toEqual(false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should toggle basket visible', () => {
        const wrapper = shallow(
            <AddSystemModal
                { ...props }
            />
        );

        wrapper.instance().toggleBasketVisible();

        expect(wrapper.state('basketIsVisible')).toEqual(true);
        expect(props.disableSystemTable).toHaveBeenCalledWith(true);
    });

    it('should handle baseline selection', () => {
        const event = { currentTarget: {}};
        const selectBaseline = jest.fn();

        props.baselineTableData = [
            [ 'abcd1234', 'baseline1', '1 month ago' ],
            [ 'efgh5678', 'baseline2', '2 months ago' ]
        ];
        const wrapper = shallow(
            <AddSystemModal
                { ...props }
                selectBaseline={ selectBaseline }
            />
        );

        wrapper.instance().onSelect(event, true, 0);
        expect(selectBaseline).toHaveBeenCalledWith([ 'abcd1234' ], true, 'COMPARISON');
        expect(props.handleBaselineSelection).toHaveBeenCalledWith(modalFixtures.baselineContent1, true);
    });

    it('should handle bulk baseline selection', () => {
        const event = { currentTarget: {}};
        const selectBaseline = jest.fn();

        props.baselineTableData = [
            [ 'abcd1234', 'baseline1', '1 month ago' ],
            [ 'efgh5678', 'baseline2', '2 months ago' ]
        ];
        const wrapper = shallow(
            <AddSystemModal
                { ...props }
                selectBaseline={ selectBaseline }
            />
        );

        wrapper.instance().onSelect(event, true, -1);
        expect(selectBaseline).toHaveBeenCalledWith([ 'abcd1234', 'efgh5678' ], true, 'COMPARISON');
        expect(props.handleBaselineSelection).toHaveBeenCalledWith(modalFixtures.baselineContent2, true);
    });

    it('should handle onBulkSelect', () => {
        const selectBaseline = jest.fn();

        props.baselineTableData = [
            [ 'abcd1234', 'baseline1', '1 month ago' ],
            [ 'efgh5678', 'baseline2', '2 months ago' ]
        ];
        const wrapper = shallow(
            <AddSystemModal
                { ...props }
                selectBaseline={ selectBaseline }
            />
        );

        wrapper.instance().onBulkSelect(true);
        expect(selectBaseline).toHaveBeenCalledWith([ 'abcd1234', 'efgh5678' ], true, 'COMPARISON');
        expect(props.handleBaselineSelection).toHaveBeenCalledWith(modalFixtures.baselineContent2, true);
    });

    it('should update system basket', () => {
        const wrapper = shallow(
            <AddSystemModal
                { ...props }
            />
        );

        let prevProps = props;

        wrapper.setProps({
            baselines: baselinesPayload,
            systems: systemsPayload,
            historicalProfiles: historicalProfilesPayload
        });
        wrapper.instance().componentDidUpdate(prevProps);
        expect(props.handleSystemSelection).toHaveBeenCalledWith(modalFixtures.systemContent1, true);
        expect(props.handleBaselineSelection).toHaveBeenCalledWith(modalFixtures.baselineContent3, true);
        expect(props.handleHSPSelection).toHaveBeenCalledWith(modalFixtures.hspContent1);
        expect(props.handleHSPSelection).toHaveBeenCalledWith(modalFixtures.hspContent2);
    });

    it('should confirm modal', () => {
        props.entities.selectedSystemIds = [ 'abcd1234' ];
        props.selectedBaselineIds = [ 'efgh5678' ];
        props.selectedHSPIds = [ 'ijkl9010' ];
        props.referenceId = 'efgh5678';

        const wrapper = shallow(
            <AddSystemModal
                { ...props }
            />
        );

        wrapper.instance().confirmModal();
        expect(props.confirmModal).toHaveBeenCalledWith(
            [ 'abcd1234' ], [ 'efgh5678' ], [ 'ijkl9010' ], 'efgh5678'
        );
        expect(props.toggleAddSystemModal).toHaveBeenCalled();
    });

    it('should cancel selection', () => {
        const wrapper = shallow(
            <AddSystemModal
                { ...props }
            />
        );

        wrapper.instance().cancelSelection();
        expect(props.handleSystemSelection).toHaveBeenCalled();
        expect(props.handleBaselineSelection).toHaveBeenCalled();
        expect(props.selectHistoricProfiles).toHaveBeenCalled();
        expect(props.toggleAddSystemModal).toHaveBeenCalled();
    });

    it('should change active tab to 1', () => {
        const event = { currentTarget: {}};
        const wrapper = shallow(
            <AddSystemModal
                { ...props }
            />
        );

        wrapper.instance().changeActiveTab(event, 1);
        expect(props.selectActiveTab).toHaveBeenCalledWith(1);
    });

    it('should select 1 for systemContent', () => {
        props.entities.rows = modalFixtures.rows;
        const wrapper = shallow(
            <AddSystemModal
                { ...props }
            />
        );

        wrapper.instance().systemContentSelect(modalFixtures.data1);
        expect(props.handleSystemSelection).toHaveBeenCalledWith(modalFixtures.systemContent2, modalFixtures.data1.selected);
    });

    it('should select all for systemContent', () => {
        props.entities.rows = modalFixtures.rows;
        const wrapper = shallow(
            <AddSystemModal
                { ...props }
            />
        );

        wrapper.instance().systemContentSelect(modalFixtures.data2);
        expect(props.handleSystemSelection).toHaveBeenCalledWith(modalFixtures.systemContent1, modalFixtures.data2.selected);
    });

    it('should deselect for systemContent', () => {
        props.selectedSystemContent = modalFixtures.systemContent1;
        const wrapper = shallow(
            <AddSystemModal
                { ...props }
            />
        );

        wrapper.instance().systemContentSelect(modalFixtures.data3);
        expect(props.handleSystemSelection).toHaveBeenCalledWith([ modalFixtures.systemContent1[0] ], modalFixtures.data3.selected);
    });

    it('should remove contents from basket that are not compared', () => {
        props.baselines = modalFixtures.baselines1;
        props.historicalProfiles = modalFixtures.historicalProfiles1;
        props.systems = modalFixtures.systems1;
        props.selectedBaselineContent = modalFixtures.baselineContent2;
        props.selectedHSPContent = modalFixtures.hspContent3;
        props.selectedSystemContent = modalFixtures.systemContent1;
        const wrapper = shallow(
            <AddSystemModal
                { ...props }
            />
        );

        wrapper.instance().setSelectedContent();
        expect(props.handleSystemSelection).toHaveBeenCalledWith(modalFixtures.systemContent3, false);
    });
});

describe('ConnectedAddSystemModal', () => {
    let initialState;
    let mockStore;
    let props;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            addSystemModalState: {
                addSystemModalOpened: true,
                activeTab: 0,
                selectedSystemIds: [],
                selectedBaselineContent: [],
                selectedHSPContent: [],
                selectedSystemContent: []
            },
            compareState: {
                systems: compareReducerPayload.systems,
                baselines: [],
                historicalProfiles: []
            },
            baselinesTableState: {
                comparisonTable: {
                    selectedBaselineIds: [],
                    loading: false,
                    baselineTableData: []
                },
                checkboxTable: {
                    totalBaselines: 0
                }
            },
            historicProfilesState: {
                selectedHSPIds: []
            },
            entities: {
                selectedSystemIds: [],
                rows: modalFixtures.rows
            },
            addSystemModalActions: {
                toggleAddSystemModal: jest.fn()
            },
            globalFilterState: {
                sidsFilter: [],
                tagsFilter: [],
                workloadsFilter: {}
            }
        };

        props = {
            permissions: {
                hspRead: true,
                inventoryRead: true
            },
            selectedSystemIds: [],
            selectedBaselineIds: [],
            selectedHSPIds: []
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render hasHistoricalDropdown false with no hsp read permissions', () => {
        const store = mockStore(initialState);
        props.permissions.hspRead = false;

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find('SystemsTable').prop('hasHistoricalDropdown')).toBe(false);
    });

    it('should render disabled with no inventory permissions', () => {
        const store = mockStore(initialState);
        props.permissions.inventoryRead = false;

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render submit button disabled', () => {
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find('.pf-c-button').at(1).prop('disabled')).toBe(true);
    });

    it('should render baselines correctly', () => {
        initialState.addSystemModalState.activeTab = 1;
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render GlobalFilterAlert', () => {
        initialState.globalFilterState.workloadsFilter = {
            SAP: {
                group: {
                    name: 'Workloads'
                },
                item: {
                    value: 'SAP'
                }
            }
        };

        initialState.globalFilterState.sidsFilter = [ 'AB1', 'XY1' ];
        initialState.globalFilterState.tagsFilter = [
            'patch/rest=patchman-engine', 'patch/dev=patchman-engine', 'insights-client/group=XmygroupX'
        ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find('.pf-c-alert__description').text()).toBe(
            'Workloads: SAP. SAP ID (SID): AB1, XY1. Tags: patch: rest=patchman-engine, dev=patchman-engine. insights-client: group=XmygroupX. '
        );
    });

    it.skip('should confirm modal with one system selected', () => {
        const confirmModal = jest.fn();
        initialState.entities.selectedSystemIds = [ 'abcd1234' ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal
                        confirmModal={ confirmModal }
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-button').at(1).simulate('click');
        expect(confirmModal).toHaveBeenCalledTimes(1);
    });

    it.skip('should confirm modal with one baseline selected', () => {
        const confirmModal = jest.fn();
        initialState.baselinesTableState.comparisonTable.baselineTableData = [
            [ 'abcd1234', 'baseline1', '1 month ago' ],
            [ 'efgh5678', 'baseline2', '2 months ago' ]
        ];

        initialState.baselinesTableState.comparisonTable.baselineTableData[0].selected = true;
        initialState.baselinesTableState.comparisonTable.selectedBaselineIds = [ 'abcd1234' ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal
                        confirmModal={ confirmModal }
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-button').at(1).simulate('click');
        expect(confirmModal).toHaveBeenCalledTimes(1);
    });

    it.skip('should confirm modal with one HSP selected', () => {
        const confirmModal = jest.fn();
        initialState.historicProfilesState.selectedHSPIds = [ 'abcd1234' ];
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal
                        confirmModal={ confirmModal }
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-button').at(1).simulate('click');
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
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-tabs__button').at(4).simulate('click');
        expect(selectActiveTab).toHaveBeenCalled();
    });

    it.skip('should toggle modal', () => {
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-button.pf-m-plain').at(0).simulate('click');
        expect(props.toggleAddSystemModal).toHaveBeenCalledTimes(1);
    });

    it.skip('should cancel modal', () => {
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedAddSystemModal
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-button.pf-m-link').simulate('click');
        expect(initialState.addSystemModalActions.toggleAddSystemModal).toHaveBeenCalled();
    });
});
/*eslint-enable camelcase*/
