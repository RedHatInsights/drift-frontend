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
            factFilter: '',
            activeFactFilters: [],
            clearSelectedBaselines: jest.fn(),
            clearComparison: jest.fn(),
            clearComparisonFilters: jest.fn(),
            updateReferenceId: jest.fn(),
            updatePagination: jest.fn(),
            setIsFirstReference: jest.fn(),
            history: { push: jest.fn() },
            stateFilters: stateFilters.allStatesTrue,
            addStateFilter: jest.fn(),
            filterByFact: jest.fn(),
            handleFactFilter: jest.fn(),
            clearAllFactFilters: jest.fn(),
            clearAllSelections: jest.fn(),
            setHistory: jest.fn()
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    /*it('should render with fact filter chips', () => {
        props.factFilter = 'dog';
        props.activeFactFilters = [ 'cat', 'mouse' ];

        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });*/

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
        expect(props.setHistory).toHaveBeenCalled();
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

    it('should remove fact filter chip', async () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.instance().removeChip('Fact name', 'blah');

        await expect(props.filterByFact).toHaveBeenCalledWith('');
        expect(props.setHistory).toHaveBeenCalled();
    });

    it('should remove active fact filter chip', () => {
        props.activeFactFilters = [ 'cat', 'mouse' ];
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.instance().removeChip('Fact name', 'cat');

        expect(props.handleFactFilter).toHaveBeenCalledWith('cat');
    });

    it('should remove all fact filter chips', () => {
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.instance().removeChip('Fact name', '');

        expect(props.clearAllFactFilters).toHaveBeenCalled();
    });

    it.skip('should call clearFilters', () => {
        props.factFilter = 'blah';
        const wrapper = shallow(
            <DriftToolbar { ...props } />
        );
        wrapper.find('.pf-c-button').simulate('click');
        expect(props.clearComparisonFilters).toHaveBeenCalled();
    });
});
