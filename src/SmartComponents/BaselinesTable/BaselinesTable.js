import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Table, TableBody, TableHeader, sortable } from '@patternfly/react-table';
import { Skeleton, SkeletonSize, EmptyTable } from '@redhat-cloud-services/frontend-components';
import {
    Title,
    EmptyStateBody,
    Bullseye,
    EmptyState,
    EmptyStateVariant
} from '@patternfly/react-core';

import BaselineTableKebab from './BaselineTableKebab/BaselineTableKebab';
import { baselinesTableActions } from './redux';
import BaselinesToolbar from './BaselinesToolbar/BaselinesToolbar';

class BaselinesTable extends Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);

        this.state = {
            sortBy: {
                index: this.props.hasSelect ? 1 : 0,
                direction: 'asc'
            },
            search: undefined,
            orderBy: 'display_name',
            orderHow: 'ASC'
        };
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();

        this.fetchBaselines();
    }

    componentDidUpdate(prevProps) {
        const { fetchBaselines } = this.props;

        if (this.props.createBaselineModalOpened === false && prevProps.createBaselineModalOpened === true) {
            fetchBaselines();
        }
    }

    fetchBaselines = ({
        search = this.state.search,
        orderBy = this.state.orderBy,
        orderHow = this.state.orderHow
    } = {}) => {
        /*eslint-disable camelcase*/
        let params = {
            order_by: orderBy,
            order_how: orderHow
        };

        if (search) {
            params.display_name = search;
        }
        /*eslint-enable camelcase*/

        this.props.fetchBaselines(params);
    }

    onSearch = (search) => {
        this.setState({ search });
        this.fetchBaselines();
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

        selectBaseline(ids, isSelected);
    }

    onSingleSelect = (event, isSelected, rowId) => {
        const { baselineTableData, selectOneBaseline } = this.props;
        let id;

        if (rowId === -1) {
            id = '';
        } else {
            id = baselineTableData[rowId][0];
        }

        selectOneBaseline(id, isSelected);
    }

    onSort = (_event, index, direction) => {
        let orderBy = '';
        let startIndex = this.props.hasSelect ? 1 : 0;

        if (index === startIndex) {
            orderBy = 'display_name';
        } else if (index === startIndex + 1) {
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

        this.fetchBaselines({ orderBy, orderHow: direction.toUpperCase() });
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
        const { baselineTableData, kebab } = this.props;
        let table = [];

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

            if (kebab) {
                let kebab = <BaselineTableKebab baselineRowData={ baseline } />;
                row.push(<div>{ kebab }</div>);
            }

            if (baseline.selected) {
                row.selected = true;
            }

            table.push(row);
        });

        return table;
    }

    createModalRows() {
        const { baselineTableData } = this.props;
        let modalRows = [];

        for (let i = 0; i < baselineTableData.length; i++) {
            modalRows.push([ baselineTableData[i][1], baselineTableData[i][2] ]);

            if (baselineTableData[i].selected) {
                modalRows[i].selected = true;
            }
        }

        return modalRows;
    }

    renderTable() {
        const { baselineTableData, baselineListLoading, baselineDeleteLoading,
            createBaselineModalOpened, addSystemModalOpened, hasSelect } = this.props;
        let columns = [
            { title: 'Name', transforms: [ sortable ]},
            { title: 'Last updated', transforms: [ sortable ]}
        ];
        let loadingRows = [];
        let modalRows = [];
        let table;

        if (!baselineListLoading && !baselineDeleteLoading) {
            if (addSystemModalOpened) {
                modalRows = this.createModalRows();

                table = <Table
                    aria-label="Baselines Table"
                    onSort={ this.onSort }
                    sortBy={ this.state.sortBy }
                    onSelect={ hasSelect ? this.onSelect : false }

                    cells={ columns }
                    rows={ modalRows }
                >
                    <TableHeader />
                    <TableBody />
                </Table>;
            } else if (createBaselineModalOpened) {
                modalRows = this.createModalRows();

                table = <Table
                    aria-label="Baselines Table"
                    onSelect={ hasSelect ? this.onSingleSelect : false }
                    cells={ columns }
                    rows={ modalRows }
                >
                    <TableHeader />
                    <TableBody />
                </Table>;
            } else if (baselineTableData.length === 0) {
                let emptyRow = <EmptyTable>
                    <Bullseye>
                        <EmptyState variant={ EmptyStateVariant.full }>
                            <Title headingLevel="h5" size="lg">
                                No matching baselines found
                            </Title>
                            <EmptyStateBody>
                                This filter criteria matches no baselines. <br /> Try changing your filter settings.
                            </EmptyStateBody>
                        </EmptyState>
                    </Bullseye>
                </EmptyTable>;

                modalRows.push({
                    cells: [{
                        title: emptyRow,
                        props: { colSpan: columns.length }
                    }]
                });

                table = <Table
                    aria-label="Baselines Table"
                    cells={ columns }
                    rows={ modalRows }
                >
                    <TableHeader />
                    <TableBody />
                </Table>;
            } else {
                let newTableData;
                newTableData = this.renderRows();
                columns.push('');

                table = <Table
                    aria-label="Baselines Table"
                    onSort={ this.onSort }
                    onSelect={ hasSelect ? this.onSelect : false }
                    sortBy={ this.state.sortBy }
                    cells={ columns }
                    rows={ newTableData }
                >
                    <TableHeader />
                    <TableBody />
                </Table>;
            }
        } else {
            loadingRows = this.renderLoadingRows();

            table = <Table
                aria-label="Baselines Table"
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
        const { kebab, createButton, exportButton } = this.props;

        return (
            <React.Fragment>
                <BaselinesToolbar
                    createButton={ createButton }
                    exportButton={ exportButton }
                    kebab={ kebab }
                    onSearch={ this.onSearch }
                />
                { this.renderTable() }
            </React.Fragment>
        );
    }
}

BaselinesTable.propTypes = {
    baselineListLoading: PropTypes.bool,
    baselineDeleteLoading: PropTypes.bool,
    baselineTableData: PropTypes.array,
    createBaselinesTable: PropTypes.func,
    selectBaseline: PropTypes.func,
    selectOneBaseline: PropTypes.func,
    addSystemModalOpened: PropTypes.bool,
    fetchBaselines: PropTypes.func,
    history: PropTypes.object,
    kebab: PropTypes.bool,
    createButton: PropTypes.bool,
    exportButton: PropTypes.bool,
    createBaselineModalOpened: PropTypes.bool,
    hasSelect: PropTypes.bool,
    hasSingleSelect: PropTypes.bool,
    clearSelectedBaselines: PropTypes.func
};

function mapStateToProps(state) {
    return {
        baselineDeleteLoading: state.baselinesTableState.baselineDeleteLoading,
        baselineListLoading: state.baselinesTableState.baselineListLoading,
        baselineTableData: state.baselinesTableState.baselineTableData,
        addSystemModalOpened: state.addSystemModalState.addSystemModalOpened,
        createBaselineModalOpened: state.createBaselineModalState.createBaselineModalOpened
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectBaseline: (id, isSelected) => dispatch(baselinesTableActions.selectBaseline(id, isSelected)),
        selectOneBaseline: (id, isSelected) => dispatch(baselinesTableActions.selectOneBaseline(id, isSelected)),
        fetchBaselines: (params) => dispatch(baselinesTableActions.fetchBaselines(params)),
        clearSelectedBaselines: () => dispatch(baselinesTableActions.clearSelectedBaselines())
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BaselinesTable));
