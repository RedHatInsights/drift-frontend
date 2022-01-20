import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import DriftFilterDropdown from '../DriftFilterDropdown';

describe('DriftFilterValue', () => {
    let props;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation((init) => [ init, setState ]);

    beforeEach(() => {
        props = {
            filterType: 'Fact name',
            toggleFilterType: jest.fn()
        };
    });

    it('should render with fact name', () => {
        const wrapper = shallow(
            <DriftFilterDropdown { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with state filter', () => {
        props.filterType = 'State';

        const wrapper = shallow(
            <DriftFilterDropdown { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
