import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedDeleteBaselinesModal, { DeleteBaselinesModal } from '../DeleteBaselinesModal';

describe('DeleteBaselinesModal', () => {
    let props;

    beforeEach(() => {
        props = {
            selectedBaselineIds: [],
            modalOpened: true,
            clearSelectedBaselines: jest.fn(),
            deleteSelectedBaselines: jest.fn(),
            fetchWithParams: jest.fn(),
            toggleModal: jest.fn()
        };
    });

    it('should render correctly', () =>{
        const wrapper = shallow(
            <DeleteBaselinesModal { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render Delete baseline with baselineId', () => {
        props.baselineId = 'abcd1234';
        const wrapper = shallow(
            <DeleteBaselinesModal { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render mount correctly', () =>{
        const wrapper = mount(
            <DeleteBaselinesModal { ...props }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should render modal opened', () => {
            const wrapper = mount(
                <DeleteBaselinesModal { ...props }/>
            );

            expect(wrapper.find('Modal').prop('isOpen')).toEqual(true);
        });

        it('should use handleChecked', () => {
            const wrapper = mount(
                <DeleteBaselinesModal { ...props }/>
            );

            wrapper.find('.pf-c-button').at(2).simulate('click');
            expect(props.toggleModal).toHaveBeenCalled();
        });

        it('should delete baseline', async () => {
            props.deleteSelectedBaselines
            .mockReturnValue({
                value: { data: 'OK' }
            });

            const wrapper = mount(
                <DeleteBaselinesModal { ...props }
                    baselineId={ 'abcd' }
                />
            );

            wrapper.find('.pf-c-button').at(1).simulate('click');
            await expect(props.deleteSelectedBaselines).toHaveBeenCalledTimes(1);
            await expect(props.fetchWithParams).toHaveBeenCalled();

        });

        it('should delete multiple baseline', async () => {
            props.deleteSelectedBaselines
            .mockReturnValue({
                value: { data: 'OK' }
            });
            props.selectedBaselineIds = [ 'abcd', 'efgh' ];

            const wrapper = mount(
                <DeleteBaselinesModal { ...props } />
            );

            wrapper.find('.pf-c-button').at(1).simulate('click');
            await expect(props.deleteSelectedBaselines).toHaveBeenCalledTimes(1);
            await expect(props.fetchWithParams).toHaveBeenCalled();
        });
    });
});

describe('ConnectedDeleteBaselinesModal', () => {
    let initialState;
    let mockStore;
    let props;

    beforeEach(() => {
        mockStore = configureStore();

        props = {
            modalOpened: true,
            tableId: 'CHECKBOX',
            clearSelectedBaselines: jest.fn(),
            deleteSelectedBaselines: jest.fn(),
            fetchWithParams: jest.fn(),
            selectedBaselineIds: []
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDeleteBaselinesModal { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it.skip('should dispatch actions', async () => {
        props.selectedBaselineIds = [ 'abcd', 'efgh' ];
        const store = mockStore(initialState);
        props.deleteSelectedBaselines
        .mockReturnValue({
            value: { data: 'OK' }
        });

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDeleteBaselinesModal { ...props } />
                </Provider>
            </MemoryRouter>
        );

        const actions = store.getActions();
        wrapper.find('.pf-c-button').at(1).simulate('click');
        await expect(actions).toEqual([
            { type: 'DELETE_SELECTED_BASELINES_CHECKBOX' }
        ]);
    });
});
