import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import DriftToolbar from '../DriftToolbar';

describe('DriftToolbar', () => {
    let props;

    beforeEach(() => {
        props = {
            loading: false,
            page: 1,
            perPage: 50,
            totalFacts: 30,
            clearSelectedBaselines: jest.fn(),
            clearComparison: jest.fn(),
            clearComparisonFilters: jest.fn(),
            updateReferenceId: jest.fn(),
            updatePagination: jest.fn(),
            setIsFirstReference: jest.fn(),
            history: { push: jest.fn() }
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call clearComparisonFilters', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.instance().clearFilters();
        expect(props.clearComparisonFilters).toHaveBeenCalled();
    });

    it('should call clearComparison', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.instance().clearComparison();
        expect(props.clearComparison).toHaveBeenCalled();
    });

    it('should toggle dropdownOpen', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.instance().onToggle();
        expect(wrapper.state('dropdownOpen')).toEqual(true);
    });

    it('should call clearFilters', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.setState({ isEmpty: false });
        wrapper.find('a').simulate('click');
        expect(props.clearComparisonFilters).toHaveBeenCalled();
    });
});
