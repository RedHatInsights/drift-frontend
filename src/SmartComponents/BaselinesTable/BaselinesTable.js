import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

import BaselineTableKebab from './BaselineTableKebab/BaselineTableKebab';
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

    fetchBaseline = (baselineId) => {
        const { history } = this.props;

        history.push('baselines/' + baselineId);
    }

    renderRows() {
        const { baselineTableData } = this.props;
        let tableWithKebab = [];

        baselineTableData.forEach((baseline) => {
            let row = [];
            let link = <div>
                <a className="pointer active-blue"
                    onClick={ () => this.fetchBaseline(baseline[0]) }
                >
                    { baseline[1] }
                </a>
            </div>;
            row.push(link);
            row.push(baseline[2]);

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
        let modalRows = [];
        let table;

        if (fullBaselineListData.length !== 0 && !baselineListLoading && !baselineDeleteLoading) {
            if (addSystemModalOpened) {
                for (let i = 0; i < baselineTableData.length; i++) {
                    modalRows.push([ baselineTableData[i][1], baselineTableData[i][2] ]);

                    if (baselineTableData[i].selected) {
                        modalRows[i].selected = true;
                    }
                }

                table = <Table
                    onSelect={ this.onSelect }
                    cells={ columns }
                    rows={ modalRows }
                >
                    <TableHeader />
                    <TableBody />
                </Table>;
            } else {
                let newTableData;
                newTableData = this.renderRows();
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

    render() {
        return (
            <React.Fragment>
                { this.renderTable() }
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
    fetchBaselines: PropTypes.func,
    history: PropTypes.obj
};

function mapStateToProps(state) {
    return {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BaselinesTable));
