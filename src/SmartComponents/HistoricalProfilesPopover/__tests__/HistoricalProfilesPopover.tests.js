import React from 'react';
import { shallow, mount } from 'enzyme';
//import { MemoryRouter } from 'react-router-dom';
//import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

//import api from '../../../api';
//import fixtures from './fixtures';
import { init } from '../../../store';
import { DropdownDirection } from '@patternfly/react-core';
import HistoricalProfilesPopover from '../HistoricalProfilesPopover';

jest.mock('../../../api');

/*eslint-disable camelcase*/
describe('HistoricalProfilesPopover', () => {
    let props;
    let { registry } = init();
    const store = registry.getStore();

    beforeEach(() => {
        props = {
            systemIds: [],
            selectedHSPIds: [],
            selectedBaselineIds: [],
            referenceId: undefined,
            dropdownDirection: DropdownDirection.down,
            hasBadge: true,
            hasCompareButton: false,
            badgeCount: 0,
            system: {
                id: '4416c520-a339-4dde-b303-f317ea9efc5f',
                last_updated: '2020-05-04T18:33:12.249348+00:00'
            },
            fetchCompare: jest.fn()
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <Provider store={ store }>
                <HistoricalProfilesPopover { ...props }/>
            </Provider>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render mount correctly', () => {
        const wrapper = mount(
            <Provider store={ store }>
                <HistoricalProfilesPopover { ...props }/>
            </Provider>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it.skip('should call fetchCompare correctly', () => {
        props.systemIds = [ 'abc' ];
        props.selectedHSPIds = [ '123' ];
        props.selectedBaselineIds = [ 'def' ];
        props.referenceId = 'def';
        const wrapper = mount(
            <Provider store={ store }>
                <HistoricalProfilesPopover { ...props }/>
            </Provider>
        );

        wrapper.instance().fetchCompare();
        expect(props.fetchCompare).toHaveBeenCalledWith(
            props.systemIds, props.selectedBaselineIds, props.selectedHSPIds, props.referenceId
        );
    });

    describe('API', () => {
        it.skip('should set badgeCount to 0', () => {
            props.selectedHSPIds = [ 'abcd1234' ];
            props.badgeCount = 1;

            const wrapper = shallow(
                <Provider store={ store }>
                    <HistoricalProfilesPopover { ...props }/>
                </Provider>
            );

            wrapper.setState({
                historicalData: {
                    profiles: [{
                        captured_date: '2020-07-28T01:15:24.100078+00:00',
                        id: 'abcd1234',
                        system_id: '1234abcd'
                    }]
                }
            });
            expect(wrapper.state('badgeCount')).toBe(1);
            wrapper.setProps({ selectedHSPIds: []});
            wrapper.instance().updateBadgeCount();
            expect(wrapper.state('badgeCount')).toBe(0);
        });
    });
});

/*describe('ConnectedHistoricalProfilesPopover', () => {
    let initialState;
    let props;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            historicProfilesState: {
                selectedHSPIds: []
            }
        };

        props = {
            dropdownDirection: DropdownDirection.down,
            hasBadge: true,
            hasCompareButton: false,
            badgeCount: 0,
            system: {
                id: '4416c520-a339-4dde-b303-f317ea9efc5f',
                last_updated: '2020-05-04T18:33:12.249348+00:00'
            }
        };
    });

    it.skip('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedHistoricalProfilesPopover />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it.skip('should toggle dropdown menu', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedHistoricalProfilesPopover { ...props } />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('HistoryIcon').simulate('click');
        expect(wrapper.find('Popover').prop('isVisible')).toBe(true);
    });

    it.skip('should set historical data', () => {
        const store = mockStore(initialState);
        api.fetchHistoricalData = jest.fn();
        api.fetchHistoricalData
        .mockReturnValue(
            fixtures.historicalData
        );
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedHistoricalProfilesPopover
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('HistoryIcon').simulate('click');
        expect(api.fetchHistoricalData).toHaveBeenCalled();
    });

    it.skip('should set error', async () => {
        const store = mockStore(initialState);
        api.fetchHistoricalData = jest.fn();
        api.fetchHistoricalData
        .mockReturnValue(
            fixtures.hspReturnedError
        );
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedHistoricalProfilesPopover
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('HistoryIcon').simulate('click');
        wrapper.update();
        expect(api.fetchHistoricalData.mock.results[0].value.status).toBe(400);
        expect(api.fetchHistoricalData.mock.results[0].value.data.message).toBe('This is an error message');
    });

    it.skip('should call fetchCompare', async () => {
        const store = mockStore(initialState);
        props.hasCompareButton = true;
        const fetchCompare = jest.fn();
        api.fetchHistoricalData = jest.fn();
        api.fetchHistoricalData
        .mockReturnValue(
            fixtures.historicalData
        );
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedHistoricalProfilesPopover
                        { ...props }
                        fetchCompare={ fetchCompare }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('HistoryIcon').simulate('click');
        wrapper.update();
        wrapper.find('Button').simulate('click');
        expect(fetchCompare).toHaveBeenCalled();
    });

    it.skip('should retry fetch', async () => {
        const store = mockStore(initialState);
        api.fetchHistoricalData = jest.fn();
        api.fetchHistoricalData
        .mockReturnValue(
            fixtures.hspReturnedError
        );
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedHistoricalProfilesPopover
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('HistoryIcon').simulate('click');
        wrapper.update();
        await wrapper.find('a').simulate('click');
        expect(api.fetchHistoricalData).toHaveBeenCalledTimes(2);
    });
});*/
/*eslint-enable camelcase*/
