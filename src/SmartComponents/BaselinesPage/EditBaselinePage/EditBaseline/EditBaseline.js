import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Card, CardBody, Checkbox } from '@patternfly/react-core';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components';
import { AngleDownIcon, AngleRightIcon, ExclamationCircleIcon, UndoIcon } from '@patternfly/react-icons';
import { cellWidth } from '@patternfly/react-table';

import EditBaselineToolbar from '../EditBaselineToolbar/EditBaselineToolbar';
import ErrorAlert from '../../../ErrorAlert/ErrorAlert';
import FactModal from '../FactModal/FactModal';
import AddFactButton from '../AddFactButton/AddFactButton';
import editBaselineHelpers from './helpers';
import { FACT_ID, FACT_NAME, FACT_VALUE } from '../../../../constants';
import EmptyStateDisplay from '../../../EmptyStateDisplay/EmptyStateDisplay';

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
    }

    retryBaselineFetch = () => {
        const { clearErrorData } = this.props;

        clearErrorData();
        this.fetchBaselineId();
    }

    renderHeaderRow(hasWritePermissions) {
        return (
            <tr
                key='edit-baseline-table-header'
                data-ouia-component-type='PF4/TableHeaderRow'
                data-ouia-component-id='edit-baseline-table-header-row'>
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
            expandIcon = <AngleDownIcon
                className="pointer active-blue"
                data-ouia-component-type='PF4/Button'
                data-ouia-component-id={ 'expand-category-button-' + factName }
                onClick={ () => this.props.expandRow(factName) } />;
        } else {
            expandIcon = <AngleRightIcon
                className="pointer"
                data-ouia-component-type='PF4/Button'
                data-ouia-component-id={ 'expand-category-button-' + factName }
                onClick={ () => this.props.expandRow(factName) } />;
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
                data-ouia-component-type='PF4/Checkbox'
                data-ouia-component-id={ 'checkbox-' + fact[FACT_NAME] }
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
            rows.push(<tr
                data-ouia-component-type='PF4/TableRow'
                data-ouia-component-id={ 'edit-baseline-table-row-' + factData?.name }
                key={ fact[FACT_NAME] }>{ row }</tr>);

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
                    rows.push(<tr
                        data-ouia-component-type='PF4/TableRow'
                        data-ouia-component-id={ 'edit-baseline-table-row-' + subFact[FACT_NAME] }
                        category={ factData?.name }
                        key={ subFact[FACT_NAME] }>{ row }</tr>);
                });
            }
        } else {
            row.push(<td>{ fact[FACT_NAME] }</td>);
            row.push(<td>{ fact[FACT_VALUE] }</td>);
            row.push(editBaselineHelpers.renderKebab({ factName: fact[FACT_NAME], factValue: fact[FACT_VALUE], factData, hasWritePermissions }));
            rows.push(<tr
                data-ouia-component-type='PF4/TableRow'
                data-ouia-component-id={ 'edit-baseline-table-row-' + factData?.name }
                key={ fact[FACT_NAME] }>{ row }</tr>);
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
            editBaselineEmptyState, editBaselineError, clearErrorData, hasWritePermissions } = this.props;
        let selected = editBaselineHelpers.findSelected(editBaselineTableData);

        return (
            <React.Fragment>
                { factModalOpened
                    ? <FactModal />
                    : <div></div>
                }
                <ErrorAlert
                    error={ !editBaselineEmptyState && editBaselineError.status ? editBaselineError : {} }
                    onClose={ clearErrorData }
                />
                { editBaselineEmptyState
                    ? this.renderEmptyState(hasWritePermissions)
                    : <Card className='pf-t-light pf-m-opaque-100'>
                        <CardBody>
                            <EditBaselineToolbar
                                selected={ selected }
                                onBulkSelect={ this.onBulkSelect }
                                isDisabled={ editBaselineTableData.length === 0 || !hasWritePermissions }
                                totalFacts={ editBaselineHelpers.findFactCount(editBaselineTableData) }
                                baselineData={ baselineData }
                                exportToCSV={ exportToCSV }
                                tableData={ editBaselineTableData }
                                hasWritePermissions={ hasWritePermissions }
                            />
                            { baselineDataLoading
                                ? this.renderLoadingRows()
                                : this.renderTable(hasWritePermissions)
                            }
                        </CardBody>
                    </Card>
                }
            </React.Fragment>
        );
    }
}

EditBaseline.propTypes = {
    history: PropTypes.object,
    match: PropTypes.any,
    baselineData: PropTypes.object,
    baselineDataLoading: PropTypes.bool,
    factModalOpened: PropTypes.bool,
    editBaselineTableData: PropTypes.array,
    expandRow: PropTypes.func,
    expandedRows: PropTypes.array,
    selectFact: PropTypes.func,
    clearErrorData: PropTypes.func,
    editBaselineError: PropTypes.object,
    editBaselineEmptyState: PropTypes.bool,
    exportToCSV: PropTypes.func,
    hasWritePermissions: PropTypes.bool
};

export default EditBaseline;
