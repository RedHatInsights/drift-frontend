import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import ConnectedTablePagination, { TablePagination } from '../Pagination';
import toJson from 'enzyme-to-json';

describe('table pagination', () => {
    let props;

    beforeEach(() => {
        props = {
            page: 1,
            perPage: 50,
            totalFacts: 0,
            isCompact: false
        };
    });

    it('should render correctly', async () => {
        const wrapper = shallow(
            <TablePagination { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render pagination compact', () => {
        props.isCompact = true;

        const wrapper = shallow(
            <TablePagination { ...props } />
        );

        expect(wrapper.prop('isCompact')).toBe(true);
    });
});

describe('ConnectedTablePagination', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            compareState: {
                page: 1,
                perPage: 50,
                totalFacts: 0
            }
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const isCompact = false;
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedTablePagination isCompact={ isCompact } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call updatePagination with page 2 and perPage 50', () => {
        initialState.compareState.totalFacts = 100;
        const store = mockStore(initialState);

        const updatePagination = jest.fn();
        const isCompact = false;
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedTablePagination
                        isCompact={ isCompact }
                        updatePagination={ updatePagination }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('.pf-c-button').at(2).simulate('click');
        expect(updatePagination).toHaveBeenCalledWith({ page: 2, perPage: 50 });
    });

    it.skip('should call updatePagination with page: 1 perPage 10', () => {
        initialState.compareState.totalFacts = 100;
        const store = mockStore(initialState);

        const updatePagination = jest.fn();
        const isCompact = false;
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedTablePagination
                        isCompact={ isCompact }
                        updatePagination={ updatePagination }
                    />
                </Provider>
            </MemoryRouter>
        );

        wrapper.find('[className=""]').simulate('click');
        expect(updatePagination).toHaveBeenCalled();
    });
});
