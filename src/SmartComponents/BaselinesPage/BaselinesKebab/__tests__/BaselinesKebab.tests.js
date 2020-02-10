import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedBaselinesKebab, { BaselinesKebab } from '../BaselinesKebab';

describe('BaselinesKebab', () => {
    let props;

    beforeEach(() => {
        props = {
            selectedBaselineIds: []
        };
    });

    it('should render correctly', () =>{
        const wrapper = shallow(
            <BaselinesKebab { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render kebabOpened', () =>{
        const wrapper = shallow(
            <BaselinesKebab { ...props }/>
        );
        wrapper.instance().toggleKebab();
        expect(wrapper.state('kebabOpened')).toEqual(true);
    });

    it('should render modalOpened', () =>{
        const wrapper = shallow(
            <BaselinesKebab { ...props }/>
        );
        wrapper.instance().toggleModalOpened();
        expect(wrapper.state('modalOpened')).toEqual(true);
    });
});

describe('ConnectedBaselinesKebab', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
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
                    <ConnectedBaselinesKebab />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
