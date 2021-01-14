import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Checkbox, BreadcrumbHeading } from '@patternfly/react-core';
import { Skeleton, SkeletonSize, SkeletonTable } from '@redhat-cloud-services/frontend-components';
import { AngleDownIcon, AngleRightIcon, EditAltIcon, ExclamationCircleIcon, LockIcon, UndoIcon } from '@patternfly/react-icons';
import { cellWidth } from '@patternfly/react-table';

import EditBaselineToolbar from './EditBaselineToolbar/EditBaselineToolbar';
import ErrorAlert from '../../ErrorAlert/ErrorAlert';
import FactModal from './FactModal/FactModal';
import EditBaselineNameModal from './EditBaselineNameModal/EditBaselineNameModal';
import AddFactButton from './AddFactButton/AddFactButton';
import { baselinesTableActions } from '../../BaselinesTable/redux';
import { editBaselineActions } from './redux';
import editBaselineHelpers from './helpers';
import { FACT_ID, FACT_NAME, FACT_VALUE } from '../../../constants';
import EmptyStateDisplay from '../../EmptyStateDisplay/EmptyStateDisplay';
import { PermissionContext } from '../../../App';

import _ from 'lodash';

export class EditBaseline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpened: false,
            errorMessage: [ 'The baseline cannot be displayed at this time. Please retry and if',
                'the problem persists contact your system administrator.',
                ''
            ],
            loadingColumns: [
                { title: 'Fact', transforms: [ cellWidth(40) ]},
                { title: 'Value', transforms: [ cellWidth(45) ]},
                { title: '', transforms: [ cellWidth(5) ]}
            ]
        };

        this.fetchBaselineId();
        this.renderBreadcrumb = this.renderBreadcrumb.bind(this);
        this.goToBaselinesList = this.goToBaselinesList.bind(this);

        this.toggleEditNameModal = () => {
            const { modalOpened } = this.state;
            const { clearErrorData } = this.props;

            this.setState({ modalOpened: !modalOpened });
            clearErrorData();
        };
    }

    async componentDidMount() {
        const { match: { params }} = this.props;

        await window.insights.chrome.auth.getUser();
        await window.insights?.chrome?.appAction?.('baseline-view');
        await window.insights?.chrome?.appObjectId(params.id);
    }

    componentDidUpdate() {
        if (this.props.baselineData) {
            document.title = this.props.baselineData.display_name + ' - Baselines - Drift | Red Hat Insights';
        }
    }

    fetchBaselineId() {
        const { match: { params }, fetchBaselineData } = this.props;

        fetchBaselineData(params.id);
    }

    goToBaselinesList() {
        const { clearBaselineData, fetchBaselines, history } = this.props;

        clearBaselineData('CHECKBOX');
        fetchBaselines('CHECKBOX');
        history.push('/baselines');
    }

    retryBaselineFetch = () => {
        const { clearErrorData } = this.props;

        clearErrorData();
        this.fetchBaselineId();
    }

    renderBreadcrumb(baselineData, hasReadPermissions) {
        let breadcrumb;

        /*eslint-disable camelcase*/
        breadcrumb = <Breadcrumb>
            <BreadcrumbItem>
                <a onClick={ () => this.goToBaselinesList() }>
                    Baselines
                </a>
            </BreadcrumbItem>
            { baselineData && hasReadPermissions
                ? <BreadcrumbHeading>
                    { baselineData.display_name }
                </BreadcrumbHeading>
                : null
            }
        </Breadcrumb>;
        /*eslint-enable camelcase*/

        return breadcrumb;
    }

    renderPageTitle(baselineData, hasReadPermissions, hasWritePermissions) {
        let pageTitle;

        if (hasReadPermissions) {
            if (hasWritePermissions) {
                pageTitle = <React.Fragment>
                    <span className='pf-c-title pf-m-2xl'>
                        { !_.isEmpty(baselineData) ? baselineData.display_name : null }
                    </span>
                    <span>
                        { <EditAltIcon className='pointer not-active edit-icon-margin' onClick={ () => this.toggleEditNameModal() } /> }
                    </span>
                </React.Fragment>;
            } else {
                pageTitle = <React.Fragment>{ !_.isEmpty(baselineData) ? baselineData.display_name : null }</React.Fragment>;
            }
        } else {
            pageTitle = <React.Fragment>{ 'Baseline' }</React.Fragment>;
        }

        return pageTitle;
    }

    renderPageHeader = (hasReadPermissions, hasWritePermissions) => {
        const { modalOpened } = this.state;
        const { baselineData, baselineDataLoading, inlineError } = this.props;
        let pageHeader;

        if (baselineDataLoading) {
            pageHeader = <PageHeader>
                <div><Skeleton size={ SkeletonSize.lg } /></div>
            </PageHeader>;
        } else {
            if (baselineData !== undefined) {
                pageHeader = <React.Fragment>
                    <EditBaselineNameModal
                        baselineData={ baselineData }
                        modalOpened={ modalOpened }
                        toggleEditNameModal={ this.toggleEditNameModal }
                        error={ inlineError }
                    />
                    <PageHeader>
                        { this.renderBreadcrumb(baselineData, hasReadPermissions) }
                        <div id="edit-baseline-title">
                            { this.renderPageTitle(baselineData, hasReadPermissions, hasWritePermissions) }
                        </div>
                    </PageHeader>
                </React.Fragment>;
            } else {
                pageHeader = <PageHeader>
                    { this.renderBreadcrumb() }
                    <PageHeaderTitle title='Baseline' />
                </PageHeader>;
            }
        }

        return pageHeader;
    }

    renderHeaderRow(hasWritePermissions) {
        return (
            <tr key='edit-baseline-table-header'>
                { hasWritePermissions ? <th></th> : null }
                <th className="edit-baseline-header"><div>Fact</div></th>
                <th className="edit-baseline-header"><div>Value</div></th>
                <th></th>
            </tr>
        );
    }

    renderLoadingRows() {
        const { loadingColumns } = this.state;

        return <SkeletonTable
            columns={ loadingColumns }
            rowSize={ 8 }
            onSelect={ true }
            canSelectAll={ false }
            isSelectable={ true }
        />;
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

    onSelect = (isSelected, event) => {
        const { editBaselineTableData, selectFact } = this.props;
        let facts = [];
        let factData;
        let id = Number(event.target.name);

        editBaselineTableData.forEach(function(fact) {
            if (fact[FACT_ID] === id) {
                factData = fact;
            } else if (editBaselineHelpers.isCategory(fact)) {
                editBaselineHelpers.baselineSubFacts(fact).forEach(function(subFact) {
                    if (subFact[FACT_ID] === id) {
                        factData = subFact;
                    }
                });
            }
        });

        facts = [ factData[0] ];

        if (editBaselineHelpers.isCategory(factData)) {
            editBaselineHelpers.baselineSubFacts(factData).forEach(function(subFact) {
                facts.push(subFact[FACT_ID]);
            });
        }

        selectFact(facts, isSelected);
    }

    onBulkSelect = (isSelected) => {
        const { editBaselineTableData, selectFact } = this.props;
        let facts = [];

        editBaselineTableData.forEach(function(fact) {
            facts.push(fact[FACT_ID]);
            if (editBaselineHelpers.isCategory(fact)) {
                editBaselineHelpers.baselineSubFacts(fact).forEach(function(subFact) {
                    facts.push(subFact[FACT_ID]);
                });
            }
        });

        selectFact(facts, isSelected);
    }

    renderCheckbox = (fact) => {
        let id;

        if (editBaselineHelpers.isCategory(fact)) {
            id = 'category-' + fact[FACT_ID];
        } else if (typeof(fact[FACT_VALUE]) === 'string') {
            id = 'fact-' + fact[FACT_ID];
        }

        return (
            <Checkbox
                isChecked={ fact.selected }
                onChange={ this.onSelect }
                id={ id }
                name={ fact[FACT_ID] }
            />
        );
    }

    renderRowData(fact, hasWritePermissions) {
        const { expandedRows, baselineData } = this.props;
        let row = [];
        let rows = [];

        let factData = baselineData.baseline_facts.find((baselineFact) => {
            return baselineFact.name === fact[FACT_NAME];
        });

        hasWritePermissions
            ? row.push(<td
                className={ expandedRows.includes(fact[FACT_NAME]) ? 'pf-c-table__check nested-fact' : 'pf-c-table__check' }>
                { this.renderCheckbox(fact) }
            </td>)
            : null;

        if (editBaselineHelpers.isCategory(fact)) {
            row.push(<td>
                { this.renderExpandableRowButton(fact[FACT_NAME]) } { fact[FACT_NAME] }</td>);
            row.push(<td></td>);
            row.push(editBaselineHelpers.renderKebab({ factName: fact[FACT_NAME], factData, isCategory: true, hasWritePermissions }));
            rows.push(<tr key={ fact[FACT_NAME] }>{ row }</tr>);

            if (expandedRows.includes(fact[FACT_NAME])) {
                editBaselineHelpers.baselineSubFacts(fact).forEach((subFact) => {
                    row = [];
                    hasWritePermissions
                        ? row.push(<td className='pf-c-table__check nested-fact'>{ this.renderCheckbox(subFact) }</td>)
                        : null;
                    row.push(<td>
                        <p className="child-row">{ subFact[FACT_NAME] }</p>
                    </td>);
                    row.push(<td>{ subFact[FACT_VALUE] }</td>);
                    row.push(editBaselineHelpers.renderKebab({
                        factName: subFact[FACT_NAME],
                        factValue: subFact[FACT_VALUE],
                        factData,
                        isSubFact: true,
                        hasWritePermissions
                    }));
                    rows.push(<tr key={ subFact[FACT_NAME] }>{ row }</tr>);
                });
            }
        } else {
            row.push(<td>{ fact[FACT_NAME] }</td>);
            row.push(<td>{ fact[FACT_VALUE] }</td>);
            row.push(editBaselineHelpers.renderKebab({ factName: fact[FACT_NAME], factValue: fact[FACT_VALUE], factData, hasWritePermissions }));
            rows.push(<tr key={ fact[FACT_NAME] }>{ row }</tr>);
        }

        return rows;
    }

    renderRows(hasWritePermissions) {
        const { editBaselineTableData } = this.props;
        let facts = editBaselineTableData;
        let rows = [];
        let rowData = [];

        if (facts.length !== 0) {
            for (let i = 0; i < facts.length; i += 1) {
                rowData = this.renderRowData(facts[i], hasWritePermissions);
                rows.push(rowData);
            }
        }

        return rows;
    }

    renderEmptyState(hasWritePermissions) {
        const { editBaselineEmptyState, editBaselineError } = this.props;
        const { errorMessage } = this.state;

        if (editBaselineError.status !== 200 && editBaselineError.status !== undefined) {
            return <EmptyStateDisplay
                icon={ ExclamationCircleIcon }
                color='#c9190b'
                title={ 'Baseline cannot be displayed' }
                text={ errorMessage }
                error={ 'Error ' + editBaselineError.status + ': ' + editBaselineError.detail }
                button={ <a onClick={ () => this.retryBaselineFetch() }>
                    <UndoIcon className='reload-button' />
                        Retry
                </a> }
            />;
        } else {
            return <EmptyStateDisplay
                title={ 'No facts' }
                text={ [ 'No facts or categories have been added to this baseline yet.' ] }
                button={ <AddFactButton
                    hasWritePermissions={ hasWritePermissions }
                    editBaselineEmptyState={ editBaselineEmptyState }
                /> }
            />;
        }
    }

    renderTable(hasWritePermissions) {
        return (
            <table className="pf-c-table ins-c-table pf-m-grid-md ins-entity-table">
                <thead>
                    { this.renderHeaderRow(hasWritePermissions) }
                </thead>
                <tbody key='edit-baseline-table'>
                    { this.renderRows(hasWritePermissions) }
                </tbody>
            </table>
        );
    }

    render() {
        const { baselineData, baselineDataLoading, editBaselineTableData, exportToCSV, factModalOpened,
            editBaselineEmptyState, editBaselineError, clearErrorData } = this.props;
        let selected = editBaselineHelpers.findSelected(editBaselineTableData);

        return (
            <PermissionContext.Consumer>
                { value =>
                    <React.Fragment>
                        { this.renderPageHeader(value.permissions.baselinesRead, value.permissions.baselinesWrite) }
                        <Main>
                            { value.permissions.baselinesRead === false
                                ? <EmptyStateDisplay
                                    icon={ LockIcon }
                                    color='#6a6e73'
                                    title={ 'You do not have access to view this Baseline' }
                                    text={ [ 'Contact your organization administrator(s) for more information.' ] }
                                />
                                : <React.Fragment>
                                    { factModalOpened
                                        ? <FactModal />
                                        : <div></div>
                                    }
                                    <ErrorAlert
                                        error={ !editBaselineEmptyState && editBaselineError.status ? editBaselineError : {} }
                                        onClose={ clearErrorData }
                                    />
                                    { editBaselineEmptyState
                                        ? this.renderEmptyState(value.permissions.baselinesWrite)
                                        : <Card className='pf-t-light pf-m-opaque-100'>
                                            <CardBody>
                                                <EditBaselineToolbar
                                                    selected={ selected }
                                                    onBulkSelect={ this.onBulkSelect }
                                                    isDisabled={ editBaselineTableData.length === 0 || !value.permissions.baselinesWrite }
                                                    totalFacts={ editBaselineHelpers.findFactCount(editBaselineTableData) }
                                                    baselineData={ baselineData }
                                                    exportToCSV={ exportToCSV }
                                                    tableData={ editBaselineTableData }
                                                    hasWritePermissions={ value.permissions.baselinesWrite }
                                                />
                                                { baselineDataLoading
                                                    ? this.renderLoadingRows()
                                                    : this.renderTable(value.permissions.baselinesWrite)
                                                }
                                            </CardBody>
                                        </Card>
                                    }
                                </React.Fragment>
                            }
                        </Main>
                    </React.Fragment>
                }
            </PermissionContext.Consumer>
        );
    }
}

