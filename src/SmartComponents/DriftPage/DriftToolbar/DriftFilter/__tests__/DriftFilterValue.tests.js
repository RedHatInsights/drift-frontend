import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import DriftFilterValue from '../DriftFilterValue';
import stateFilters from '../../../../modules/__tests__/state-filter.fixtures';
import { factTypeFiltersDefault, factTypeFiltersBaselineTrue } from '../../../../modules/__tests__/reducer.fixtures';

describe('DriftFilterValue', () => {
    let props;

    beforeEach(() => {
        props = {
            activeFactFilters: [],
            addStateFilter: jest.fn(),
            clearAllFactFilters: jest.fn(),
            factFilter: '',
            factTypeFilters: factTypeFiltersDefault,
            filterByFact: jest.fn(),
            filterType: 'Fact name',
            handleFactFilter: jest.fn(),
            setHistory: jest.fn(),
            stateFilters: stateFilters.allStatesTrue
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <DriftFilterValue { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with fact type filter chips', () => {
        props.filterType = 'Fact type';
        props.factTypeFilters = factTypeFiltersBaselineTrue;
        const wrapper = shallow(
            <DriftFilterValue { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with fact filter chips', () => {
        props.factFilter = 'dog';
        props.activeFactFilters = [ 'cat', 'mouse' ];

        const wrapper = shallow(
            <DriftFilterValue { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with state filter deselected', () => {
        props.filterType = 'State';
        props.stateFilters[0].selected = false;

        const wrapper = shallow(
            <DriftFilterValue { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
