import React from 'react';

import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedEditBaselineToolbar, { EditBaselineToolbar } from '../EditBaselineToolbar';
import editBaselineFixtures from '../../__tests__/helpers.fixtures';

describe('EditBaselineToolbar', () => {
    let props;

    beforeEach(() => {
        props = {
            isDisabled: false,
            selected: 0,
            onBulkSelect: jest.fn()
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <EditBaselineToolbar { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ConnectedEditBaselineToolbar', () => {
    let initialState;
    let mockStore;
    let props;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            editBaselineState: {
                editBaselineTableData: editBaselineFixtures.mockBaselineTableData1
            }
        };
        props = {
            isDisabled: false,
            selected: 0,
            onBulkSelect: jest.fn()
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedEditBaselineToolbar { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call onBulkSelect with true', () => {
        const store = mockStore(initialState);
        const onBulkSelect = jest.fn();
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedEditBaselineToolbar
                        { ...props }
                        onBulkSelect={ onBulkSelect }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-dropdown__toggle-button').simulate('click');
        wrapper.find('.pf-c-dropdown__menu-item').at(0).simulate('click');
        expect(onBulkSelect).toHaveBeenCalledWith(true);
    });

    it('should call onBulkSelect with false', () => {
        const store = mockStore(initialState);
        const onBulkSelect = jest.fn();
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedEditBaselineToolbar
                        { ...props }
                        onBulkSelect={ onBulkSelect }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-dropdown__toggle-button').simulate('click');
        wrapper.find('.pf-c-dropdown__menu-item').at(1).simulate('click');
        expect(onBulkSelect).toHaveBeenCalledWith(false);
    });

    it('should render BulkSelect with number selected', () => {
        const store = mockStore(initialState);
        props.selected = 2;
        const onBulkSelect = jest.fn();
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedEditBaselineToolbar
                        { ...props }
                        onBulkSelect={ onBulkSelect }
                    />
                </Provider>
            </MemoryRouter>
        );

        expect(wrapper.find('.pf-c-dropdown__toggle-text').prop('children')).toBe('2 selected');
    });

    it('should call onBulkSelect when selecting all', () => {
        const store = mockStore(initialState);
        const onBulkSelect = jest.fn();
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedEditBaselineToolbar
                        { ...props }
                        onBulkSelect={ onBulkSelect }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-dropdown__toggle-check input[type="checkbox"]').first().simulate('change');
        expect(onBulkSelect).toHaveBeenCalled();
    });
});
