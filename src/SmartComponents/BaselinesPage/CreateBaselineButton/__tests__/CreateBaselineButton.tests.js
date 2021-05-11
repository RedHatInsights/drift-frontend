import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedCreateBaselineButton, { CreateBaselineButton } from '../CreateBaselineButton';

describe('CreateBaselineButton', () => {
    let props;

    beforeEach(() => {
        props = {
            addSystemModalOpened: false,
            loading: false,
            permissions: {
                baselinesWrite: true
            }
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <CreateBaselineButton { ...props }/>
        );

        expect(wrapper.find('[id="create-baseline-button"]').prop('isDisabled')).toBe(false);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render disabled with no write permissions', () => {
        props.permissions.baselinesWrite = false;
        const wrapper = shallow(
            <CreateBaselineButton { ...props }/>
        );

        expect(wrapper.find('[id="create-baseline-button"]').prop('isDisabled')).toBe(true);
        expect(wrapper.find('Tooltip')).toHaveLength(1);
    });

    it('should render mount correctly', () => {
        const wrapper = mount(
            <CreateBaselineButton { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should call toggleCreateBaselineModal', () => {
            const toggleCreateBaselineModal = jest.fn();
            const toggleAddSystemModal = jest.fn();
            const history = { location: { pathname: '/baselines' }, push: jest.fn() };
            const wrapper = mount(
                <CreateBaselineButton
                    history={ history }
                    toggleCreateBaselineModal={ toggleCreateBaselineModal }
                    toggleAddSystemModal={ toggleAddSystemModal }
                    { ...props }
                />
            );

            wrapper.find('.pf-c-button').simulate('click');
            expect(toggleCreateBaselineModal).toHaveBeenCalledTimes(1);
            expect(toggleAddSystemModal).toHaveBeenCalledTimes(0);
        });

        it('should call toggleAddSystemModal', () => {
            props.addSystemModalOpened = true;
            const toggleCreateBaselineModal = jest.fn();
            const toggleAddSystemModal = jest.fn();
            const history = { location: { pathname: '/' }, push: jest.fn() };
            const wrapper = mount(
                <CreateBaselineButton
                    history={ history }
                    toggleCreateBaselineModal={ toggleCreateBaselineModal }
                    toggleAddSystemModal={ toggleAddSystemModal }
                    { ...props }
                />
            );

            wrapper.find('.pf-c-button').simulate('click');
            expect(toggleCreateBaselineModal).toHaveBeenCalledTimes(1);
            expect(toggleAddSystemModal).toHaveBeenCalledTimes(1);
        });
    });
});

describe('ConnectedCreateBaselineButton', () => {
    let initialState;
    let mockStore;
    let props;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            addSystemModalState: {
                addSystemModalOpened: false
            }
        };

        props = {
            permissions: {
                baselinesWrite: true
            }
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedCreateBaselineButton { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should dispatch toggleCreateBaselineModal', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedCreateBaselineButton { ...props } />
                </Provider>
            </MemoryRouter>
        );

        const actions = store.getActions();
        wrapper.find('.pf-c-button').simulate('click');
        expect(actions).toEqual([{ type: 'TOGGLE_CREATE_BASELINE_MODAL' }]);
    });

    it('should dispatch toggleAddSystemModal', () => {
        initialState.addSystemModalState.addSystemModalOpened = true;
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedCreateBaselineButton { ...props } />
                </Provider>
            </MemoryRouter>
        );

        const actions = store.getActions();
        wrapper.find('.pf-c-button').simulate('click');
        expect(actions).toEqual([
            { type: 'OPEN_ADD_SYSTEM_MODAL' },
            { type: 'TOGGLE_CREATE_BASELINE_MODAL' }
        ]);
    });
});
