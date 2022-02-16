import React from 'react';
import { render } from '@testing-library/react';

import { GlobalFilterAlert } from '../GlobalFilterAlert';
import fixtures from './GlobalFilterAlert.fixtures';

describe('GlobalFilterAlert react-testing-library', () => {
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
        const { asFragment } = render(<GlobalFilterAlert { ...props }/>);

        expect(asFragment()).toMatchSnapshot();
    });

    it('should render with SAP', () => {
        props.globalFilterState.workloadsFilter = fixtures.workloadsFilterSAPTrue;
        const { asFragment } = render(<GlobalFilterAlert { ...props }/>);

        expect(asFragment()).toMatchSnapshot();
    });

    it('should NOT render with not selected SAP', () => {
        props.globalFilterState.workloadsFilter = fixtures.workloadsFilterSAPFalse;

        const { asFragment } = render(<GlobalFilterAlert { ...props }/>);

        expect(asFragment()).toMatchSnapshot();
    });

    it('should render with Ansible Automation Platform', () => {
        props.globalFilterState.workloadsFilter = fixtures.workloadsFilterAnsibleTrue;

        const { asFragment } = render(
            <GlobalFilterAlert
                { ...props }
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should NOT render with Ansible Automation Platform', () => {
        props.globalFilterState.workloadsFilter = fixtures.workloadsFilterAnsibleFalse;

        const { asFragment } = render(
            <GlobalFilterAlert
                { ...props }
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should render with SAP with both filters', () => {
        props.globalFilterState.workloadsFilter = fixtures.allWorkloadsFiltersSAPTrue;

        const { asFragment } = render(
            <GlobalFilterAlert
                { ...props }
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should render with Ansible Automation Platform with both filters', () => {
        props.globalFilterState.workloadsFilter = fixtures.allWorkloadsFiltersAnsibleTrue;

        const { asFragment } = render(
            <GlobalFilterAlert
                { ...props }
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should render with SAP and Ansible Automation Platform', () => {
        props.globalFilterState.workloadsFilter = fixtures.allWorkloadsFiltersTrue;

        const { asFragment } = render(
            <GlobalFilterAlert
                { ...props }
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should Not render with SAP and Ansible Automation Platform', () => {
        props.globalFilterState.workloadsFilter = fixtures.allWorkloadsFiltersFalse;

        const { asFragment } = render(
            <GlobalFilterAlert
                { ...props }
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should render with SAP and filters', () => {
        props.globalFilterState.workloadsFilter = fixtures.workloadsFilterSAPTrue;
        props.globalFilterState.sidsFilter = [ 'AB1', 'XY1' ];
        props.globalFilterState.tagsFilter = [ 'patch/rest=patchman-engine', 'patch/dev=patchman-engine', 'insights-client/group=XmygroupX' ];

        const { asFragment } = render(
            <GlobalFilterAlert
                { ...props }
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
