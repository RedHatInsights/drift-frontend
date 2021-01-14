import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Card, CardBody, Toolbar, ToolbarGroup, ToolbarItem, PaginationVariant } from '@patternfly/react-core';
import { ExclamationCircleIcon, LockIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { baselinesTableActions } from '../BaselinesTable/redux';
import { compareActions } from '../modules';
import { historicProfilesActions } from '../HistoricalProfilesPopover/redux';
import { setHistory } from '../../Utilities/SetHistory';

import DriftTable from './DriftTable/DriftTable';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import TablePagination from '../Pagination/Pagination';
import AddSystemButton from './AddSystemButton/AddSystemButton';
import DriftToolbar from './DriftToolbar/DriftToolbar';
import EmptyStateDisplay from '../EmptyStateDisplay/EmptyStateDisplay';
import { PermissionContext } from '../../App';

export class DriftPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emptyStateMessage: [
                'You currently have no system or baselines displayed. Add at least two',
                'systems or baselines to compare their facts.'
            ],
            isFirstReference: true
        };

        this.props.clearSelectedBaselines('CHECKBOX');
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
    }

    setIsFirstReference = (value) => {
        this.setState({
            isFirstReference: value
        });
    }

    onClose = () => {
        const { revertCompareData, history, previousStateSystems } = this.props;

        revertCompareData();
        setHistory(history, previousStateSystems.map(system => system.id));
    }

    renderEmptyState = () => {
        const { emptyStateMessage } = this.state;
        const { error } = this.props;

        if (error.status) {
            return <EmptyStateDisplay
                icon={ ExclamationCircleIcon }
                color='#c9190b'
                title={ 'Comparison cannot be displayed' }
                text={ emptyStateMessage }
                error={ 'Error ' + error.status + ': ' + error.detail }
                button={ <AddSystemButton isTable={ false }/> }
            />;
        } else {
            return <EmptyStateDisplay
                icon={ PlusCircleIcon }
                color='#6a6e73'
                title={ 'Add systems or baselines to compare' }
                text={ emptyStateMessage }
                button={ <AddSystemButton isTable={ false }/> }
            />;
        }
    }

    render() {
        const { addStateFilter, clearComparison, clearComparisonFilters, clearSelectedBaselines, emptyState, error, exportToCSV, factFilter,
            filterByFact, history, loading, page, perPage, stateFilters, totalFacts, updatePagination, updateReferenceId } = this.props;
        const { isFirstReference } = this.state;

        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='Comparison'/>
                </PageHeader>
                <Main>
                    <PermissionContext.Consumer>
                        { value =>
                            value.permissions.compareRead === false
                                ? <EmptyStateDisplay
                                    icon={ LockIcon }
                                    color='#6a6e73'
                                    title={ 'You do not have access to Drift comparison' }
                                    text={ [ 'Contact your organization administrator(s) for more information.' ] }
                                />
                                : <React.Fragment>
                                    <ErrorAlert
                                        error={ error }
                                        onClose={ this.onClose }
                                    />
                                    { emptyState && !loading
                                        ? this.renderEmptyState()
                                        : <div></div>
                                    }
                                    <Card className='pf-t-light pf-m-opaque-100'>
                                        <CardBody>
                                            <div>
                                                { !emptyState
                                                    ? <DriftToolbar
                                                        loading={ loading }
                                                        history={ history }
                                                        page={ page }
                                                        perPage={ perPage }
                                                        totalFacts={ totalFacts }
                                                        updatePagination={ updatePagination }
                                                        clearComparison={ clearComparison }
                                                        clearComparisonFilters={ clearComparisonFilters }
                                                        exportToCSV={ exportToCSV }
                                                        updateReferenceId={ updateReferenceId }
                                                        setIsFirstReference={ this.setIsFirstReference }
                                                        clearSelectedBaselines={ clearSelectedBaselines }
                                                        factFilter={ factFilter }
                                                        filterByFact={ filterByFact }
                                                        stateFilters={ stateFilters }
                                                        addStateFilter={ addStateFilter }
                                                    />
                                                    : null
                                                }
                                                <DriftTable
                                                    updateReferenceId={ updateReferenceId }
                                                    error={ error }
                                                    isFirstReference={ isFirstReference }
                                                    setIsFirstReference={ this.setIsFirstReference }
                                                    clearComparison= { clearComparison }
                                                    hasBaselinesReadPermissions={ value.permissions.baselinesRead }
                                                    hasBaselinesWritePermissions={ value.permissions.baselinesWrite }
                                                    hasInventoryReadPermissions={ value.permissions.inventoryRead }
                                                />
                                                { !emptyState && !loading ?
                                                    <Toolbar className="drift-toolbar">
                                                        <ToolbarGroup className="pf-c-pagination">
                                                            <ToolbarItem>
                                                                <TablePagination
                                                                    page={ page }
                                                                    perPage={ perPage }
                                                                    total={ totalFacts }
                                                                    isCompact={ false }
                                                                    updatePagination={ updatePagination }
                                                                    widgetId='drift-pagination-bottom'
                                                                    variant={ PaginationVariant.bottom }
                                                                />
                                                            </ToolbarItem>
                                                        </ToolbarGroup>
                                                    </Toolbar>
                                                    : null
                                                }
                                            </div>
                                        </CardBody>
                                    </Card>
                                </React.Fragment>
                        }
                    </PermissionContext.Consumer>
                </Main>
            </React.Fragment>
        );
    }
}

DriftPage.propTypes = {
    perPage: PropTypes.number,
    page: PropTypes.number,
    totalFacts: PropTypes.number,
    error: PropTypes.object,
    loading: PropTypes.bool,
    clearSelectedBaselines: PropTypes.func,
    emptyState: PropTypes.bool,
    updatePagination: PropTypes.func,
    updateReferenceId: PropTypes.func,
    clearComparison: PropTypes.func,
    clearComparisonFilters: PropTypes.func,
    history: PropTypes.object,
    selectHistoricProfiles: PropTypes.func,
    selectedHSPIds: PropTypes.array,
    revertCompareData: PropTypes.func,
    previousStateSystems: PropTypes.array,
    exportToCSV: PropTypes.func,
    factFilter: PropTypes.string,
    filterByFact: PropTypes.func,
    stateFilters: PropTypes.array,
    addStateFilter: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        clearSelectedBaselines: (tableId) => dispatch(baselinesTableActions.clearSelectedBaselines(tableId)),
        updatePagination: (pagination) => dispatch(compareActions.updatePagination(pagination)),
        updateReferenceId: (id) => dispatch(compareActions.updateReferenceId(id)),
        clearComparison: () => dispatch(compareActions.clearComparison()),
        clearComparisonFilters: () => dispatch(compareActions.clearComparisonFilters()),
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds)),
        revertCompareData: () => dispatch(compareActions.revertCompareData()),
        exportToCSV: () => dispatch(compareActions.exportToCSV()),
        filterByFact: (filter) => dispatch(compareActions.filterByFact(filter)),
        addStateFilter: (filter) => dispatch(compareActions.addStateFilter(filter))
    };
}

function mapStateToProps(state) {
    return {
        page: state.compareState.page,
        perPage: state.compareState.perPage,
        totalFacts: state.compareState.totalFacts,
        error: state.compareState.error,
        loading: state.compareState.loading,
        emptyState: state.compareState.emptyState,
        selectedHSPIds: state.historicProfilesState.selectedHSPIds,
        previousStateSystems: state.compareState.previousStateSystems,
        factFilter: state.compareState.factFilter,
        stateFilters: state.compareState.stateFilters
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DriftPage));
