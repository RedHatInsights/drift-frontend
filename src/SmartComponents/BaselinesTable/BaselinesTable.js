import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

import BaselineTableKebab from './BaselineTableKebab/BaselineTableKebab';
import CreateBaselineButton from '../BaselinesPage/CreateBaselineButton/CreateBaselineButton';
import { baselinesTableActions } from './redux';

class BaselinesTable extends Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }

    componentDidMount() {
        const { fetchBaselines } = this.props;

        fetchBaselines();
    }

    onSelect(event, isSelected, rowId) {
        const { baselineTableData, selectBaseline } = this.props;
        let rows;

        if (rowId === -1) {
            rows = baselineTableData.map(oneRow => {
                oneRow.selected = isSelected;
                return oneRow;
            });
        } else {
            rows = [ ...baselineTableData ];
            rows[rowId].selected = isSelected;
        }

        selectBaseline(rows);
    }

    renderLoadingRows() {
        let rows = [];
        let rowData = [];

        for (let i = 0; i < 2; i += 1) {
            rowData.push(<Skeleton size={ SkeletonSize.md } />);
        }

        for (let i = 0; i < 5; i += 1) {
            rows.push(rowData);
        }

        return rows;
    }

    renderKebab() {
        const { baselineTableData } = this.props;
        let tableWithKebab = [];

        baselineTableData.forEach(function(baseline) {
            let row = [];
            baseline.forEach(function(data) {
                row.push(data);
            });
            let kebab = <BaselineTableKebab baselineRowData={ baseline } />;
            row.push(<div>{ kebab }</div>);
            tableWithKebab.push(row);
        });

        return tableWithKebab;
    }

    renderTable() {
        const { fullBaselineListData, baselineTableData, baselineListLoading, baselineDeleteLoading, addSystemModalOpened } = this.props;
        let columns = [ 'Name', 'Last updated' ];
        let loadingRows = [];
        let table;

        if (fullBaselineListData.length !== 0 && !baselineListLoading && !baselineDeleteLoading) {
            if (addSystemModalOpened) {
                table = <Table
                    onSelect={ this.onSelect }
                    cells={ columns }
                    rows={ baselineTableData }
                >
                    <TableHeader />
                    <TableBody />
                </Table>;
            } else {
                let newTableData;
                newTableData = this.renderKebab();
                let newColumns = [ 'Name', 'Last updated', '' ];

                table = <Table
                    cells={ newColumns }
                    rows={ newTableData }
                >
                    <TableHeader />
                    <TableBody />
                </Table>;
            }
        } else {
            loadingRows = this.renderLoadingRows();

            table = <Table
                cells={ columns }
                rows={ loadingRows }
            >
                <TableHeader />
                <TableBody />
            </Table>;
        }

        return table;
    }

    renderEmptyState() {
        return (
            <center>
                <EmptyState>
                    <EmptyStateIcon icon={ AddCircleOIcon } />
                    <br></br>
                    <Title size="lg">No baselines</Title>
                    <EmptyStateBody>
                        You currently have no baselines displayed.
                        <br/>
                        Please create a baseline to use in your System Comparison analysis.
                    </EmptyStateBody>
                    <CreateBaselineButton />
                </EmptyState>
            </center>
        );
    }

    render() {
        const { fullBaselineListData, baselineListLoading } = this.props;

        return (
            <React.Fragment>
                { fullBaselineListData.length === 0 && baselineListLoading === false
                    ? this.renderEmptyState()
                    : this.renderTable()
                }
            </React.Fragment>
        );
    }
}

BaselinesTable.propTypes = {
    baselineListLoading: PropTypes.bool,
    baselineDeleteLoading: PropTypes.bool,
    fullBaselineListData: PropTypes.array,
    baselineTableData: PropTypes.array,
    createBaselinesTable: PropTypes.func,
    selectBaseline: PropTypes.func,
    addSystemModalOpened: PropTypes.bool,
    fetchBaselines: PropTypes.func
};

function mapStateToProps(state) {
    return {
        baselineListLoading: state.baselinesTableState.baselineListLoading,
        baselineDeleteLoading: state.baselinesTableState.baselineDeleteLoading,
        fullBaselineListData: state.baselinesTableState.fullBaselineListData,
        baselineTableData: state.baselinesTableState.baselineTableData,
        addSystemModalOpened: state.addSystemModalState.addSystemModalOpened
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectBaseline: (rows) => dispatch(baselinesTableActions.selectBaseline(rows)),
        fetchBaselines: () => dispatch(baselinesTableActions.fetchBaselines())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BaselinesTable);
