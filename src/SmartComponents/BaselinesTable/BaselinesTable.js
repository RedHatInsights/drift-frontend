import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RowSelectVariant, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { EmptyTable, SkeletonTable, TableToolbar } from '@redhat-cloud-services/frontend-components';
import { ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
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
import { Card, CardBody } from '@patternfly/react-core';

import { EMPTY_BASELINES_TITLE, EMPTY_BASELINES_MESSAGE,
    EMPTY_BASELINES_FILTER_TITLE, EMPTY_FILTER_MESSAGE, EMPTY_RADIO_MESSAGE } from '../../constants';
import { RegistryContext } from '../../Utilities/registry';

export class BaselinesTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            params: {
                sortBy: {
                    index: 1,
                    direction: 'asc'
                },
                search: undefined,
                orderBy: 'display_name',
                orderHow: 'ASC',
                page: 1,
                perPage: 20
            },
            bulkSelectType: '',
            errorMessage: [ 'The list of baselines cannot be displayed at this time. Please retry and if',
                'the problem persists contact your system administrator.',
                ''
            ]
        };
    }

    async componentDidMount() {
        await this.fetchWithParams();
    }

    async componentDidUpdate(prevProps) {
        if (!_.isEmpty(prevProps.baselineError) && _.isEmpty(this.props.baselineError)) {
            this.fetchWithParams();
        }
    }

    fetchWithParams = (fetchParams) => {
        const { tableId, fetchBaselines } = this.props;

        fetchParams = {
            ...this.state.params,
            ...fetchParams
        };

        let formattedParams = baselinesReducerHelpers.returnParams(fetchParams);
        fetchBaselines(tableId, formattedParams);
    }

    onSearch = (search) => {
        const { orderBy, orderHow } = this.state.params;

        let newSearch = search;
        this.setState({ search });
        this.fetchWithParams({ orderBy, orderHow, search: newSearch });
    }

    onSort = (_event, index, direction) => {
        const { search } = this.state.params;
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
            params: {
                ...this.state.params,
                sortBy: {
                    index,
                    direction
                },
                orderHow: direction.toUpperCase(),
                orderBy
            }
        });

        this.fetchWithParams({ orderBy, orderHow: direction.toUpperCase(), search });
    }

    setSelectedIds = (tableData) => {
        let ids = [];

        tableData.forEach(function(baseline) {
            ids.push(Array.isArray(baseline) ? baseline[0] : baseline.id);
        });

        return ids;
    }

    isAnyBaselineSelectedOnPage = (tableData) => {
        let isSomethingSelected = false;

        tableData.map(baseline => {
            if (baseline.selected === true) {
                isSomethingSelected = true;
            }
        });

        return isSomethingSelected;
    }

    onBulkSelect = async (param) => {
        const { bulkSelectBasket, tableData, tableId, selectBaseline, selectedBaselineIds } = this.props;
        let isSelected;
        let ids;
        this.setState({ bulkSelectType: param });

        if (param === 'none') {
            isSelected = false;
            ids = selectedBaselineIds;
        } else {
            ids = this.setSelectedIds(tableData);
            if (this.isAnyBaselineSelectedOnPage(tableData)) {
                isSelected = false;
            } else {
                isSelected = true;
            }
        }

        if (tableId === 'COMPARISON') {
            bulkSelectBasket(tableData, isSelected);
        }

        selectBaseline(ids, isSelected, tableId);
    }

    updatePagination = (pagination) => {
        this.setState({ params: { ...this.state.params, page: pagination.page, perPage: pagination.perPage }});
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

    renderError() {
        const { baselineError, revertBaselineFetch } = this.props;
        const { errorMessage } = this.state;

        return <EmptyStateDisplay
            icon={ ExclamationCircleIcon }
            color='#c9190b'
            title={ 'Baselines cannot be displayed' }
            text={ errorMessage }
            error={ 'Error ' + baselineError.status + ': ' + baselineError.detail }
            button={ <a onClick={ () => revertBaselineFetch() }>
                <UndoIcon className='reload-button' />
                    Retry
            </a> }
        />;
    }

    renderBaselinesPageError() {
        const { emptyState, loading, permissions, baselineError } = this.props;

        if (baselineError.status !== 200 && baselineError.status !== undefined) {
            return this.renderError();
        } else {
            return <EmptyStateDisplay
                icon={ AddCircleOIcon }
                title={ EMPTY_BASELINES_TITLE }
                text={ EMPTY_BASELINES_MESSAGE }
                button={ <CreateBaselineButton
                    emptyState={ emptyState }
                    permissions={ permissions }
                    loading={ loading } /> }
            />;
        }
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
                        sortBy={ this.state.params.sortBy }
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

        return <Card className='pf-t-light pf-m-opaque-100 tableNoPadding'>
            <CardBody>
                { table }
            </CardBody>
        </Card>;
    }

    renderEmptyState = (permissions) => {
        const { baselineError, columns, tableId } = this.props;
        let tableRows = [];
        let table;
        let emptyRow;

        if (baselineError.status !== 200 && baselineError.status !== undefined) {
            return this.renderError();
        }

        if (tableId === 'RADIO') {
            emptyRow = <EmptyTable>
                <EmptyStateDisplay
                    title={ EMPTY_BASELINES_TITLE }
                    text={ EMPTY_RADIO_MESSAGE }
                />
            </EmptyTable>;
        } else if (tableId === 'COMPARISON') {
            if (permissions.baselinesRead === false) {
                emptyRow = <EmptyStateDisplay
                    icon={ LockIcon }
                    color='#6a6e73'
                    title={ 'You do not have access to Baselines' }
                    text={ [ 'Contact your organization administrator(s) for more information.' ] }
                />;
            } else {
                emptyRow = <EmptyTable>
                    <EmptyStateDisplay
                        title={ EMPTY_BASELINES_TITLE }
                        text={ EMPTY_BASELINES_MESSAGE }
                    />
                </EmptyTable>;
            }
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
        return table;
    }

    render() {
        const { createButton, emptyState, exportStatus, exportToCSV, exportToJSON, exportButton, hasMultiSelect, kebab, leftAlignToolbar,
            loading, permissions, resetBaselinesExportStatus, selectedBaselineIds, tableData, tableId, totalBaselines } = this.props;
        const { page, perPage } = this.state.params;

        return (
            <RegistryContext.Consumer>
                {
                    registryContextValue =>
                        (<>
                            { tableId === 'CHECKBOX' && emptyState && !loading
                                ? this.renderBaselinesPageError()
                                : <React.Fragment>
                                    <BaselinesToolbar
                                        createButton={ createButton }
                                        exportButton={ exportButton }
                                        exportStatus={ exportStatus }
                                        kebab={ kebab }
                                        onSearch={ this.onSearch }
                                        tableId={ tableId }
                                        fetchWithParams={ this.fetchWithParams }
                                        tableData={ tableData }
                                        onBulkSelect={ this.onBulkSelect }
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
                                        resetBaselinesExportStatus={ resetBaselinesExportStatus }
                                        store={ registryContextValue?.registry.getStore() }
                                    />
                                    { emptyState && !loading
                                        ? this.renderEmptyState(permissions)
                                        : this.renderTable(permissions)
                                    }
                                    <TableToolbar isFooter>
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
                                    </TableToolbar>
                                </React.Fragment>
                            }
                        </>)}
            </RegistryContext.Consumer>
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
    exportStatus: PropTypes.string,
    onSelect: PropTypes.func,
    columns: PropTypes.array,
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
    selectBaseline: PropTypes.func,
    toggleNotificationPending: PropTypes.func,
    toggleNotificationFulfilled: PropTypes.func,
    toggleNotificationRejected: PropTypes.func,
    baselineError: PropTypes.object,
    revertBaselineFetch: PropTypes.func,
    bulkSelectBasket: PropTypes.func,
    resetBaselinesExportStatus: PropTypes.func
};

/*eslint-disable camelcase*/
function mapDispatchToProps(dispatch) {
    return {
        fetchBaselines: (tableId, params) => dispatch(baselinesTableActions.fetchBaselines(tableId, params)),
        exportToCSV: (tableId, exportData)=> {
            dispatch(baselinesTableActions.exportToCSV(tableId, exportData));
        },
        exportToJSON: (tableId, exportData)=> {
            dispatch(baselinesTableActions.exportToJSON(tableId, exportData));
        },
        toggleNotificationPending: () => dispatch(editBaselineActions.toggleNotificationPending()),
        toggleNotificationFulfilled: (data) => dispatch(editBaselineActions.toggleNotificationFulfilled(data)),
        toggleNotificationRejected: (error, id, display_name) => {
            dispatch(editBaselineActions.toggleNotificationRejected(error, id, display_name));
        }
    };
}
/*eslint-enable camelcase*/

export default connect(null, mapDispatchToProps)(BaselinesTable);
