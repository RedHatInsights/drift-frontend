import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { Skeleton, SkeletonSize, EmptyTable } from '@redhat-cloud-services/frontend-components';
import { Radio } from '@patternfly/react-core';

import BaselineTableKebab from './BaselineTableKebab/BaselineTableKebab';
import { baselinesTableActions } from './redux';
import baselinesReducerHelpers from './redux/helpers';
import BaselinesToolbar from './BaselinesToolbar/BaselinesToolbar';
import EmptyStateDisplay from '../EmptyStateDisplay/EmptyStateDisplay';

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
            emptyStateMessage: [
                'This filter criteria matches no baselines.',
                'Try changing your filter settings.'
            ]
        };
    }

    async componentDidMount() {
        const { tableId, fetchBaselines } = this.props;

        await window.insights.chrome.auth.getUser();
        baselinesReducerHelpers.fetchBaselines(tableId, fetchBaselines);
    }

    fetchWithParams = (fetchParams) => {
        const { tableId, fetchBaselines } = this.props;
        const { orderBy, orderHow, search } = this.state;

        baselinesReducerHelpers.fetchBaselines(
            tableId,
            fetchBaselines,
            fetchParams ? fetchParams : { orderBy, orderHow, search }
        );
    }

    onSearch = (search) => {
        const { orderBy, orderHow } = this.state;

        let newSearch = search;
        this.setState({ search });
        this.fetchWithParams({ orderBy, orderHow, search: newSearch });
    }

    onSort = (_event, index, direction) => {
        const { search } = this.state;
        let orderBy = '';

        if (index === 1) {
            orderBy = 'display_name';
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

    renderLoadingRows() {
        const { hasMultiSelect } = this.props;
        let rows = [];
        let rowData = [];

        if (!hasMultiSelect) {
            rowData.push(<div className='pf-c-table__check'><Skeleton size={ SkeletonSize.sm } /></div>);
        }

        for (let i = 0; i < 2; i += 1) {
            rowData.push(<div><Skeleton size={ SkeletonSize.md } /></div>);
        }

        for (let i = 0; i < 5; i += 1) {
            rows.push(rowData);
        }

        return rows;
    }

    renderRadioButton = (data) => {
        const { onSelect } = this.props;

        return (
            <React.Fragment>
                <Radio
                    aria-label={ 'radio' + data[1] }
                    isChecked={ data.selected }
                    onChange={ onSelect }
                    name={ data[1] }
                    id={ data[0] }
                />
            </React.Fragment>
        );
    }

    renderRows() {
        const { tableData, kebab, onClick, tableId, hasMultiSelect } = this.props;
        let table = [];

        tableData.forEach((baseline) => {
            let row = [];

            if (!hasMultiSelect) {
                row.push(
                    <td className='pf-c-table__check'>{ this.renderRadioButton(baseline) }</td>
                );
            }

            if (onClick) {
                let link = <div>
                    <a className="pointer active-blue"
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

            if (kebab) {
                let kebab = <BaselineTableKebab
                    tableId={ tableId }
                    baselineRowData={ baseline }
                    fetchWithParams={ this.fetchWithParams }
                />;
                row.push(<div>{ kebab }</div>);
            }

            if (baseline.selected) {
                row.selected = true;
            }

            table.push(row);
        });

        return table;
    }

    renderTable() {
        const { tableData, loading, columns, onSelect, hasMultiSelect } = this.props;
        const { emptyStateMessage } = this.state;
        let loadingRows = [];
        let tableRows = [];
        let table;

        if (!loading) {
            if (tableData.length === 0) {
                let emptyRow = <EmptyTable>
                    <EmptyStateDisplay
                        title={ 'No matching baselines found' }
                        text={ emptyStateMessage }
                    />
                </EmptyTable>;

                tableRows.push({
                    cells: [{
                        title: emptyRow,
                        props: { colSpan: columns.length }
                    }]
                });

                table = <Table
                    aria-label="Baselines Table"
                    cells={ columns }
                    rows={ tableRows }
                    canSelectAll={ false }
                >
                    <TableHeader />
                    <TableBody />
                </Table>;
            } else {
                tableRows = this.renderRows();

                table = <Table
                    aria-label="Baselines Table"
                    onSort={ this.onSort }
                    onSelect={ hasMultiSelect ? onSelect : false }
                    sortBy={ this.state.sortBy }
                    cells={ columns }
                    rows={ tableRows }
                    canSelectAll={ false }
                >
                    <TableHeader />
                    <TableBody />
                </Table>;
            }
        } else if (loading) {
            loadingRows = this.renderLoadingRows();

            table = <Table
                aria-label="Loading Baselines Table"
                onSelect={ hasMultiSelect ? true : false }
                cells={ columns }
                rows={ loadingRows }
                canSelectAll={ false }
            >
                <TableHeader />
                <TableBody />
            </Table>;
        }

        return table;
    }

    render() {
        const { kebab, createButton, exportButton, hasMultiSelect, onBulkSelect, tableData, tableId } = this.props;

        return (
            <React.Fragment>
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
                />
                { this.renderTable() }
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
    onBulkSelect: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        fetchBaselines: (tableId, params) => dispatch(baselinesTableActions.fetchBaselines(tableId, params))
    };
}

export default connect(null, mapDispatchToProps)(BaselinesTable);
