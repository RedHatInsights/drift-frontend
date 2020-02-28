import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import FetchHistoricalProfilesButton from '../FetchHistoricalProfilesButton';

describe('FetchHistoricalProfilesButton', () => {
    it('should render correctly', () => {
        const wrapper = shallow(
            <FetchHistoricalProfilesButton />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render mount correctly', () => {
        const wrapper = mount(
            <FetchHistoricalProfilesButton />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call fetchCompare', () => {
        const fetchCompare = jest.fn();

        const wrapper = mount(
            <FetchHistoricalProfilesButton
                fetchCompare={ fetchCompare }
            />
        );

        wrapper.find('.pf-c-button').simulate('click');
        expect(fetchCompare).toHaveBeenCalledTimes(1);
    });
});
