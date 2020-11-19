import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import DriftToolbar from '../DriftToolbar';
import stateFilters from '../../../modules/__tests__/state-filter.fixtures';

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
            history: { push: jest.fn() },
            stateFilters: stateFilters.allStatesTrue,
            addStateFilter: jest.fn(),
            filterByFact: jest.fn()
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

    it('should clear state chips', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.instance().clearAllStateChips();

        expect(props.addStateFilter).toHaveBeenCalledWith(
            { filter: 'SAME', display: 'Same', selected: true }
        );
        expect(props.addStateFilter).toHaveBeenCalledWith(
            { filter: 'DIFFERENT', display: 'Different', selected: true }
        );
        expect(props.addStateFilter).toHaveBeenCalledWith(
            { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
        );
    });

    it('should remove single state chip', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.instance().removeChip('State', 'Same');

        expect(props.addStateFilter).toHaveBeenCalledWith(
            { filter: 'SAME', display: 'Same', selected: true }
        );
    });

    it('should remove all state chips', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.instance().removeChip('State', '');

        expect(props.addStateFilter).toHaveBeenCalledWith(
            { filter: 'SAME', display: 'Same', selected: true }
        );
        expect(props.addStateFilter).toHaveBeenCalledWith(
            { filter: 'DIFFERENT', display: 'Different', selected: true }
        );
        expect(props.addStateFilter).toHaveBeenCalledWith(
            { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
        );
    });

    it('should remove filter chip', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.instance().removeChip('Fact name', 'blah');

        expect(props.filterByFact).toHaveBeenCalledWith('');
    });

    it('should clear all filters', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.instance().removeChip();

        expect(props.filterByFact).toHaveBeenCalledWith('');
        expect(props.addStateFilter).toHaveBeenCalledWith(
            { filter: 'SAME', display: 'Same', selected: true }
        );
        expect(props.addStateFilter).toHaveBeenCalledWith(
            { filter: 'DIFFERENT', display: 'Different', selected: true }
        );
        expect(props.addStateFilter).toHaveBeenCalledWith(
            { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
        );
    });

    it('should call clearFilters', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.setState({ isEmpty: false });
        wrapper.find('a').simulate('click');
        expect(props.clearComparisonFilters).toHaveBeenCalled();
    });

    it('should set isEmpty', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );

        wrapper.instance().setIsEmpty(false);
        expect(wrapper.state('isEmpty')).toEqual(false);
    });
});
