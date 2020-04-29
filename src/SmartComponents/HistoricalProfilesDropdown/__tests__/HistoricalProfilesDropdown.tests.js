import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import api from '../../../api';
import fixtures from './fixtures';
import { DropdownDirection } from '@patternfly/react-core';
import ConnectedHistoricalProfilesDropdown, { HistoricalProfilesDropdown } from '../HistoricalProfilesDropdown';

/*eslint-disable camelcase*/
describe('HistoricalProfilesDropdown', () => {
    let props;

    beforeEach(() => {
        props = {
            selectedHSPIds: [],
            selectedBaselineIds: [],
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

    it('should render correctly', () => {
        const wrapper = shallow(
            <HistoricalProfilesDropdown { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render mount correctly', () => {
        const wrapper = mount(
            <HistoricalProfilesDropdown { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should render DropdownDirection.up', () => {
            props.dropdownDirection = DropdownDirection.up;
            const wrapper = shallow(
                <HistoricalProfilesDropdown { ...props }/>
            );
            expect(wrapper.find('Dropdown').prop('direction')).toBe('up');
        });

        it('should set badgeCount to 0', () => {
            props.selectedHSPIds = [ 'abcd1234' ];
            props.badgeCount = 1;

            const wrapper = shallow(
                <HistoricalProfilesDropdown { ...props }/>
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

describe('ConnectedHistoricalProfilesDropdown', () => {
    let initialState;
    let props;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            historicProfilesState: {
                selectedHSPIds: []
            },
            baselinesTableState: {
                checkboxTable: {
                    selectedBaselineIds: []
                }
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

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedHistoricalProfilesDropdown />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should toggle dropdown menu', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedHistoricalProfilesDropdown { ...props } />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-dropdown__toggle').simulate('click');
        expect(wrapper.find('DropdownToggle').prop('isOpen')).toBe(true);
    });

    it('should set historical data', () => {
        const store = mockStore(initialState);
        api.fetchHistoricalData = jest.fn();
        api.fetchHistoricalData
        .mockReturnValue(
            fixtures.historicalData
        );
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedHistoricalProfilesDropdown
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-dropdown__toggle').simulate('click');
        expect(api.fetchHistoricalData).toHaveBeenCalled();
    });

    it('should set error', async () => {
        const store = mockStore(initialState);
        api.fetchHistoricalData = jest.fn();
        api.fetchHistoricalData
        .mockReturnValue(
            fixtures.hspReturnedError
        );
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedHistoricalProfilesDropdown
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-dropdown__toggle').simulate('click');
        wrapper.update();
        expect(api.fetchHistoricalData.mock.results[0].value.status).toBe(400);
        expect(api.fetchHistoricalData.mock.results[0].value.data.message).toBe('This is an error message');
    });

    it('should call fetchCompare', async () => {
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
                    <ConnectedHistoricalProfilesDropdown
                        { ...props }
                        fetchCompare={ fetchCompare }
                    />
                </Provider>
            </MemoryRouter>
        );

        await wrapper.find('.pf-c-dropdown__toggle').simulate('click');
        wrapper.update();
        wrapper.find('.pf-c-button').simulate('click');
        expect(fetchCompare).toHaveBeenCalled();
    });

    it('should retry fetch', async () => {
        const store = mockStore(initialState);
        api.fetchHistoricalData = jest.fn();
        api.fetchHistoricalData
        .mockReturnValue(
            fixtures.hspReturnedError
        );
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedHistoricalProfilesDropdown
                        { ...props }
                    />
                </Provider>
            </MemoryRouter>
        );

        await wrapper.find('.pf-c-dropdown__toggle').simulate('click');
        wrapper.update();
        await wrapper.find('a').simulate('click');
        expect(api.fetchHistoricalData).toHaveBeenCalledTimes(2);
    });
});
/*eslint-enable camelcase*/
