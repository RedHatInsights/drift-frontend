import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { GlobalFilterAlert } from '../GlobalFilterAlert';

describe('GlobalFilterAlert', () => {
    let props;

    beforeEach(() => {
        props = {
            globalFilterState: {
                sidsFilter: [],
                tagsFilter: [],
                workloadsFilter: {}
            }
        };
    });

    it('should not render when empty', () => {
        const wrapper = shallow(
            <GlobalFilterAlert
                { ...props }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should not render with all workloads', () => {
        props.globalFilterState.workloadsFilter = {
            'All Workloads': {
                group: {
                    name: 'Workloads'
                }
            }
        };

        const wrapper = shallow(
            <GlobalFilterAlert
                { ...props }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with SAP', () => {
        props.globalFilterState.workloadsFilter = {
            SAP: {
                group: {
                    name: 'Workloads'
                },
                item: {
                    value: 'SAP'
                },
                isSelected: true
            }
        };

        const wrapper = shallow(
            <GlobalFilterAlert
                { ...props }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should NOT render with not selected SAP', () => {
        props.globalFilterState.workloadsFilter = {
            SAP: {
                group: {
                    name: 'Workloads'
                },
                item: {
                    value: 'SAP'
                },
                isSelected: false
            }
        };

        const wrapper = shallow(
            <GlobalFilterAlert
                { ...props }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render with SAP and filters', () => {
        props.globalFilterState.workloadsFilter = {
            SAP: {
                group: {
                    name: 'Workloads'
                },
                item: {
                    value: 'SAP'
                },
                isSelected: true
            }
        };

        props.globalFilterState.sidsFilter = [ 'AB1', 'XY1' ];
        props.globalFilterState.tagsFilter = [ 'patch/rest=patchman-engine', 'patch/dev=patchman-engine', 'insights-client/group=XmygroupX' ];

        const wrapper = shallow(
            <GlobalFilterAlert
                { ...props }
            />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
