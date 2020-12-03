/*eslint-disable camelcase*/
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BlueprintIcon, ClockIcon, ServerIcon } from '@patternfly/react-icons';

import SelectedBasket from '../SelectedBasket';

describe('SelectedBasket', () => {
    let props;

    beforeEach(() => {
        props = {
            selectedBaselineContent: [
                { id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> }
            ],
            selectedHSPContent: [
                {
                    id: 'ijkl9101',
                    captured_date: '2021-03-03T06:40:32+00:00',
                    icon: <ClockIcon />,
                    system_id: 'efgh5678'
                }
            ],
            selectedSystemContent: [
                { id: 'efgh5678', name: 'system', icon: <ServerIcon /> }
            ],
            handleBaselineSelection: jest.fn(),
            handleHSPSelection: jest.fn(),
            selectBaseline: jest.fn(),
            selectHistoricProfiles: jest.fn(),
            selectEntity: jest.fn(),
            toggleBasketVisible: jest.fn()
        };
    });

    it('should render empty', () => {
        props.selectedSystemContent = [];
        props.selectedBaselineContent = [];
        props.selectedHSPContent = [];

        const wrapper = shallow(
            <SelectedBasket
                { ...props }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not be visible with selected count', () => {
        const wrapper = shallow(
            <SelectedBasket
                { ...props }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should toggle to visible with system, baseline and hsp', () => {
        const wrapper = shallow(
            <SelectedBasket
                { ...props }
            />
        );

        wrapper.find('a').simulate('click');
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should remove a single content piece', () => {
        const wrapper = shallow(
            <SelectedBasket
                { ...props }
            />
        );

        wrapper.setState({ systemsToDeselect: [ 'efgh5678' ]});
        wrapper.setState({ isVisible: true });

        wrapper.instance().onToggle();
        expect(props.selectEntity).toHaveBeenCalledWith('efgh5678', false);
        expect(props.selectBaseline).not.toHaveBeenCalled();
        expect(props.selectHistoricProfiles).not.toHaveBeenCalled();
    });

    it('should remove one of two hsps', () => {
        props.selectedHSPContent.push({
            id: 'mnop1121',
            captured_date: '2021-03-02T06:40:32+00:00',
            icon: <ClockIcon />,
            system_id: 'efgh5678'
        });
        const wrapper = shallow(
            <SelectedBasket
                { ...props }
            />
        );

        wrapper.setState({ hspsToDeselect: [ 'ijkl9101' ]});
        wrapper.setState({ isVisible: true });

        wrapper.instance().onToggle();
        expect(props.selectHistoricProfiles).toHaveBeenCalledWith([ 'mnop1121' ]);
    });

    it('should remove all selected', async () => {
        const wrapper = shallow(
            <SelectedBasket
                { ...props }
            />
        );

        wrapper.setState({
            systemsToDeselect: [ 'efgh5678' ],
            baselinesToDeselect: [ 'abcd1234' ],
            hspsToDeselect: [ 'ijkl9101' ]
        });
        wrapper.setState({ isVisible: true });

        await wrapper.instance().onToggle();
        await expect(props.selectBaseline).toHaveBeenCalledWith([ 'abcd1234' ], false, 'COMPARISON');
        await expect(props.handleBaselineSelection).toHaveBeenCalledWith(
            [{ id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> }],
            false
        );
        await expect(props.selectHistoricProfiles).toHaveBeenCalledWith([]);
        await expect(props.handleHSPSelection).toHaveBeenCalledWith({
            id: 'ijkl9101',
            captured_date: '2021-03-03T06:40:32+00:00',
            icon: <ClockIcon />,
            system_id: 'efgh5678'
        });
        await expect(props.selectEntity).toHaveBeenCalledWith('efgh5678', false);
    });

    it('should add system to systemsToDeselect', () => {
        const wrapper = shallow(
            <SelectedBasket
                { ...props }
            />
        );

        wrapper.instance().findType('system', 'efgh5678');

        expect(wrapper.state('systemsToDeselect')).toEqual([ 'efgh5678' ]);
    });

    it('should add baseline to baselinesToDeselect', () => {
        const wrapper = shallow(
            <SelectedBasket
                { ...props }
            />
        );

        wrapper.instance().findType('baseline', 'abcd1234');

        expect(wrapper.state('baselinesToDeselect')).toEqual([ 'abcd1234' ]);
    });

    it('should add hsp to hspsToDeselect', () => {
        const wrapper = shallow(
            <SelectedBasket
                { ...props }
            />
        );

        wrapper.instance().findType('hsp', 'ijkl9101');

        expect(wrapper.state('hspsToDeselect')).toEqual([ 'ijkl9101' ]);
    });

    it.skip('should remove system from systemsToDeselect', async () => {
        const wrapper = shallow(
            <SelectedBasket
                { ...props }
            />
        );

        wrapper.setState({ systemsToDeselect: [ 'efgh5678' ]});

        await wrapper.instance().findType('system', 'efgh5678');

        expect(wrapper.state('systemsToDeselect')).toEqual([]);
    });

    it('should build array without id', () => {
        const wrapper = shallow(
            <SelectedBasket
                { ...props }
            />
        );

        expect(wrapper.instance().removeId('efgh5678', [ 'efgh5678' ])).toEqual([]);
    });

    it('should build array without id but leave selected', () => {
        const wrapper = shallow(
            <SelectedBasket
                { ...props }
            />
        );

        expect(wrapper.instance().removeId('efgh5678', [ 'abcd1234', 'efgh5678' ])).toEqual([ 'abcd1234' ]);
    });
});
/*eslint-enable camelcase*/
