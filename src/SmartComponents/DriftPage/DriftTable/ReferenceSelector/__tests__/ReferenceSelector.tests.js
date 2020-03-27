import React from 'react';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import ReferenceSelector from '../ReferenceSelector';

describe('ReferenceSelector', () => {
    let props;

    beforeEach(() => {
        props = {
            isReference: false,
            id: 'abcd1234',
            updateReferenceId: jest.fn()
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <ReferenceSelector { ...props } />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render mount correctly with isReference false', () => {
        const wrapper = mount(
            <ReferenceSelector { ...props } />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render mount correctly with isReference true', () => {
        props.isReference = true;

        const wrapper = mount(
            <ReferenceSelector { ...props } />
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should set isReference false by props', () => {
            const wrapper = mount(
                <ReferenceSelector { ...props } />
            );

            expect(wrapper.state('isReference')).toEqual(false);
        });
    });

    it('should set isReference true by props', () => {
        props.isReference = true;

        const wrapper = mount(
            <ReferenceSelector { ...props } />
        );

        expect(wrapper.state('isReference')).toEqual(true);
    });

    it('should call updatedReferenceId with id', () => {
        const wrapper = mount(
            <ReferenceSelector { ...props } />
        );

        wrapper.find('OutlinedStarIcon').simulate('click');
        expect(props.updateReferenceId).toHaveBeenCalledWith('abcd1234');
    });

    it('should call updatedReferenceId with undefined', () => {
        props.isReference = true;

        const wrapper = mount(
            <ReferenceSelector { ...props } />
        );

        wrapper.find('StarIcon').simulate('click');
        expect(props.updateReferenceId).toHaveBeenCalledWith();
    });
});
