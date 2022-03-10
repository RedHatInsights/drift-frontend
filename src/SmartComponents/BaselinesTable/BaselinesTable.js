import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RowSelectVariant, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { EmptyTable, SkeletonTable } from '@redhat-cloud-services/frontend-components';
import { Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { LockIcon, UndoIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import _ from 'lodash';

import BaselineTableKebab from './BaselineTableKebab/BaselineTableKebab';
import { baselinesTableActions } from './redux';
import { editBaselineActions } from '../BaselinesPage/EditBaselinePage/redux';
import baselinesReducerHelpers from './redux/helpers';
import BaselinesToolbar from './BaselinesToolbar/BaselinesToolbar';
import EmptyStateDisplay from '../EmptyStateDisplay/EmptyStateDisplay';
import TablePagination from '../Pagination/Pagination';
import NotificationDetails from './NotificationDetails/NotificationDetails';
import { AddCircleOIcon } from '@patternfly/react-icons';
import CreateBaselineButton from '../BaselinesPage/CreateBaselineButton/CreateBaselineButton';
import { Card } from '@patternfly/react-core';

import { EMPTY_BASELINES_TITLE, EMPTY_BASELINES_MESSAGE,
    EMPTY_BASELINES_FILTER_TITLE, EMPTY_FILTER_MESSAGE } from '../../constants';

export class BaselinesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sortBy: {
                index: 1,
                direction: 'asc'
            },
            search: undefined,
            orderBy: 'display_name',
            orderHow: 'ASC',
            page: 1,
            perPage: 20
        };
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
        await this.fetchWithParams();
    }

    async componentDidUpdate(prevProps) {
        if (!_.isEmpty(prevProps.baselineError) && _.isEmpty(this.props.baselineError))
        { this.fetchWithParams();
        }
    }
    fetchWithParams = (fetchParams) => {
        const { tableId, fetchBaselines } = this.props;

        fetchParams = {
            ...this.state,
            ...fetchParams
        };

        baselinesReducerHelpers.fetchBaselines(tableId, fetchBaselines, fetchParams);
    }

    onSearch = (search) => {
        const { orderBy, orderHow } = this.state;

        let newSearch = search;
        this.setState({ search });
        this.fetchWithParams({ orderBy, orderHow, search: newSearch });
    }

    onSort = (_event, index, direction) => {
        const { search } = this.state;
        const { permissions } = this.props;
        let orderBy = '';

        if (index === 0) {
            orderBy = 'display_name';
        } else if (index === 1) {
            orderBy = !permissions.baselinesWrite ? 'updated' : 'display_name';
        } else if (index === 2) {
            orderBy = 'updated';
        }

        this.setState({
            sortBy: {
                index,
                direction
            },
            orderHow: direction.toUpperCase(),
            orderBy
        });

        this.fetchWithParams({ orderBy, orderHow: direction.toUpperCase(), search });
    }

    updatePagination = (pagination) => {
        this.setState({ page: pagination.page, perPage: pagination.perPage });
        this.fetchWithParams({ page: pagination.page, perPage: pagination.perPage });
    }

    renderRows(baselinesWrite) {
        const { basketIsVisible, hasMultiSelect, hasSwitch, tableData, kebab, onClick, notificationsSwitchError,
            selectedBaselineIds, toggleNotificationPending, toggleNotificationFulfilled, toggleNotificationRejected,
            tableId } = this.props;
        let table = [];

        tableData.forEach((baseline, index) => {
            let row = [];

            if (onClick) {
                let link = <div>
                    <a
                        className="pointer active-blue"
                        data-ouia-component-type='PF4/Button'
                        data-ouia-component-id={ 'baseline-details-' + baseline[1] }
                        onClick={ () => onClick(baseline[0]) }
                    >
                        { baseline[1] }
                    </a>
                </div>;
                row.push(link);
            } else {
                row.push(baseline[1]);
            }

            row.push(baseline[2]);
            /*eslint-disable camelcase*/
            row.push(<div className='no-left-padding'>
                <NotificationDetails
                    classname='sm-padding-right'
                    index={ index }
                    badgeCount={ baseline[3] }
                    hasBadge={ true }
                    hasSwitch={ hasSwitch }
                    baselineData={{
                        id: baseline[0],
                        display_name: baseline[1],
                        associated_systems: baseline[3],
                        notifications_enabled: baseline[4]
                    }}
                    notificationsSwitchError={ notificationsSwitchError }
                    toggleNotificationPending={ toggleNotificationPending }
                    toggleNotificationFulfilled={ toggleNotificationFulfilled }
                    toggleNotificationRejected={ toggleNotificationRejected }
                />
            </div>);
            /*eslint-enable camelcase*/

            if (kebab && baselinesWrite) {
                let kebab = <BaselineTableKebab
                    tableId={ tableId }
                    baselineRowData={ baseline }
                    fetchWithParams={ this.fetchWithParams }
                    baselineName={ baseline[1] }
                    selectedBaselineIds={ selectedBaselineIds }
                />;
                row.push(<div>{ kebab }</div>);
            }

            if (baseline.selected) {
                row.selected = true;
            }

            if (hasMultiSelect) {
                row.disableSelection = basketIsVisible;
            }

            table.push(row);
        });

        return table;
    }

    renderTable({ baselinesWrite, baselinesRead }) {
        const { columns, createButton, emptyState, hasMultiSelect, kebab, loading, onSelect, tableData, tableId } = this.props;
        let tableRows = [];
        let table;
        let emptyRow;

        if (!loading) {
            if (tableData.length === 0) {
                if (emptyState) {
                    emptyRow = <EmptyTable>
                        <EmptyStateDisplay
                            title={ EMPTY_BASELINES_TITLE }
                            text={ EMPTY_BASELINES_MESSAGE }
                        />
                    </EmptyTable>;
                } else {
                    emptyRow = <EmptyTable>
                        <EmptyStateDisplay
                            title={ EMPTY_BASELINES_FILTER_TITLE }
                            text={ EMPTY_FILTER_MESSAGE }
                        />
                    </EmptyTable>;
                }

                tableRows.push({
                    cells: [{
                        title: emptyRow,
                        props: { colSpan: columns.length }
                    }]
                });

                table = <Table
                    aria-label="Baselines Table"
                    data-ouia-component-id='baselines-table'
                    cells={ columns }
                    rows={ tableRows }
                    canSelectAll={ false }
                >
                    <TableHeader />
                    <TableBody />
                </Table>;
            } else {
                if (!baselinesRead && !createButton) {
                    return <EmptyStateDisplay
                        icon={ LockIcon }
                        color='#6a6e73'
                        title={ 'You do not have access to Baselines' }
                        text={ [ 'Contact your organization administrator(s) for more information.' ] }
                    />;
                } else {
                    tableRows = this.renderRows(baselinesWrite);

                    table = <Table
                        className='baseline-table'
                        aria-label="Baselines Table"
                        data-ouia-component-id='baselines-table'
                        onSort={ this.onSort }
                        onSelect={ baselinesWrite || ((tableId === 'CHECKBOX' || tableId === 'COMPARISON') && !kebab)
                            ? onSelect
                            : false }
                        sortBy={ this.state.sortBy }
                        cells={ columns }
                        rows={ tableRows }
                        canSelectAll={ false }
                        selectVariant={ !hasMultiSelect ? RowSelectVariant.radio : RowSelectVariant.checkbox }
                        isStickyHeader
                    >
                        <TableHeader />
                        <TableBody />
                    </Table>;
                }
            }
        } else if (loading) {
            table = <SkeletonTable
                columns={ columns }
                rowSize={ 8 }
                onSelect={ true }
                hasRadio={ !hasMultiSelect }
                canSelectAll={ false }
                isSelectable={ true }
            />;
        }

        return table;
    }

    renderEmptyState = (permissions) => {
        const { baselineError, emptyState, loading, revertBaselineFetch } = this.props;
        const { errorMessage } = this.state;

        if (!baselineError.status) {
            return <EmptyStateDisplay
                icon={ AddCircleOIcon }
                title={ EMPTY_BASELINES_TITLE }
                text={ EMPTY_BASELINES_MESSAGE }
                button={ <CreateBaselineButton
                    emptyState={ emptyState }
                    permissions={ permissions }
                    loading={ loading } /> }
            />;
        } else if (baselineError.status !== 200 && baselineError.status !== undefined) {
            return <EmptyStateDisplay
                icon={ ExclamationCircleIcon }
                color='#c9190b'
                title={ 'Baselines cannot be displayed' }
                text={ errorMessage }
                error={ 'Error ' + baselineError.status + ': ' + baselineError.detail }
                button={ <a onClick={ () => revertBaselineFetch('CHECKBOX') }>
                    <UndoIcon className='reload-button' />
                        Retry
                </a> }
            />;
        }
    }

    render() {
        const { kebab, createButton, exportToCSV, exportToJSON, exportButton, hasMultiSelect, leftAlignToolbar, loading,
            onBulkSelect, permissions, selectedBaselineIds, tableData, tableId, totalBaselines, emptyState } = this.props;
        const { page, perPage } = this.state;

        return (
            <React.Fragment>

                { permissions.baselinesRead === false
                    ? <EmptyStateDisplay
                        icon={ LockIcon }
                        color='#6a6e73'
                        title={ 'You do not have access to Baselines' }
                        text={ [ 'Contact your organization administrator(s) for more information.' ] }
                    />
                    : emptyState && !loading
                        ? this.renderEmptyState(permissions)
                        :
                        <Card className='pf-t-light pf-m-opaque-100' >
                            <BaselinesToolbar
                                createButton={ createButton }
                                exportButton={ exportButton }
                                kebab={ kebab }
                                onSearch={ this.onSearch }
                                tableId={ tableId }
                                fetchWithParams={ this.fetchWithParams }
                                tableData={ tableData }
                                onBulkSelect={ onBulkSelect }
                                hasMultiSelect={ hasMultiSelect }
                                selectedBaselineIds={ selectedBaselineIds }
                                isDeleteDisabled={ selectedBaselineIds?.length < 1 }
                                page={ page }
                                perPage={ perPage }
                                totalBaselines={ totalBaselines }
                                updatePagination={ this.updatePagination }
                                exportToCSV={ exportToCSV }
                                exportToJSON={ exportToJSON }
                                leftAlignToolbar={ leftAlignToolbar }
                                loading={ loading }
                                permissions={ permissions }
                            />
                            {this.renderTable(permissions)}
                            <Toolbar>
                                <ToolbarGroup className='pf-c-pagination'>
                                    <ToolbarItem>
                                        <TablePagination
                                            page={ page }
                                            perPage={ perPage }
                                            total={ !permissions.baselinesRead ? 0 : totalBaselines }
                                            isCompact={ false }
                                            updatePagination={ this.updatePagination }
                                            tableId={ tableId }
                                        />
                                    </ToolbarItem>
                                </ToolbarGroup>
                            </Toolbar>
                        </Card>
                }
            </React.Fragment>
        );
    }
}

