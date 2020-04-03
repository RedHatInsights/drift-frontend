import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import { DropdownDirection } from '@patternfly/react-core';
import ConnectedHistoricalProfilesDropdown, { HistoricalProfilesDropdown } from '../HistoricalProfilesDropdown';

describe('HistoricalProfilesDropdown', () => {
    let props;

    beforeEach(() => {
        props = {
            selectedHSPIds: [],
            selectedBaselineIds: [],
            dropdownDirection: DropdownDirection.down
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
    });
});

describe('ConnectedHistoricalProfilesDropdown', () => {
    let initialState;
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
});
