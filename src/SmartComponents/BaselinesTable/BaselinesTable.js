import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

import { baselinesTableActions } from './redux';

class BaselinesTable extends Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
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

    renderTable() {
        const { fullBaselineListData, baselineTableData, loading } = this.props;
        let columns = [ 'Name', 'Last Sync' ];
        let loadingRows = [];
        let table;

        if (fullBaselineListData.length !== 0 && !loading) {
            table = <Table
                onSelect={ this.onSelect }
                cells={ columns }
                rows={ baselineTableData }
            >
                <TableHeader />
                <TableBody />
            </Table>;
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

    render() {
        return (
            this.renderTable()
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.baselinesTableState.loading,
        fullBaselineListData: state.baselinesTableState.fullBaselineListData,
        baselineTableData: state.baselinesTableState.baselineTableData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectBaseline: (rows) => dispatch(baselinesTableActions.selectBaseline(rows))
    };
}

BaselinesTable.propTypes = {
    loading: PropTypes.bool,
    fullBaselineListData: PropTypes.array,
    baselineTableData: PropTypes.object,
    createBaselinesTable: PropTypes.func,
    selectBaseline: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(BaselinesTable);
