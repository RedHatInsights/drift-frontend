import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import SearchBar from '../SearchBar';

describe('SearchBar', () => {
    let props;

    beforeEach(() => {
        props = {
            factFilter: '',
            activeFactFilters: [],
            handleFactFilter: jest.fn(),
            changeFactFilter: jest.fn(),
            setHistory: jest.fn()
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <SearchBar { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update state fact filter on componentDidUpdate', () => {
        props.factFilter = 'tripel';
        const wrapper = shallow(
            <SearchBar { ...props } />
        );

        const prevProps = wrapper.props();
        wrapper.setProps({ factFilter: '' });
        wrapper.instance().componentDidUpdate(prevProps);

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should update fact filter', () => {
        props.factFilter = 'tripel';
        const wrapper = shallow(
            <SearchBar { ...props } />
        );

        wrapper.instance().updateFactFilter('dubbel');

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should catch Enter on keypress', async() => {
        props.factFilter = 'quadrupel';
        const event = { key: 'Enter', preventDefault: jest.fn() };
        const wrapper = shallow(
            <SearchBar { ...props } />
        );

        wrapper.find('FormGroup').simulate('keypress', event);

        await expect(props.handleFactFilter).toHaveBeenCalledWith('quadrupel');
        expect(props.setHistory).toHaveBeenCalled();
    });
});
