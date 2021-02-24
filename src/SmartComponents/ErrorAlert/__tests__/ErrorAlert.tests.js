import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedErrorAlert, { ErrorAlert } from '../ErrorAlert';

describe('ErrorAlert', () => {
    let props;

    beforeEach(() => {
        props = {
            error: { status: 404, detail: 'This is an error' },
            onClose: jest.fn(),
            addNotification: jest.fn()
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <ErrorAlert { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    /*eslint-disable no-unused-vars*/
    it('should call onClose', () => {
        const wrapper = mount(
            <ErrorAlert { ...props } />
        );

        expect(props.onClose).toHaveBeenCalled();
    });

    it('should call onClose with tableId', () => {
        props.tableId = 'COMPARISON';
        const wrapper = mount(
            <ErrorAlert { ...props } />
        );

        expect(props.onClose).toHaveBeenCalledWith('COMPARISON');
    });
    /*eslint-enable no-unused-vars*/
});

describe('ConnectedErrorAlert', () => {
    let initialState;
    let props;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();

        initialState = {
            addNotification: jest.fn()
        };

        props = {
            error: { status: 404, detail: 'This is an error' },
            onClose: jest.fn(),
            addNotification: jest.fn()
        };
    });

    it.skip('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedErrorAlert { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
