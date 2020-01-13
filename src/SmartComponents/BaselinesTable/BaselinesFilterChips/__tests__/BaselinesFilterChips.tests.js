import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import BaselinesFilterChips from '../BaselinesFilterChips';

describe('BaselinesFilterChips', () => {
    it('should render shallow correctly', () =>{
        const wrapper = shallow(
            <BaselinesFilterChips />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render mount correctly', () =>{
        const wrapper = mount(
            <BaselinesFilterChips />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render chip correctly', () =>{
        const props = {
            nameSearch: 'something'
        };
        const wrapper = shallow(
            <BaselinesFilterChips { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render chip update correctly', () =>{
        const props = {
            nameSearch: 'something'
        };
        const wrapper = shallow(
            <BaselinesFilterChips { ...props }/>
        );

        wrapper.setProps({ nameSearch: 'something else' });

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should have call clearTextFilter', () => {
            const clearTextFilter = jest.fn();
            const wrapper = mount(<BaselinesFilterChips
                nameSearch={ 'something' }
                clearTextFilter={ clearTextFilter }
            />);

            wrapper.find('.pf-c-button').simulate('click');
            expect(clearTextFilter).toHaveBeenCalledTimes(1);
        });
    });
});
