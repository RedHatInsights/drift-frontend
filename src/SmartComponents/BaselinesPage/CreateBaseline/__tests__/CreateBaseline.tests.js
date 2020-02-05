import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedCreateBaseline, { CreateBaseline } from '../CreateBaseline';

describe('CreateBaseline', () => {
    let props;

    beforeEach(() => {
        props = {
            baselineName: 'baseline',
            baselineData: [],
            createBaseline: jest.fn()
        };
    });

    it('should render correctly', () =>{
        const wrapper = shallow(
            <CreateBaseline { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update baselineName', () =>{
        const wrapper = shallow(
            <CreateBaseline { ...props }/>
        );
        wrapper.instance().updateBaselineName('newBaselineName');
        expect(wrapper.state('baselineName')).toEqual('newBaselineName');
    });
});

describe('ConnectedCreateBaseline', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            baselinesTableState: {
                baselineData: []
            },
            createBaseline: jest.fn()
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedCreateBaseline />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
