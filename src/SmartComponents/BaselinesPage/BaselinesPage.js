import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Card, CardBody } from '@patternfly/react-core';
import { AddCircleOIcon, ExclamationCircleIcon, LockIcon, UndoIcon } from '@patternfly/react-icons';
import { sortable } from '@patternfly/react-table';

import BaselinesTable from '../BaselinesTable/BaselinesTable';
import CreateBaselineButton from './CreateBaselineButton/CreateBaselineButton';
import CreateBaselineModal from './CreateBaselineModal/CreateBaselineModal';
import EmptyStateDisplay from '../EmptyStateDisplay/EmptyStateDisplay';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import { baselinesTableActions } from '../BaselinesTable/redux';
import { editBaselineActions } from './EditBaseline/redux';
import { PermissionContext } from '../../App';

export class BaselinesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Name', transforms: [ sortable ]},
                { title: 'Last updated', transforms: [ sortable ]},
                { title: '' }
            ],
            emptyStateMessage: [
                'You currently have no baselines displayed.',
                'Create a baseline to use in your Comparison analysis.'
            ],
            errorMessage: [ 'The list of baselines cannot be displayed at this time. Please retry and if',
                'the problem persists contact your system administrator.',
                ''
            ]
        };
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
    }

    fetchBaseline = (baselineId) => {
        const { history } = this.props;

        history.push('baselines/' + baselineId);
    }

    onSelect = (event, isSelected, rowId) => {
        const { baselineTableData, selectBaseline } = this.props;
        let ids;

        if (rowId === -1) {
            ids = baselineTableData.map(function(item) {
                return item[0];
            });
        } else {
            ids = [ baselineTableData[rowId][0] ];
        }

        selectBaseline(ids, isSelected, 'CHECKBOX');
    }

    onBulkSelect = (isSelected) => {
        const { baselineTableData, selectBaseline } = this.props;
        let ids = [];

        baselineTableData.forEach(function(baseline) {
            ids.push(baseline[0]);
        });

        selectBaseline(ids, isSelected, 'CHECKBOX');
    }

    renderTable(hasReadPermissions, hasWritePermissions) {
        const { baselineTableData, loading, createBaselineModalOpened, clearEditBaselineData, selectedBaselineIds,
            totalBaselines } = this.props;
        const { columns } = this.state;

        clearEditBaselineData();

        return (
            <CardBody>
                <div>
                    <BaselinesTable
                        tableId='CHECKBOX'
                        hasMultiSelect={ true }
                        onSelect={ this.onSelect }
                        tableData={ baselineTableData }
                        loading={ loading }
                        columns={ columns }
                        kebab={ true }
                        createButton={ true }
                        exportButton={ true }
                        onClick={ this.fetchBaseline }
                        createBaselineModalOpened={ createBaselineModalOpened }
                        onBulkSelect={ this.onBulkSelect }
                        selectedBaselineIds={ selectedBaselineIds }
                        totalBaselines={ totalBaselines }
                        hasReadPermissions={ hasReadPermissions }
                        hasWritePermissions={ hasWritePermissions }
                    />
                </div>
            </CardBody>
        );
    }

    renderEmptyState = (hasBaselinesWritePermissions) => {
        const { baselineError, emptyState, loading, revertBaselineFetch } = this.props;
        const { emptyStateMessage, errorMessage } = this.state;

        if (!baselineError.status) {
            return <EmptyStateDisplay
                icon={ AddCircleOIcon }
                title={ 'No baselines' }
                text={ emptyStateMessage }
                button={ <CreateBaselineButton
                    emptyState={ emptyState }
                    hasWritePermissions={ hasBaselinesWritePermissions }
                    loading={ loading } />
                }
            />;
        } else if (baselineError.status !== 200 && baselineError.status !== undefined) {
            return <EmptyStateDisplay
                icon={ ExclamationCircleIcon }
                color='#c9190b'
                title={ 'Baselines cannot be displayed' }
                text={ errorMessage }
                error={
                    'Error ' + baselineError.status + ': ' + baselineError.detail
                }
                button={
                    <a onClick={ () => revertBaselineFetch('CHECKBOX') }>
                        <UndoIcon className='reload-button' />
                        Retry
                    </a>
                }
            />;
        }
    }

    render() {
        const { baselineError, emptyState, loading, revertBaselineFetch } = this.props;

        return (
            <PermissionContext.Consumer>
                { value =>
                    <React.Fragment>
                        <CreateBaselineModal
                            hasInventoryReadPermissions={ value.permissions.inventoryRead }
                            hasReadPermissions={ value.permissions.baselinesRead }
                            hasWritePermissions={ value.permissions.baselinesWrite }
                        />
                        <PageHeader>
                            <PageHeaderTitle title='Baselines'/>
                        </PageHeader>
                        <Main>
                            { value.permissions.baselinesRead === false
                                ? <EmptyStateDisplay
                                    icon={ LockIcon }
                                    color='#6a6e73'
                                    title={ 'You do not have access to Baselines' }
                                    text={ [ 'Contact your organization administrator(s) for more information.' ] }
                                />
                                : emptyState && !loading
                                    ? this.renderEmptyState(value.permissions.baselinesWrite)
                                    : <React.Fragment>
                                        <ErrorAlert
                                            error={ !emptyState && baselineError ? baselineError : {} }
                                            onClose={ revertBaselineFetch }
                                            tableId={ 'CHECKBOX' }
                                        />
                                        <Card className='pf-t-light pf-m-opaque-100'>
                                            {
                                                this.renderTable(value.permissions.baselinesRead, value.permissions.baselinesWrite)
                                            }
                                        </Card>
                                    </React.Fragment>
                            }
                        </Main>
                    </React.Fragment>
                }
            </PermissionContext.Consumer>
        );
    }
}

BaselinesPage.propTypes = {
    loading: PropTypes.bool,
    baselineTableData: PropTypes.array,
    emptyState: PropTypes.bool,
    createBaselineModalOpened: PropTypes.bool,
    selectBaseline: PropTypes.func,
    history: PropTypes.object,
    baselineError: PropTypes.object,
    revertBaselineFetch: PropTypes.func,
    clearEditBaselineData: PropTypes.func,
    selectedBaselineIds: PropTypes.array,
    totalBaselines: PropTypes.number
};

function mapStateToProps(state) {
    return {
        loading: state.baselinesTableState.checkboxTable.loading,
        emptyState: state.baselinesTableState.checkboxTable.emptyState,
        baselineTableData: state.baselinesTableState.checkboxTable.baselineTableData,
        createBaselineModalOpened: state.createBaselineModalState.createBaselineModalOpened,
        baselineError: state.baselinesTableState.checkboxTable.baselineError,
        selectedBaselineIds: state.baselinesTableState.checkboxTable.selectedBaselineIds,
        totalBaselines: state.baselinesTableState.checkboxTable.totalBaselines
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectBaseline: (id, isSelected, tableId) => dispatch(baselinesTableActions.selectBaseline(id, isSelected, tableId)),
        revertBaselineFetch: (tableId) => dispatch(baselinesTableActions.revertBaselineFetch(tableId)),
        clearEditBaselineData: () => dispatch(editBaselineActions.clearEditBaselineData())
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BaselinesPage));
