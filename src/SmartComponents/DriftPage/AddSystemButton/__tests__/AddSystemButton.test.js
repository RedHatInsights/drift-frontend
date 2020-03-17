import React from 'react';
import { shallow } from 'enzyme';
import { AddSystemButton } from '../AddSystemButton';
import toJson from 'enzyme-to-json';

describe('add system button', () => {
    let props;

    beforeEach(() => {
        props = {
            loading: false
        };
    });

    it('should render correctly', async () => {
        const wrapper = shallow(
            <AddSystemButton { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should enable add system or baseline button', () => {
            const wrapper = shallow(
                <AddSystemButton { ...props } />
            );

            expect(wrapper.prop('isDisabled')).toEqual(false);
        });

        it('should disable add system or baseline button', () => {
            props.loading = true;

            const wrapper = shallow(
                <AddSystemButton { ...props } />
            );

            expect(wrapper.prop('isDisabled')).toEqual(true);
        });
    });
});
