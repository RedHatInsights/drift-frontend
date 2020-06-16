import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Checkbox, BreadcrumbHeading } from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { AngleDownIcon, AngleRightIcon, EditAltIcon } from '@patternfly/react-icons';

import EditBaselineToolbar from './EditBaselineToolbar/EditBaselineToolbar';
import FactModal from './FactModal/FactModal';
import EditBaselineNameModal from './EditBaselineNameModal/EditBaselineNameModal';
import AddFactButton from './AddFactButton/AddFactButton';
import { baselinesTableActions } from '../../BaselinesTable/redux';
import { editBaselineActions } from './redux';
import editBaselineHelpers from './helpers';
import { FACT_ID, FACT_NAME, FACT_VALUE } from '../../../constants';
import EmptyStateDisplay from '../../EmptyStateDisplay/EmptyStateDisplay';

export class EditBaseline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpened: false
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
        await window.insights.chrome.auth.getUser();
    }

    fetchBaselineId() {
        const { match: { params }, fetchBaselineData } = this.props;

        fetchBaselineData(params.id);
    }

    goToBaselinesList() {
        const { history, clearBaselineData } = this.props;

        clearBaselineData('CHECKBOX');
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
            <BreadcrumbHeading>{ baselineData.display_name }</BreadcrumbHeading>
        </Breadcrumb>;
        /*eslint-enable camelcase*/

        return breadcrumb;
    }

    renderHeaderRow() {
        return (
            <tr key='edit-baseline-table-header'>
                <th></th>
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

    renderRowData(fact) {
        const { expandedRows, baselineData } = this.props;
        let row = [];
        let rows = [];

        let factData = baselineData.baseline_facts.find((baselineFact) => {
            return baselineFact.name === fact[FACT_NAME];
        });

        row.push(<td
            className={ expandedRows.includes(fact[FACT_NAME]) ? 'pf-c-table__check nested-fact' : 'pf-c-table__check' }>
            { this.renderCheckbox(fact) }
        </td>);

        if (editBaselineHelpers.isCategory(fact)) {
            row.push(<td>
                { this.renderExpandableRowButton(fact[FACT_NAME]) } { fact[FACT_NAME] }</td>);
            row.push(<td></td>);
            row.push(editBaselineHelpers.renderKebab({ factName: fact[FACT_NAME], factData, isCategory: true }));
            rows.push(<tr key={ fact[FACT_NAME] }>{ row }</tr>);

            if (expandedRows.includes(fact[FACT_NAME])) {
                editBaselineHelpers.baselineSubFacts(fact).forEach((subFact) => {
                    row = [];
                    row.push(<td className='pf-c-table__check nested-fact'>{ this.renderCheckbox(subFact) }</td>);
                    row.push(<td>
                        <p className="child-row">{ subFact[FACT_NAME] }</p>
                    </td>);
                    row.push(<td>{ subFact[FACT_VALUE] }</td>);
                    row.push(editBaselineHelpers.renderKebab({
                        factName: subFact[FACT_NAME],
                        factValue: subFact[FACT_VALUE],
                        factData,
                        isSubFact: true
                    }));
                    rows.push(<tr key={ subFact[FACT_NAME] }>{ row }</tr>);
                });
            }
        } else {
            row.push(<td>{ fact[FACT_NAME] }</td>);
            row.push(<td>{ fact[FACT_VALUE] }</td>);
            row.push(editBaselineHelpers.renderKebab({ factName: fact[FACT_NAME], factValue: fact[FACT_VALUE], factData }));
            rows.push(<tr key={ fact[FACT_NAME] }>{ row }</tr>);
        }

        return rows;
    }

    renderRows() {
        const { editBaselineTableData } = this.props;
        let facts = editBaselineTableData;
        let rows = [];
        let rowData = [];

        if (facts.length !== 0) {
            for (let i = 0; i < facts.length; i += 1) {
                rowData = this.renderRowData(facts[i]);
                rows.push(rowData);
            }
        } else {
            rows =
                <td colSpan='3'>
                    <EmptyStateDisplay
                        title={ 'No facts' }
                        text={ [ 'No facts or categories have been added to this baseline yet.' ] }
                        button={ <AddFactButton /> }
                    />
                </td>;
        }

        return rows;
    }

    renderTable() {
        const { baselineData } = this.props;

        return (
            <table className="pf-c-table ins-c-table pf-m-grid-md ins-entity-table drift-table">
                <thead>
                    { this.renderHeaderRow() }
                </thead>
                <tbody key='edit-baseline-table'>
                    { baselineData !== undefined
                        ? this.renderRows()
                        : this.renderLoadingRows()
                    }
                </tbody>
            </table>
        );
    }

    render() {
        const { modalOpened } = this.state;
        const { baselineData, baselineDataLoading, editBaselineTableData, factModalOpened, error } = this.props;
        let selected = editBaselineHelpers.findSelected(editBaselineTableData);

        return (
            <React.Fragment>
                { baselineData !== undefined && !baselineDataLoading
                    ? <React.Fragment>
                        <EditBaselineNameModal
                            baselineData={ baselineData }
                            modalOpened={ modalOpened }
                            toggleEditNameModal={ this.toggleEditNameModal }
                            error={ error }
                        />
                        <PageHeader>
                            { this.renderBreadcrumb() }
                            <PageHeaderTitle title={ baselineData ? baselineData.display_name : '' }/>
                            <EditAltIcon className='pointer not-active edit-icon-margin' onClick={ () => this.toggleEditNameModal() } />
                        </PageHeader>
                    </React.Fragment>
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
                            <EditBaselineToolbar
                                selected={ selected }
                                onBulkSelect={ this.onBulkSelect }
                                isDisabled={ editBaselineTableData.length === 0 }
                                totalFacts={ editBaselineHelpers.findFactCount(editBaselineTableData) }
                            />
                            { this.renderTable() }
                        </CardBody>
                    </Card>
                </Main>
            </React.Fragment>
        );
    }
}

EditBaseline.propTypes = {
    history: PropTypes.object,
    match: PropTypes.any,
    clearBaselineData: PropTypes.func,
    baselineData: PropTypes.array,
    baselineDataLoading: PropTypes.bool,
    fetchBaselineData: PropTypes.func,
    factModalOpened: PropTypes.bool,
    editBaselineTableData: PropTypes.array,
    expandRow: PropTypes.func,
    expandedRows: PropTypes.array,
    selectFact: PropTypes.func,
    clearErrorData: PropTypes.func,
    error: PropTypes.object
};

function mapStateToProps(state) {
    return {
        baselineData: state.editBaselineState.baselineData,
        baselineDataLoading: state.editBaselineState.baselineDataLoading,
        factModalOpened: state.editBaselineState.factModalOpened,
        editBaselineTableData: state.editBaselineState.editBaselineTableData,
        expandedRows: state.editBaselineState.expandedRows,
        error: state.editBaselineState.error
    };
}

function mapDispatchToProps(dispatch) {
    return {
        clearBaselineData: (tableId) => dispatch(baselinesTableActions.clearBaselineData(tableId)),
        expandRow: (factName) => dispatch(editBaselineActions.expandRow(factName)),
        fetchBaselineData: (baselineUUID) => dispatch(editBaselineActions.fetchBaselineData(baselineUUID)),
        selectFact: (facts, isSelected) => dispatch(editBaselineActions.selectFact(facts, isSelected)),
        clearErrorData: () => dispatch(editBaselineActions.clearErrorData())
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditBaseline));
