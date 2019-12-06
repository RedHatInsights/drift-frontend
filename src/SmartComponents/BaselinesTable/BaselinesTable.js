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
    EmptyStateVariant,
    Radio
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

    selectedBaselineIds = () => {
        return this.props.selectedBaselineIds;
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

        this.props.fetchBaselines(params, this.props.isModal);
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

        rowData.push(<div className='checkbox-column'><Skeleton size={ SkeletonSize.lg } /></div>);
        for (let i = 0; i < 2; i += 1) {
            rowData.push(<div><Skeleton size={ SkeletonSize.md } /></div>);
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

    onSingleSelect = (_, event) => {
        const { selectOneBaseline, isBaselineSelected } = this.props;
        let id = event.currentTarget.id;

        selectOneBaseline(id);
        isBaselineSelected(id);
    }

    renderRadioButton = (data) => {
        return (
            <React.Fragment>
                <Radio
                    aria-label={ 'radio' + data[1] }
                    isChecked={ data.selected }
                    onChange={ this.onSingleSelect }
                    name={ data[1] }
                    id={ data[0] }
                />
            </React.Fragment>
        );
    }

    createModalRows(modalData) {
        let modalRows = [];
        let baselineData = modalData.baselineData;
        let isRadio = modalData.isRadio;

        for (let i = 0; i < baselineData.length; i++) {
            let modalRow = [];

            isRadio
                ? modalRow.push(<td className='pf-c-table__check'>{ this.renderRadioButton(baselineData[i]) }</td>)
                : null;
            modalRow.push(baselineData[i][1]);
            modalRow.push(baselineData[i][2]);

            if (baselineData[i].selected) {
                modalRow.selected = true;
            }

            modalRows.push(modalRow);
        }

        return modalRows;
    }

    renderTable() {
        const { baselineTableData, baselineListLoading, baselineDeleteLoading,
            isModal, addSystemModalOpened, hasSelect, modalTableData } = this.props;
        let columns = [
            { title: 'Name', transforms: [ sortable ]},
            { title: 'Last updated', transforms: [ sortable ]}
        ];
        let radioColumns = [
            { title: '' },
            { title: 'Name', transforms: [ sortable ]},
            { title: 'Last updated', transforms: [ sortable ]}
        ];
        let loadingRows = [];
        let modalRows = [];
        let table;

        if (!baselineListLoading && !baselineDeleteLoading) {
            if (addSystemModalOpened) {
                modalRows = this.createModalRows({
                    baselineData: baselineTableData,
                    isRadio: false
                });

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
            } else if (isModal) {
                modalRows = this.createModalRows({
                    baselineData: modalTableData,
                    isRadio: true
                });

                table = <Table
                    aria-label="Baselines Table"
                    onSort={ this.onSort }
                    sortBy={ this.state.sortBy }
                    cells={ radioColumns }
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
                cells={ radioColumns }
                rows={ loadingRows }
            >
                <TableHeader />
                <TableBody />
            </Table>;
        }

        return table;
    }

    render() {
        const { kebab, createButton, exportButton, toggleModal, isModal, createBaselineModalOpened } = this.props;

        return (
            <React.Fragment>
                <BaselinesToolbar
                    createButton={ createButton }
                    exportButton={ exportButton }
                    kebab={ kebab }
                    onSearch={ this.onSearch }
                    toggleModal={ toggleModal }
                />
                { !isModal && createBaselineModalOpened
                    ? null
                    : this.renderTable()
                }
            </React.Fragment>
        );
    }
}

BaselinesTable.propTypes = {
    baselineListLoading: PropTypes.bool,
    baselineDeleteLoading: PropTypes.bool,
    baselineTableData: PropTypes.array,
    modalTableData: PropTypes.array,
    createBaselinesTable: PropTypes.func,
    selectBaseline: PropTypes.func,
    addSystemModalOpened: PropTypes.bool,
    fetchBaselines: PropTypes.func,
    history: PropTypes.object,
    kebab: PropTypes.bool,
    createButton: PropTypes.bool,
    exportButton: PropTypes.bool,
    isModal: PropTypes.bool,
    createBaselineModalOpened: PropTypes.bool,
    hasSelect: PropTypes.bool,
    hasSingleSelect: PropTypes.bool,
    toggleModal: PropTypes.func,
    isBaselineSelected: PropTypes.func,
    selectedBaselineIds: PropTypes.func,
    selectOneBaseline: PropTypes.func
};

function mapStateToProps(state) {
    return {
        baselineDeleteLoading: state.baselinesTableState.baselineDeleteLoading,
        baselineListLoading: state.baselinesTableState.baselineListLoading,
        baselineTableData: state.baselinesTableState.baselineTableData,
        modalTableData: state.baselinesTableState.modalTableData,
        addSystemModalOpened: state.addSystemModalState.addSystemModalOpened,
        createBaselineModalOpened: state.createBaselineModalState.createBaselineModalOpened
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectBaseline: (id, isSelected) => dispatch(baselinesTableActions.selectBaseline(id, isSelected)),
        fetchBaselines: (params, isModal) => dispatch(baselinesTableActions.fetchBaselines(params, isModal)),
        selectOneBaseline: (id) => dispatch(baselinesTableActions.selectOneBaseline(id))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BaselinesTable));
