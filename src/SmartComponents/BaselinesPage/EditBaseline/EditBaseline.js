import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Breadcrumb, BreadcrumbItem, Card, CardBody } from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { AngleDownIcon, AngleRightIcon } from '@patternfly/react-icons';

import EditBaselineToolbar from './EditBaselineToolbar/EditBaselineToolbar';
import FactModal from './FactModal/FactModal';
import { baselinesPageActions } from '../redux';
import { baselinesTableActions } from '../../BaselinesTable/redux';
import editBaselineHelpers from './helpers';

class EditBaseline extends Component {
    constructor(props) {
        super(props);

        this.fetchBaselineId();
        this.renderBreadcrumb = this.renderBreadcrumb.bind(this);
        this.goToBaselinesList = this.goToBaselinesList.bind(this);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
    }

    fetchBaselineId() {
        const { match: { params }, fetchBaselineData } = this.props;

        fetchBaselineData(params.id);
    }

    goToBaselinesList() {
        const { history, clearBaselineData } = this.props;

        clearBaselineData();
        history.push('/baselines');
    }

    renderBreadcrumb() {
        const { baselineData } = this.props;
        let breadcrumb;

        /*eslint-disable camelcase*/
        breadcrumb = <Breadcrumb>
            <BreadcrumbItem>
                <a onClick={ () => this.goToBaselinesList() }>
                    Baselines
                </a>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{ baselineData.display_name }</BreadcrumbItem>
        </Breadcrumb>;
        /*eslint-enable camelcase*/

        return breadcrumb;
    }

    renderHeaderRow() {
        return (
            <tr>
                <th className="edit-baseline-header"><div>Fact</div></th>
                <th className="edit-baseline-header"><div>Value</div></th>
                <th></th>
            </tr>
        );
    }

    renderLoadingRows() {
        let rows = [];
        let rowData = [];

        for (let i = 0; i < 3; i += 1) {
            rowData.push(<td><Skeleton size={ SkeletonSize.md } /></td>);
        }

        for (let i = 0; i < 10; i += 1) {
            rows.push(<tr>{ rowData }</tr>);
        }

        return rows;
    }

    renderExpandableRowButton(factName) {
        const { expandedRows } = this.props;
        let expandIcon;

        if (expandedRows.includes(factName)) {
            expandIcon = <AngleDownIcon className="pointer active-blue" onClick={ () => this.props.expandRow(factName) } />;
        } else {
            expandIcon = <AngleRightIcon className="pointer" onClick={ () => this.props.expandRow(factName) } />;
        }

        return expandIcon;
    }

    renderRowData(fact) {
        const { expandedRows } = this.props;
        let row = [];
        let rows = [];

        if (fact.values) {
            row.push(<td className={ expandedRows.includes(fact.name) ? 'nested-fact' : '' }>
                { this.renderExpandableRowButton(fact.name) } { fact.name }</td>);
            row.push(<td></td>);
            row.push(editBaselineHelpers.renderKebab(fact.name, '', fact));
            rows.push(<tr>{ row }</tr>);

            if (expandedRows.includes(fact.name)) {
                fact.values.forEach(function(subFact) {
                    row = [];
                    row.push(<td className="nested-fact">
                        <p className="child-row">{ subFact.name }</p>
                    </td>);
                    row.push(<td>{ subFact.value }</td>);
                    row.push(editBaselineHelpers.renderKebab(subFact.name, subFact.value, fact));
                    rows.push(<tr>{ row }</tr>);
                });
            }
        } else {
            row.push(<td>{ fact.name }</td>);
            row.push(<td>{ fact.value }</td>);
            row.push(editBaselineHelpers.renderKebab(fact.name, fact.value, fact));
            rows.push(<tr>{ row }</tr>);
        }

        return rows;
    }

    renderRows() {
        const { baselineData } = this.props;
        /*eslint-disable camelcase*/
        let facts = baselineData.baseline_facts;
        /*eslint-enable camelcase*/
        let rows = [];
        let rowData = [];

        if (facts !== undefined) {
            for (let i = 0; i < facts.length; i += 1) {
                rowData = this.renderRowData(facts[i]);
                rows.push(rowData);
            }
        }

        return rows;
    }

    renderTable() {
        const { baselineData } = this.props;

        return (
            <table className="pf-c-table ins-c-table pf-m-compact ins-entity-table drift-table">
                <thead>
                    { this.renderHeaderRow() }
                </thead>
                <tbody>
                    { baselineData !== undefined
                        ? this.renderRows()
                        : this.renderLoadingRows()
                    }
                </tbody>
            </table>
        );
    }

    render() {
        const { baselineData, factModalOpened } = this.props;

        return (
            <React.Fragment>
                { baselineData !== undefined
                    ? <PageHeader>
                        { this.renderBreadcrumb() }
                        <br></br>
                        <PageHeaderTitle title={ baselineData.display_name }/>
                    </PageHeader>
                    : <PageHeader>
                        <div><Skeleton size={ SkeletonSize.lg } /></div>
                    </PageHeader>
                }
                <Main>
                    <Card className='pf-t-light pf-m-opaque-100'>
                        <CardBody>
                            { factModalOpened
                                ? <FactModal />
                                : null
                            }
                            <EditBaselineToolbar />
                            { this.renderTable() }
                        </CardBody>
                    </Card>
                </Main>
            </React.Fragment>
        );
    }
}

EditBaseline.propTypes = {
    history: PropTypes.obj,
    match: PropTypes.any,
    toggleCreateBaseline: PropTypes.func,
    clearBaselineData: PropTypes.func,
    baselineData: PropTypes.object,
    baselineDataLoading: PropTypes.bool,
    patchBaseline: PropTypes.func,
    fetchBaselineData: PropTypes.func,
    factModalOpened: PropTypes.bool,
    editBaselineTableData: PropTypes.array,
    expandRow: PropTypes.func,
    expandedRows: PropTypes.array
};

function mapStateToProps(state) {
    return {
        baselineData: state.baselinesTableState.baselineData,
        baselineDataLoading: state.baselinesTableState.baselineDataLoading,
        factModalOpened: state.factModalState.factModalOpened,
        editBaselineTableData: state.baselinesTableState.editBaselineTableData,
        expandedRows: state.baselinesTableState.expandedRows
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateBaseline: () => dispatch(baselinesPageActions.toggleCreateBaseline()),
        clearBaselineData: () => dispatch(baselinesTableActions.clearBaselineData()),
        patchBaseline: (baselineId, newBaselineBody) => dispatch(baselinesTableActions.patchBaseline(baselineId, newBaselineBody)),
        expandRow: (factName) => dispatch(baselinesTableActions.expandRow(factName)),
        fetchBaselineData: (baselineUUID) => dispatch(baselinesTableActions.fetchBaselineData(baselineUUID))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditBaseline));
