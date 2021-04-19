import React from 'react';

import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedEditBaselineNameModal, { EditBaselineNameModal } from '../EditBaselineNameModal';
import editBaselineFixtures from '../../EditBaseline/__tests__/helpers.fixtures';
import api from '../../../../../api';

describe('EditBaselineNameModal', () => {
    let props;

    beforeEach(() => {
        props = {
            baselineData: editBaselineFixtures.mockBaselineData1,
            modalOpened: true,
            error: {}
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <EditBaselineNameModal { ...props }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render mount correctly', () => {
        const wrapper = mount(
            <EditBaselineNameModal { ...props }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should update baseline name', () => {
            const wrapper = shallow(
                <EditBaselineNameModal { ...props }/>
            );

            wrapper.find('TextInput').simulate('change', 'new-lotr-baseline');
            expect(wrapper.state('baselineName')).toEqual('new-lotr-baseline');
        });

        it('should confirm modal with patch', () => {
            const patchBaseline = jest.fn();
            const wrapper = mount(
                <EditBaselineNameModal
                    { ...props }
                    patchBaseline={ patchBaseline }
                />
            );

            wrapper.find('.pf-c-button').at(1).simulate('click');
            expect(patchBaseline).toHaveBeenCalled();
        });

        it('should confirm modal with error', () => {
            props.error = { detail: 'this is an error', status: 400 };
            const wrapper = mount(
                <EditBaselineNameModal
                    { ...props }
                />
            );

            wrapper.find('.pf-c-button').at(1).simulate('click');
            expect(wrapper.find('FormGroup').prop('helperTextInvalid')).toEqual('this is an error');
        });

        it('should cancel modal', () => {
            const toggleEditNameModal = jest.fn();
            const wrapper = mount(
                <EditBaselineNameModal
                    { ...props }
                    toggleEditNameModal={ toggleEditNameModal }
                />
            );

            wrapper.find('.pf-c-button').at(0).simulate('click');
            expect(toggleEditNameModal).toHaveBeenCalled();
        });

        it('should catch key press', () => {
            const patchBaseline = jest.fn();
            const wrapper = shallow(
                <EditBaselineNameModal
                    { ...props }
                    patchBaseline={ patchBaseline }
                />
            );

            wrapper.find('FormGroup').simulate('keypress', { key: 'Enter', preventDefault: jest.fn() });
            expect(patchBaseline).toHaveBeenCalled();
        });
    });

    describe('ConnectedEditBaselineNameModal', () => {
        let initialState;
        let mockStore;
        let props;

        beforeEach(() => {
            mockStore = configureStore();
            initialState = {};
            props = {
                baselineData: editBaselineFixtures.mockBaselineData1,
                modalOpened: true,
                error: {}
            };
        });

        it('should render correctly', () => {
            const store = mockStore(initialState);
            const patchBaseline = jest.fn();

            const wrapper = mount(
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedEditBaselineNameModal
                            { ...props }
                            patchBaseline={ patchBaseline }
                        />
                    </Provider>
                </MemoryRouter>
            );

            const actions = store.getActions();
            wrapper.find('.pf-c-button').at(1).simulate('click');
            expect(actions).toEqual([{ type: 'PATCH_BASELINE', payload: api.patchBaselineData('blah') }]);
        });
    });
});
