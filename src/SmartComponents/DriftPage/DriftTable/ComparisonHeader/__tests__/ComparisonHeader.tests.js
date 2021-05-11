import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ComparisonHeader from '../ComparisonHeader';
import fixtures from './ComparisonHeader.fixtures';

describe('ComparisonHeader', () => {
    let props;

    beforeEach(() => {
        props = {
            factSort: '',
            fetchCompare: jest.fn(),
            hasHSPReadPermissions: true,
            masterList: [],
            permissions: {
                hspRead: true
            },
            referenceId: undefined,
            isFirstReference: true,
            removeSystem: jest.fn(),
            stateSort: '',
            systemIds: [],
            toggleFactSort: jest.fn(),
            toggleStateSort: jest.fn(),
            updateReferenceId: jest.fn(),
            setHistory: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render fact sort asc', () => {
        props.factSort = 'asc';
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render fact sort desc', () => {
        props.factSort = 'desc';
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render state sort asc', () => {
        props.stateSort = 'asc';
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render state sort desc', () => {
        props.stateSort = 'desc';
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render fact sort desc on click', () => {
        props.factSort = 'asc';
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );

        wrapper.find('th').first().simulate('click');
        expect(props.toggleFactSort).toHaveBeenCalledWith('asc');
    });

    it('should render fact sort asc on click', () => {
        props.factSort = 'desc';
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );

        wrapper.find('th').first().simulate('click');
        expect(props.toggleFactSort).toHaveBeenCalledWith('desc');
    });

    it('should render state sort none on click', () => {
        props.stateSort = 'desc';
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );

        wrapper.find('th').at(1).simulate('click');
        expect(props.toggleStateSort).toHaveBeenCalledWith('desc');
    });

    it('should render state sort asc on click', () => {
        props.stateSort = '';
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );

        wrapper.find('th').at(1).simulate('click');
        expect(props.toggleStateSort).toHaveBeenCalledWith('');
    });

    it('should render state sort desc on click', () => {
        props.stateSort = 'asc';
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );

        wrapper.find('th').at(1).simulate('click');
        expect(props.toggleStateSort).toHaveBeenCalledWith('asc');
    });

    it('should remove a system', () => {
        props.masterList = fixtures.masterListSystem;

        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );

        wrapper.find('a').simulate('click');
        expect(props.removeSystem).toHaveBeenCalled();
    });

    it('should call setHistory on toggleFactSort', async () => {
        props.factSort = 'desc';
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );

        await wrapper.instance().toggleSort('fact', 'desc');
        expect(props.setHistory).toHaveBeenCalled();
    });

    it('should call setHistory on toggleStateSort', async () => {
        props.stateSort = 'desc';
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );

        await wrapper.instance().toggleSort('state', 'desc');
        expect(props.setHistory).toHaveBeenCalled();
    });

    it('should render a system, baseline and hsp', () => {
        props.masterList = fixtures.masterListAll;
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render HistoricalProfilesPopover with no hspRead permissions', () => {
        props.masterList = fixtures.masterListAll;
        props.permissions.hspRead = false;
        const wrapper = shallow(
            <ComparisonHeader { ...props }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
