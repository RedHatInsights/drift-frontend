import React from 'react';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedDriftFilterChips, { DriftFilterChips } from '../DriftFilterChips';
import stateFilters from '../../../modules/__tests__/state-filter.fixtures';

describe('DriftFilterChips', () => {
    it('should render correctly', () =>{
        const props = {
            stateFilters: [],
            factFilter: '' };
        const wrapper = shallow(
            <DriftFilterChips { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ConnectedDriftFilterChips', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            compareState: {
                stateFilters: [],
                factFilter: ''
            }
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <Provider store={ store }>
                <ConnectedDriftFilterChips />
            </Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render all states true', () => {
        initialState.compareState.factFilter = 'something';
        initialState.compareState.stateFilters = stateFilters.allStatesTrue;
        const store = mockStore(initialState);
        const wrapper = mount(
            <Provider store={ store }>
                <ConnectedDriftFilterChips />
            </Provider>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update stateFilter', () => {
        initialState.compareState.stateFilters = stateFilters.allStatesTrue;
        const store = mockStore(initialState);
        const wrapper = mount(
            <Provider store={ store }>
                <ConnectedDriftFilterChips />
            </Provider>
        );
        wrapper.find('.pf-c-button').first().simulate('click');

        expect(store.getState().compareState.stateFilters).toEqual(stateFilters.sameStateFalse);
    });
});
