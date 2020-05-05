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

            expect(wrapper.state('badgeCount')).toBe(1);
            wrapper.setProps({ selectedHSPIds: []});
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
});
/*eslint-enable camelcase*/
