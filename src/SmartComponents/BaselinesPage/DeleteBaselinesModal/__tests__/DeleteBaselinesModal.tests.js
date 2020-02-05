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
            fetchBaselines: jest.fn()
        };
    });

    it('should render correctly', () =>{
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
            expect(wrapper.state('modalOpened')).toEqual(false);
        });

        it('should delete baseline', async () => {
            const deleteSelectedBaselines = jest.fn();
            deleteSelectedBaselines
            .mockReturnValue({
                value: { data: 'OK' }
            });

            const wrapper = mount(
                <DeleteBaselinesModal { ...props }
                    deleteSelectedBaselines={ deleteSelectedBaselines }
                    baselineId={ 'abcd' }
                />
            );

            wrapper.find('.pf-c-button').at(1).simulate('click');
            await expect(deleteSelectedBaselines).toHaveBeenCalledTimes(1);
        });

        it('should delete multiple baseline', async () => {
            const deleteSelectedBaselines = jest.fn();
            const selectedBaselineIds = [ 'abcd', 'efgh' ];
            deleteSelectedBaselines
            .mockReturnValue({
                value: { data: 'OK' }
            });

            const wrapper = mount(
                <DeleteBaselinesModal { ...props }
                    deleteSelectedBaselines={ deleteSelectedBaselines }
                    selectedBaselineIds={ selectedBaselineIds }
                />
            );

            wrapper.find('.pf-c-button').at(1).simulate('click');
            await expect(deleteSelectedBaselines).toHaveBeenCalledTimes(1);
        });
    });
});

describe('ConnectedDeleteBaselinesModal', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            baselinesTableState: {
                selectedBaselineIds: []
            },
            modalOpened: true
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedDeleteBaselinesModal />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
