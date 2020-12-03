/*eslint-disable camelcase*/
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import SelectedBasketCheckbox from '../SelectedBasketCheckbox';

describe('SelectedBasketCheckbox', () => {
    let props;

    beforeEach(() => {
        props = {
            type: '',
            id: 'abcd1234',
            findType: jest.fn()
        };
    });

    it('should render system', () => {
        props.type = 'system';

        const wrapper = shallow(
            <SelectedBasketCheckbox
                { ...props }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render baseline', () => {
        props.type = 'baseline';

        const wrapper = shallow(
            <SelectedBasketCheckbox
                { ...props }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render hsp', () => {
        props.type = 'hsp';

        const wrapper = shallow(
            <SelectedBasketCheckbox
                { ...props }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should handle change', () => {
        props.type = 'system';

        const wrapper = shallow(
            <SelectedBasketCheckbox
                { ...props }
            />
        );

        wrapper.instance().handleChange();

        expect(props.findType).toHaveBeenCalledWith('system', 'abcd1234');
        expect(wrapper.state('isChecked')).toEqual(false);
    });
});
/*eslint-enable camelcase*/