EditBaseline.propTypes = {
    history: PropTypes.object,
    match: PropTypes.any,
    clearBaselineData: PropTypes.func,
    baselineData: PropTypes.object,
    baselineDataLoading: PropTypes.bool,
    fetchBaselineData: PropTypes.func,
    factModalOpened: PropTypes.bool,
    editBaselineTableData: PropTypes.array,
    expandRow: PropTypes.func,
    expandedRows: PropTypes.array,
    selectFact: PropTypes.func,
    clearErrorData: PropTypes.func,
    editBaselineError: PropTypes.object,
    inlineError: PropTypes.object,
    editBaselineEmptyState: PropTypes.bool,
    exportToCSV: PropTypes.func,
    hasWritePermissions: PropTypes.bool,
    fetchBaselines: PropTypes.func
};

function mapStateToProps(state) {
    return {
        baselineData: state.editBaselineState.baselineData,
        baselineDataLoading: state.editBaselineState.baselineDataLoading,
        factModalOpened: state.editBaselineState.factModalOpened,
        editBaselineTableData: state.editBaselineState.editBaselineTableData,
        expandedRows: state.editBaselineState.expandedRows,
        editBaselineError: state.editBaselineState.editBaselineError,
        editBaselineEmptyState: state.editBaselineState.editBaselineEmptyState,
        inlineError: state.editBaselineState.inlineError
    };
}

function mapDispatchToProps(dispatch) {
    return {
        clearBaselineData: (tableId) => dispatch(baselinesTableActions.clearBaselineData(tableId)),
        expandRow: (factName) => dispatch(editBaselineActions.expandRow(factName)),
        fetchBaselineData: (baselineUUID) => dispatch(editBaselineActions.fetchBaselineData(baselineUUID)),
        selectFact: (facts, isSelected) => dispatch(editBaselineActions.selectFact(facts, isSelected)),
        clearErrorData: () => dispatch(editBaselineActions.clearErrorData()),
        exportToCSV: (exportData, baselineRowData)=> {
            dispatch(editBaselineActions.exportToCSV(exportData, baselineRowData));
        },
        fetchBaselines: (tableId, params) => dispatch(baselinesTableActions.fetchBaselines(tableId, params))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditBaseline));
