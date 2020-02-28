import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedHistoricalProfilesDropdown, { HistoricalProfilesDropdown } from '../HistoricalProfilesDropdown';

describe('HistoricalProfilesDropdown', () => {
    let props;

    beforeEach(() => {
        props = {
            selectedHSPIds: [],
            selectedBaselineIds: []
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
