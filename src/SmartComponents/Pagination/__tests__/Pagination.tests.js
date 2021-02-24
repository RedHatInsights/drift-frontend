import React from 'react';
import { shallow, mount } from 'enzyme';

import TablePagination from '../Pagination';
import toJson from 'enzyme-to-json';

describe('table pagination', () => {
    let props;

    beforeEach(() => {
        props = {
            page: 1,
            perPage: 50,
            total: 0,
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

    it('should call updatePagination with page 2 and perPage 50', () => {
        props.total = 100;
        const updatePagination = jest.fn();
        const wrapper = mount(
            <TablePagination
                { ...props }
                updatePagination={ updatePagination }
            />
        );

        wrapper.find('.pf-c-button').at(2).simulate('click');
        expect(updatePagination).toHaveBeenCalledWith({ page: 2, perPage: 50 });
    });

    it('should call updatePagination on baselines table with page 2 and perPage 50', () => {
        props.total = 100;
        const updatePagination = jest.fn();
        const wrapper = mount(
            <TablePagination
                { ...props }
                updatePagination={ updatePagination }
                tableId={ 'COMPARISON' }
            />
        );

        wrapper.find('.pf-c-button').at(2).simulate('click');
        expect(updatePagination).toHaveBeenCalledWith({ page: 2, perPage: 50 }, 'COMPARISON');
    });

    it('should call updatePagination with page: 1 perPage 10', () => {
        props.total = 100;
        const updatePagination = jest.fn();
        const wrapper = mount(
            <TablePagination
                { ...props }
                updatePagination={ updatePagination }
            />
        );

        wrapper.find('.pf-c-options-menu__toggle-button').at(0).simulate('click');
        wrapper.find('.pf-c-options-menu__menu-item').at(0).simulate('click');
        expect(updatePagination).toHaveBeenCalledWith({ page: 1, perPage: 10 });
    });

    it('should call updatePagination on baselines table with page: 1 perPage 10', () => {
        props.total = 100;
        const updatePagination = jest.fn();
        const wrapper = mount(
            <TablePagination
                { ...props }
                updatePagination={ updatePagination }
                tableId={ 'COMPARISON' }
            />
        );

        wrapper.find('.pf-c-options-menu__toggle-button').at(0).simulate('click');
        wrapper.find('.pf-c-options-menu__menu-item').at(0).simulate('click');
        expect(updatePagination).toHaveBeenCalledWith({ page: 1, perPage: 10 }, 'COMPARISON');
    });
});
