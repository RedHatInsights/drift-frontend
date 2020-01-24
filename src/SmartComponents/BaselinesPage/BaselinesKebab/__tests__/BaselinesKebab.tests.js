import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { BaselinesKebab } from '../BaselinesKebab';

describe('BaselinesKebab', () => {
    let props;

    beforeEach(() => {
        props = {
            selectedBaselineIds: []
        };
    });

    it('should render correctly', () =>{
        const wrapper = shallow(
            <BaselinesKebab { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render kebabOpened', () =>{
        const wrapper = shallow(
            <BaselinesKebab { ...props }/>
        );
        wrapper.instance().toggleKebab();
        expect(wrapper.state('kebabOpened')).toEqual(true);
    });

    it('should render modalOpened', () =>{
        const wrapper = shallow(
            <BaselinesKebab { ...props }/>
        );
        wrapper.instance().toggleModalOpened();
        expect(wrapper.state('modalOpened')).toEqual(true);
    });
});
