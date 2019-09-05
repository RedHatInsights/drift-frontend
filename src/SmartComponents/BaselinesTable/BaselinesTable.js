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

    async componentDidMount() {
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
        const { fullBaselineListData, baselineTableData, baselineListLoading, addSystemModalOpened } = this.props;
        let columns = [ 'Name', 'Last Sync' ];
        let loadingRows = [];
        let table;

        if (fullBaselineListData.length !== 0 && !baselineListLoading) {
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
                let newColumns = [ 'Name', 'Last Sync', '' ];

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
                    <Title size="lg">Add baselines</Title>
                    <EmptyStateBody>
                        You currently have no baselines saved.
                        <br></br>
                        Please add at least one baseline.
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

function mapStateToProps(state) {
    return {
        loading: state.baselinesTableState.loading,
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

BaselinesTable.propTypes = {
    baselineListLoading: PropTypes.bool,
    fullBaselineListData: PropTypes.array,
    baselineTableData: PropTypes.array,
    createBaselinesTable: PropTypes.func,
    selectBaseline: PropTypes.func,
    addSystemModalOpened: PropTypes.bool,
    fetchBaselines: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(BaselinesTable);