BaselinesTable.propTypes = {
    loading: PropTypes.bool,
    tableData: PropTypes.array,
    fetchBaselines: PropTypes.func,
    tableId: PropTypes.string,
    hasMultiSelect: PropTypes.bool,
    onClick: PropTypes.func,
    kebab: PropTypes.bool,
    createButton: PropTypes.bool,
    exportButton: PropTypes.bool,
    onSelect: PropTypes.func,
    columns: PropTypes.array,
    onBulkSelect: PropTypes.func,
    selectedBaselineIds: PropTypes.array,
    totalBaselines: PropTypes.number,
    exportToCSV: PropTypes.func,
    exportToJSON: PropTypes.func,
    permissions: PropTypes.object,
    basketIsVisible: PropTypes.bool,
    leftAlignToolbar: PropTypes.bool,
    hasSwitch: PropTypes.bool,
    notificationsSwitchError: PropTypes.object,
    emptyState: PropTypes.bool,
    toggleNotificationPending: PropTypes.func,
    toggleNotificationFulfilled: PropTypes.func,
    toggleNotificationRejected: PropTypes.func,
    baselineError: PropTypes.object,
    revertBaselineFetch: PropTypes.func
};

/*eslint-disable camelcase*/
function mapDispatchToProps(dispatch) {
    return {
        fetchBaselines: (tableId, params) => dispatch(baselinesTableActions.fetchBaselines(tableId, params)),
        exportToCSV: (exportData)=> {
            dispatch(baselinesTableActions.exportToCSV(exportData));
        },
        exportToJSON: (exportData)=> {
            dispatch(baselinesTableActions.exportToJSON(exportData));
        },
        toggleNotificationPending: () => dispatch(editBaselineActions.toggleNotificationPending()),
        toggleNotificationFulfilled: (data) => dispatch(editBaselineActions.toggleNotificationFulfilled(data)),
        toggleNotificationRejected: (error, id, display_name) => {
            dispatch(editBaselineActions.toggleNotificationRejected(error, id, display_name));
        },
        revertBaselineFetch: (tableId) => dispatch(baselinesTableActions.revertBaselineFetch(tableId))
    };
}
/*eslint-enable camelcase*/

export default connect(null, mapDispatchToProps)(BaselinesTable);
