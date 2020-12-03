/*eslint-disable camelcase*/
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { BlueprintIcon, ClockIcon, ServerIcon } from '@patternfly/react-icons';

import SelectedTable from '../SelectedTable';

describe('SelectedTable', () => {
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
                    system_id: 'efgh5678',
                    system_name: 'system'
                }
            ],
            selectedSystemContent: [
                { id: 'efgh5678', name: 'system', icon: <ServerIcon /> }
            ],
            entities: {
                rows: [
                    { id: 'efgh5678' }
                ]
            },
            findType: jest.fn(),
            handleDeselect: jest.fn()
        };
    });

    it('should render empty', () => {
        props.selectedSystemContent = [];
        props.selectedBaselineContent = [];
        props.selectedHSPContent = [];

        const wrapper = shallow(
            <SelectedTable
                { ...props }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with system, baseline and hsp', () => {
        const wrapper = shallow(
            <SelectedTable
                { ...props }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render hsp with system and hsp without system', () => {
        props.selectedHSPContent.push({
            id: 'mnop1121',
            captured_date: '2021-03-02T06:40:32+00:00',
            icon: <ClockIcon />,
            system_id: '4321dcba',
            system_name: 'system2'
        });

        props.entities.rows.push({ id: '4321dcba' });
        props.entities.selectedSystemIds = [ 'efgh5678' ];

        const wrapper = shallow(
            <SelectedTable
                { ...props }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
/*eslint-enable camelcase*/
